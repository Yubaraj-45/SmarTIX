# supabase_backend.py
"""
FastAPI backend using Supabase as primary store.
Features:
- OpenAI embedding-based recommendations (embeddings cached in events.embedding)
- QR ticket creation + verification (HMAC-signed payload)
- Transactions persisted into supabase.transactions
- Fraud logging into supabase.fraud_log
- Simple forecasting (LinearRegression trained from transactions)
- Fraud scanning (IsolationForest)
"""

import os
import json
import hmac
import hashlib
import base64
import io
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict

from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
import qrcode
import numpy as np
from openai import OpenAI
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from joblib import dump, load
import pandas as pd

load_dotenv()

# Env
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QR_SIGNING_SECRET = os.getenv("QR_SIGNING_SECRET", "replace-this")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "admin123")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")

# clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# model cache paths (server disk)
IF_MODEL_PATH = "if_model.joblib"
LR_MODEL_PATH = "lr_forecast.joblib"
EMB_CACHE_PATH = "emb_cache.json"  # optional local index of embeddings (id->embedding)

app = FastAPI(title="Supabase-backed Event Recommendation & Ticketing")

# ---------- Helpers ----------
def admin_required(x_api_key: Optional[str] = Header(None)):
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin key")
    return True

def sign_payload(payload_json: str) -> str:
    sig = hmac.new(QR_SIGNING_SECRET.encode(), payload_json.encode(), hashlib.sha256).hexdigest()
    b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()
    return f"{b64}.{sig}"

def verify_signed_payload(signed: str) -> Dict:
    try:
        b64, sig = signed.rsplit(".", 1)
        payload_json = base64.urlsafe_b64decode(b64.encode()).decode()
        expected = hmac.new(QR_SIGNING_SECRET.encode(), payload_json.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, sig):
            raise HTTPException(status_code=400, detail="QR signature mismatch")
        return json.loads(payload_json)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed signed payload")

def generate_qr_base64(data: str) -> str:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()

# ---------- OpenAI embedding helpers ----------
def get_openai_embedding(text: str) -> List[float]:
    if not openai_client:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    resp = openai_client.embeddings.create(model="text-embedding-3-small", input=text)
    return resp.data[0].embedding

# Try to fetch event.embedding from Supabase; if missing compute & update row.
def ensure_event_embedding(event_row: dict) -> List[float]:
    # event_row is a dict from supabase with keys including 'id', 'title','description','tags','embedding'
    if event_row.get("embedding"):
        return np.array(event_row["embedding"], dtype=float)
    # build text
    title = event_row.get("title") or event_row.get("name") or ""
    tags = ""
    if event_row.get("tags"):
        # tags could be array already from supabase
        if isinstance(event_row["tags"], list):
            tags = " ".join([str(x) for x in event_row["tags"]])
        else:
            tags = str(event_row["tags"])
    desc = event_row.get("description") or ""
    text = f"{title} {tags} {desc}".strip() or "event"
    emb = get_openai_embedding(text)
    # store back to supabase events.embedding
    upd = supabase.table("events").update({"embedding": emb}).eq("id", event_row["id"]).execute()
    if upd.error:
        # log but continue
        print("Warning: failed to store embedding:", upd.error)
    return np.array(emb, dtype=float)

# ---------- Data-model endpoints ----------
class PurchaseRequest(BaseModel):
    user_id: int
    event_id: int
    amount: float
    currency: Optional[str] = "INR"

class QRVerifyRequest(BaseModel):
    signed_payload: str

