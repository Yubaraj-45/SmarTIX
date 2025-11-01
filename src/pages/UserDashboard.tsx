import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Ticket } from 'lucide-react';
import { generateMockEvents, generateMockBookings } from '../utils/mockData';
import { Event, Booking } from '../types';
import EventCard from '../components/EventCard';
import { format } from 'date-fns';

const UserDashboard: React.FC = () => {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allEvents = generateMockEvents(20);
    const allBookings = generateMockBookings(10);
    
    setRecommendedEvents(allEvents.filter(e => e.aiScore && e.aiScore > 0.9).slice(0, 4));
    
    const userBookings = allBookings
      .filter(b => b.userId === 'user-1' && new Date(b.bookingDate) < new Date())
      .map(b => ({...b, event: allEvents.find(e => e.id === b.eventId)}))
      .filter(b => b.event && b.event.date > new Date());
      
    setUpcomingBookings(userBookings as (Booking & {event: Event})[]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome Back, Alex!</h1>
              <p className="text-slate-600 dark:text-slate-400">Here's your personalized event hub.</p>
            </div>
          </div>
        </motion.div>

        <section className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Personalized Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                ))}
            </div>
             {recommendedEvents.length === 0 && <p className="text-slate-500">No special recommendations for you at the moment. Explore more events to improve suggestions!</p>}
        </section>

        <section>
            <div className="flex items-center space-x-2 mb-6">
                <Ticket className="w-6 h-6 text-green-500 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Upcoming Events</h2>
            </div>
            <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                    <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <img src={booking.event.image} alt={booking.event.title} className="w-full sm:w-32 h-32 sm:h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{booking.event.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{format(booking.event.date, 'EEEE, dd MMMM yyyy')} at {booking.event.time}</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500">{booking.event.venue}</p>
                        </div>
                        <div className="text-center sm:text-right">
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{booking.quantity} Ticket{booking.quantity > 1 ? 's' : ''}</p>
                            <button className="mt-2 px-4 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">View E-Ticket</button>
                        </div>
                    </motion.div>
                ))}
                {upcomingBookings.length === 0 && <p className="text-slate-500 text-center py-8 bg-white dark:bg-slate-800 rounded-lg">You have no upcoming events. Time to book a new experience!</p>}
            </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
