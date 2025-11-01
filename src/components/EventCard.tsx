import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Users, Star } from 'lucide-react';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  const soldPercentage = ((event.totalTickets - event.ticketsAvailable) / event.totalTickets) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-cyan-500/10 transition-shadow border border-slate-200 dark:border-slate-700"
    >
      <Link to={`/event/${event.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {event.aiScore && event.aiScore > 0.85 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>AI Pick</span>
            </div>
          )}
          {soldPercentage > 80 && (
            <div className="absolute top-3 left-3 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Selling Fast
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-1 rounded">
              {event.category}
            </span>
            <div className="flex items-center space-x-1 text-yellow-500 dark:text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.rating}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
              <span>{format(event.date, 'dd MMM yyyy')} • {event.time}</span>
            </div>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
              <span className="line-clamp-1">{event.venue}, {event.city}</span>
            </div>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
              <span>{event.attendees.toLocaleString('en-IN')} interested</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-500">Starting from</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {event.price.currency}{event.price.min.toLocaleString('en-IN')}
              </p>
            </div>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium">
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
