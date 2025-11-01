import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { generateMockEvents } from '../utils/mockData';
import { Event } from '../types';
import { differenceInDays } from 'date-fns';

interface DynamicPriceInfo extends Event {
  dynamicPrice: number;
  demandFactor: number;
  supplyFactor: number;
  timeFactor: number;
}

const DynamicPricingDashboard: React.FC = () => {
  const [events, setEvents] = useState<DynamicPriceInfo[]>([]);

  useEffect(() => {
    const mockEvents = generateMockEvents(6);
    const dynamicEvents = mockEvents.map(event => {
      const basePrice = event.price.min;
      
      const supplyFactor = 1 - (event.ticketsAvailable / event.totalTickets);
      const demandFactor = Math.min(event.attendees / 500, 1.5);
      const daysUntil = differenceInDays(event.date, new Date());
      const timeFactor = daysUntil <= 7 ? 1.25 : (daysUntil <= 30 ? 1.1 : 1);

      const dynamicPrice = basePrice * (1 + (demandFactor * 0.5) + (supplyFactor * 0.3)) * timeFactor;

      return {
        ...event,
        dynamicPrice: parseFloat(dynamicPrice.toFixed(2)),
        demandFactor: parseFloat(demandFactor.toFixed(2)),
        supplyFactor: parseFloat(supplyFactor.toFixed(2)),
        timeFactor: parseFloat(timeFactor.toFixed(2)),
      };
    });
    setEvents(dynamicEvents);
  }, []);

  const FactorBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div>
      <div className="flex justify-between text-xs mb-1 text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span>{value.toFixed(2)}x</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div className={color} style={{ width: `${Math.min(value / 1.5, 1) * 100}%`, height: '100%', borderRadius: '9999px' }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dynamic Pricing Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Real-time ticket price adjustments powered by AI.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate mb-2">{event.title}</h3>
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-sm text-slate-500 line-through">₹{event.price.min.toLocaleString('en-IN')}</span>
                    <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">₹{event.dynamicPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <span className={`text-lg font-semibold ${event.dynamicPrice > event.price.min ? 'text-green-500' : 'text-red-500'}`}>
                    {event.dynamicPrice > event.price.min ? '▲' : '▼'} {(((event.dynamicPrice - event.price.min) / event.price.min) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Pricing Factors</h4>
                <div className="space-y-3">
                  <FactorBar label="Demand" value={event.demandFactor} color="bg-green-500" />
                  <FactorBar label="Scarcity" value={event.supplyFactor} color="bg-orange-500" />
                  <FactorBar label="Urgency" value={event.timeFactor} color="bg-red-500" />
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700/50 px-6 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{differenceInDays(event.date, new Date())} days left</span>
                <span>{event.ticketsAvailable} tickets left</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicPricingDashboard;
