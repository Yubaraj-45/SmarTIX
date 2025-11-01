import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Ticket, Users, BarChart2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { generateMockBookings, generateMockEvents } from '../utils/mockData';
import { Booking, Event } from '../types';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-50 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center text-cyan-500 dark:text-cyan-400">
        {icon}
      </div>
    </div>
    {change && (
      <p className={`text-sm mt-2 ${changeType === 'increase' ? 'text-green-500' : 'text-red-400'}`}>
        {change} vs last month
      </p>
    )}
  </motion.div>
);

const OrganizerDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  useEffect(() => {
    const mockBookings = generateMockBookings(100);
    const mockEvents = generateMockEvents(10);
    setBookings(mockBookings);
    setEvents(mockEvents);
    setSelectedEventId(mockEvents[0]?.id || '');
  }, []);

  const filteredBookings = bookings.filter(b => b.eventId === selectedEventId);
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const ticketsSold = filteredBookings.reduce((sum, b) => sum + b.quantity, 0);
  const uniqueAttendees = new Set(filteredBookings.map(b => b.userId)).size;

  const getSalesChartOptions = () => {
    const salesData: { [key: string]: number } = {};
    filteredBookings.forEach(booking => {
      const date = format(booking.bookingDate, 'yyyy-MM-dd');
      salesData[date] = (salesData[date] || 0) + booking.quantity;
    });

    const sortedDates = Object.keys(salesData).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    
    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: sortedDates.map(d => format(new Date(d), 'dd MMM')) },
      yAxis: { type: 'value', name: 'Tickets Sold' },
      series: [{
        data: sortedDates.map(date => salesData[date]),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(6, 182, 212, 0.5)' }, { offset: 1, color: 'rgba(6, 182, 212, 0)' }]
          }
        },
        itemStyle: { color: '#06b6d4' }
      }],
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Organizer Dashboard</h1>
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200"
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<DollarSign />} change="+5.4%" changeType="increase" />
          <MetricCard title="Tickets Sold" value={ticketsSold.toLocaleString('en-IN')} icon={<Ticket />} change="+8.2%" changeType="increase" />
          <MetricCard title="Unique Attendees" value={uniqueAttendees.toLocaleString('en-IN')} icon={<Users />} change="-1.1%" changeType="decrease" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2" />Sales Trend</h2>
            <ReactECharts option={getSalesChartOptions()} theme={theme} style={{ height: '400px' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent Bookings</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredBookings.slice(0, 10).map(booking => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">{booking.userName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{booking.quantity} tickets</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-500 dark:text-green-400">+ ₹{booking.totalPrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{format(booking.bookingDate, 'dd MMM, p')}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