# ---------- Recommendations (embeddings + cosine) ----------
@app.get("/recommendations/{user_id}")
def recommendations(user_id: int, top_k: int = 5):
    # fetch all events with embeddings
    res = supabase.table("events").select("*").execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    events = res.data or []
    if not events:
        raise HTTPException(status_code=404, detail="No events")

    # fetch user_activity for user
    act = supabase.table("user_activity").select("*").eq("user_id", user_id).execute()
    if act.error:
        raise HTTPException(status_code=500, detail=str(act.error))
    activities = act.data or []

    # if no activity -> return upcoming or recent events
    if not activities:
        # sort by created_at or start_time
        sorted_events = sorted(events, key=lambda e: e.get("start_time") or e.get("created_at") or "", reverse=False)
        return {"recommendations": sorted_events[:top_k]}

    # build user profile by concatenating texts of events user interacted with
    user_event_ids = [a.get("event_id") for a in activities if a.get("event_id")]
    if not user_event_ids:
        # fallback
        return {"recommendations": events[:top_k]}

    # fetch events the user interacted with to build user-text
    user_event_rows = [e for e in events if e["id"] in user_event_ids]
    user_text = " ".join(
        (r.get("title") or r.get("name") or "") + " " + ((" ".join(r["tags"]) if isinstance(r.get("tags"), list) else str(r.get("tags") or "")))
        for r in user_event_rows
    ) or "events"

    user_emb = np.array(get_openai_embedding(user_text), dtype=float)

    # ensure all events have embeddings and compute similarity
    scored = []
    for e in events:
        emb = ensure_event_embedding(e)
        # skip events user already interacted with
        if e["id"] in user_event_ids:
            continue
        sim = float(np.dot(user_emb, emb) / (np.linalg.norm(user_emb) * np.linalg.norm(emb) + 1e-9))
        scored.append((e, sim))
    scored_sorted = sorted(scored, key=lambda x: x[1], reverse=True)[:top_k]
    recommendations = [x[0] for x in scored_sorted]
    return {"recommendations": recommendations}

# ---------- Purchase & QR ----------
@app.post("/purchase")
def purchase(req: PurchaseRequest):
    # create transaction row (status pending/completed etc)
    insert = {
        "user_id": req.user_id,
        "event_id": req.event_id,
        "amount": req.amount,
        "currency": req.currency,
        "status": "completed",  # in production: set pending and confirm after payment webhook
        "created_at": datetime.utcnow().isoformat()
    }
    res = supabase.table("transactions").insert(insert).select("*").execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    tx = res.data[0]
    # prepare QR payload
    payload = {
        "transaction_id": tx["id"],
        "user_id": tx["user_id"],
        "event_id": tx["event_id"],
        "issued_at": datetime.utcnow().isoformat()
    }
    payload_json = json.dumps(payload, separators=(",", ":"), sort_keys=True)
    signed = sign_payload(payload_json)
    # Save signed payload into transactions.qr_signed_payload
    upd = supabase.table("transactions").update({"qr_signed_payload": signed}).eq("id", tx["id"]).select("*").execute()
    if upd.error:
        print("Warning: could not update transaction with qr payload", upd.error)
    qr_png_b64 = generate_qr_base64(signed)
    return {"transaction": tx, "qr_png_base64": qr_png_b64, "signed_payload": signed}

# ---------- Verify QR ----------
@app.post("/verify_qr")
def verify_qr(req: QRVerifyRequest):
    payload = verify_signed_payload(req.signed_payload)
    txid = payload.get("transaction_id")
    if txid is None:
        raise HTTPException(status_code=400, detail="transaction_id missing")
    res = supabase.table("transactions").select("*").eq("id", txid).execute()
    if res.error or not res.data:
        raise HTTPException(status_code=404, detail="transaction not found")
    tx = res.data[0]
    # Check status/completed
    if tx.get("status") != "completed":
        raise HTTPException(status_code=400, detail="transaction not completed")
    if tx.get("used_at"):
        # duplicate use -> log fraud
        log = {"transaction_id": txid, "reason": "duplicate_use", "details": json.dumps(payload), "created_at": datetime.utcnow().isoformat()}
        supabase.table("fraud_log").insert(log).execute()
        raise HTTPException(status_code=400, detail="ticket already used; logged as fraud")
    # mark used
    mark = {"used_at": datetime.utcnow().isoformat(), "status": "used"}
    ures = supabase.table("transactions").update(mark).eq("id", txid).select("*").execute()
    if ures.error:
        raise HTTPException(status_code=500, detail=str(ures.error))
    return {"ok": True, "transaction": ures.data[0]}

