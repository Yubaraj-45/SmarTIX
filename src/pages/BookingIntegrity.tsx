import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { generateMockBookings } from '../utils/mockData';
import { Booking } from '../types';

const BookingIntegrity: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [flaggedBookings, setFlaggedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allBookings = generateMockBookings(50);
    setBookings(allBookings);
    setFlaggedBookings(allBookings.filter(b => b.flag));
  }, []);

  const getFlagDetails = (flag: Booking['flag']) => {
    switch (flag) {
      case 'Potential Duplicate':
        return { icon: <AlertTriangle className="text-yellow-500 dark:text-yellow-400" />, color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300', description: 'Similar booking by same user in short time.' };
      case 'High Volume':
        return { icon: <AlertTriangle className="text-orange-500 dark:text-orange-400" />, color: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300', description: 'Unusually high number of tickets.' };
      case 'Irregular Time':
        return { icon: <AlertTriangle className="text-blue-500 dark:text-blue-400" />, color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300', description: 'Booking made at an odd hour (e.g., 2-5 AM).' };
      default:
        return { icon: null, color: '', description: '' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Booking Integrity</h1>
              <p className="text-slate-600 dark:text-slate-400">AI-powered detection of suspicious booking activities.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Flagged Bookings ({flaggedBookings.length})</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">The following bookings have been automatically flagged for review based on predictive modeling.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Booking ID</th>
                  <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">User</th>
                  <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Event</th>
                  <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Flag Reason</th>
                  <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedBookings.map(booking => {
                  const flagDetails = getFlagDetails(booking.flag);
                  return (
                    <tr key={booking.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-3 text-sm text-slate-600 dark:text-slate-300 font-mono">{booking.id.split('-')[0]}...</td>
                      <td className="p-3 text-sm text-slate-600 dark:text-slate-300">{booking.userName}</td>
                      <td className="p-3 text-sm text-slate-600 dark:text-slate-300 truncate max-w-xs">{booking.eventTitle}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-2 ${flagDetails.color}`}>
                          {flagDetails.icon}
                          {booking.flag}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800/50">Approve</button>
                          <button className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50">Reject</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingIntegrity;
