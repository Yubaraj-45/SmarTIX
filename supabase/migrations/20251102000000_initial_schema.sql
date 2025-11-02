/*
          # Initial Schema Setup
          This migration script sets up the foundational tables for the SmarTIX application, including profiles, events, and bookings. It also establishes Row Level Security (RLS) to protect user data and creates a trigger to automatically manage user profiles upon sign-up.

          ## Query Description: 
          This is a structural and data setup operation. It creates new tables and seeds them with initial data. It is safe to run on a new project but could cause conflicts if these tables already exist. No existing data will be lost as it only creates new structures.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - **Tables Created**: `profiles`, `events`, `bookings`
          - **RLS Policies**: Enabled for all tables to ensure users can only access their own data.
          - **Triggers**: A trigger `on_auth_user_created` is added to automatically create a user profile upon new user registration.
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Establishes baseline security policies for user data access.
          - Auth Requirements: Policies are tied to the `authenticated` role and `auth.uid()`.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: One trigger is added, which has a negligible performance impact on user sign-ups.
          - Estimated Impact: Low.
          */

-- 1. PROFILES TABLE
-- Stores public user data.
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 2. EVENTS TABLE
-- Stores all event information.
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date TIMESTAMPTZ NOT NULL,
    time TEXT,
    venue TEXT,
    city TEXT,
    country TEXT,
    image TEXT,
    price_min INT,
    price_max INT,
    currency TEXT DEFAULT '₹',
    tickets_available INT,
    total_tickets INT,
    organizer TEXT,
    rating NUMERIC(2, 1),
    attendees INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by all users."
  ON events FOR SELECT
  USING ( true );

-- For admin/organizer roles in the future
CREATE POLICY "Allow full access for service_role"
  ON events FOR ALL
  USING ( auth.role() = 'service_role' );

-- 3. BOOKINGS TABLE
-- Stores user bookings.
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    ticket_tier TEXT NOT NULL,
    quantity INT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    booking_date TIMESTAMPTZ DEFAULT NOW(),
    qr_code_token UUID DEFAULT gen_random_uuid(),
    is_flagged BOOLEAN DEFAULT false,
    flag_reason TEXT
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings."
  ON bookings FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can create their own bookings."
  ON bookings FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- 4. TRIGGER FOR PROFILE CREATION
-- Automatically creates a profile for new users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. SEED EVENTS DATA
-- Populates the events table with some initial data.
INSERT INTO events (title, description, category, date, time, venue, city, country, image, price_min, price_max, tickets_available, total_tickets, organizer, rating, attendees)
VALUES
('IPL 2025 Finals', 'Witness the crowning of the champion! The grand finale of the Indian Premier League 2025.', 'Sports', '2025-05-28T14:00:00Z', '07:30 PM', 'Narendra Modi Stadium', 'Ahmedabad', 'India', 'https://images.unsplash.com/photo-1599554151244-8c03b3a3a41a?q=80&w=2070&auto=format&fit=crop', 2500, 15000, 5000, 100000, 'BCCI', 4.9, 95000),
('Stand-Up Comedy Night', 'Get ready for a night of laughter with top comedians from across the country.', 'Comedy', '2025-03-15T14:30:00Z', '08:00 PM', 'Canvas Laugh Club', 'Mumbai', 'India', 'https://images.unsplash.com/photo-1583624792939-3bbf9563483a?q=80&w=2070&auto=format&fit=crop', 499, 1500, 150, 300, 'Comedy Central', 4.7, 150),
('Sunburn Music Festival 2025', 'The biggest music festival is back! Phase 1 tickets are now live. Don''t miss out!', 'Music', '2025-12-27T10:00:00Z', '04:00 PM', 'Vagator Beach', 'Goa', 'India', 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop', 3500, 12000, 10000, 50000, 'Percept Live', 4.8, 40000),
('Tech Summit India 2025', 'Join industry leaders and innovators to explore the future of technology, AI, and blockchain.', 'Technology', '2025-08-22T04:30:00Z', '10:00 AM', 'Bangalore International Exhibition Centre', 'Bangalore', 'India', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop', 5000, 25000, 1000, 3000, 'TechCrunch', 4.6, 2000);
