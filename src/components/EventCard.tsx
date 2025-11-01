import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Star } from 'lucide-react';
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
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg overflow-hidden group"
    >
      <Link to={`/event/${event.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
              {event.title}
            </h3>
            <div className="flex items-center text-xs text-slate-300">
              <MapPin className="w-3 h-3 mr-1.5" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>
          {event.aiScore && event.aiScore > 0.85 && (
            <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              <span>AI Pick</span>
            </div>
          )}
          {soldPercentage > 80 && (
            <div className="absolute top-3 left-3 bg-destructive/80 text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
              Selling Fast
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
              {event.category}
            </span>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium text-foreground">{event.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(event.date, 'dd MMM yyyy')} • {event.time}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Starts from</p>
              <p className="text-xl font-bold text-foreground">
                {event.price.currency}{event.price.min.toLocaleString('en-IN')}
              </p>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