# ---------- Forecasting (simple regression) ----------
@app.get("/forecast/{event_id}")
def forecast(event_id: int, days_ahead: int = 1):
    # fetch transactions for event
    res = supabase.table("transactions").select("*").eq("event_id", event_id).execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    txs = res.data or []
    if not txs or len(txs) < 5:
        raise HTTPException(status_code=400, detail="not enough transaction history for forecasting")
    df = pd.DataFrame(txs)
    df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
    df["date"] = df["created_at"].dt.date
    df["amount"] = pd.to_numeric(df.get("amount", 0), errors="coerce").fillna(0)
    daily = df.groupby("date").agg({"amount": "sum"}).reset_index()
    # simple linear regression on day index
    daily["daynum"] = (pd.to_datetime(daily["date"]) - pd.to_datetime(daily["date"]).min()).dt.days
    X = daily[["daynum"]].values
    y = daily["amount"].values
    model = LinearRegression()
    model.fit(X, y)
    last_daynum = int(daily["daynum"].max())
    pred_day = last_daynum + days_ahead
    pred = model.predict([[pred_day]])[0]
    return {"event_id": event_id, "predicted_amount": float(max(pred, 0.0)), "days_ahead": days_ahead}

# ---------- Fraud scan ----------
@app.get("/fraud_scan")
def fraud_scan(anom_threshold: float = -0.1):
    res = supabase.table("transactions").select("*").execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    txs = res.data or []
    if not txs or len(txs) < 10:
        return {"flagged": []}
    df = pd.DataFrame(txs)
    df["amount"] = pd.to_numeric(df.get("amount", 0), errors="coerce").fillna(0)
    df["created_at"] = pd.to_datetime(df.get("created_at"), errors="coerce").fillna(pd.Timestamp.now())
    df["hour"] = df["created_at"].dt.hour
    df["dow"] = df["created_at"].dt.dayofweek
    X = df[["amount", "hour", "dow"]].values
    model = IsolationForest(n_estimators=100, random_state=42, contamination=0.02)
    model.fit(X)
    scores = model.decision_function(X)
    flagged = []
    for i, s in enumerate(scores):
        if s < anom_threshold:
            row = df.iloc[i].to_dict()
            flagged.append({"transaction_id": int(row.get("id", -1)), "score": float(s), "row": row})
    return {"flagged": flagged, "count": len(flagged)}

# ---------- Admin: ensure embeddings for all events ----------
@app.post("/admin/ensure_embeddings", dependencies=[Depends(admin_required)])
def ensure_all_event_embeddings(batch_size: int = 50):
    # fetch all events
    res = supabase.table("events").select("*").execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    events = res.data or []
    updated = 0
    for e in events:
        if e.get("embedding"):
            continue
        # compute and update
        try:
            ensure_event_embedding(e)
            updated += 1
        except Exception as exc:
            print("embed error", exc)
    return {"updated": updated, "total_events": len(events)}

# ---------- Organizer summary ----------
@app.get("/organiser/summary", dependencies=[Depends(admin_required)])
def organiser_summary(event_id: Optional[int] = None):
    # revenue, attendees, sales timeseries, top events
    q = supabase.table("transactions").select("*")
    if event_id:
        q = q.eq("event_id", event_id)
    res = q.execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    txs = res.data or []
    if not txs:
        return {"revenue": 0.0, "attendees": 0, "sales_timeseries": [], "top_events": []}
    df = pd.DataFrame(txs)
    df["amount"] = pd.to_numeric(df.get("amount", 0), errors="coerce").fillna(0)
    revenue = float(df["amount"].sum())
    attendees = int(df[df.get("status") == "used"]["user_id"].nunique()) if "status" in df.columns else int(df["user_id"].nunique())
    if "created_at" in df.columns:
        df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
        ts = df.groupby(df["created_at"].dt.date).agg({"amount":"sum"}).reset_index().to_dict(orient="records")
    else:
        ts = []
    top = df.groupby("event_id").agg({"amount":"sum"}).reset_index().sort_values("amount", ascending=False).head(5).to_dict(orient="records")
    return {"revenue": revenue, "attendees": attendees, "sales_timeseries": ts, "top_events": top}

# ---------- Health ----------
@app.get("/health")
def health():
    # quick check Supabase connectivity
    try:
        res = supabase.table("events").select("id").limit(1).execute()
        if res.error:
            raise Exception(res.error)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")
    return {"ok": True}

# Run with:
# uvicorn supabase_backend:app --reload
