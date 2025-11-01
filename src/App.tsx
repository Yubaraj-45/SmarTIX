import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AIRecommendations from './pages/AIRecommendations';
import Checkout from './pages/Checkout';
import OrganizerDashboard from './pages/OrganizerDashboard';
import BookingIntegrity from './pages/BookingIntegrity';
import DynamicPricingDashboard from './pages/DynamicPricingDashboard';
import UserDashboard from './pages/UserDashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/ai-recommendations" element={<AIRecommendations />} />
            <Route path="/categories" element={<Events />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
            <Route path="/dashboard/booking-integrity" element={<BookingIntegrity />} />
            <Route path="/dashboard/dynamic-pricing" element={<DynamicPricingDashboard />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
