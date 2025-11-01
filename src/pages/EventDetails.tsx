import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Users, Star, Share2, Heart,
  Sparkles, CheckCircle, Ticket, ShoppingCart
} from 'lucide-react';
import { Event, TicketTier } from '../types';
import { generateMockEvents, generateTicketTiers } from '../utils/mockData';
import { format } from 'date-fns';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const events = generateMockEvents(24);
    const foundEvent = events.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
      const tiers = generateTicketTiers(foundEvent.id);
      setTicketTiers(tiers);
      setSelectedTier(tiers[0].id);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Loading event details...</p>
      </div>
    );
  }

  const selectedTierData = ticketTiers.find(t => t.id === selectedTier);
  const totalPrice = selectedTierData ? selectedTierData.price * quantity : 0;

  const handleBooking = () => {
    navigate('/checkout', {
      state: {
        event,
        tier: selectedTierData,
        quantity,
        totalPrice
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {event.aiScore && event.aiScore > 0.85 && (
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI Recommended</span>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-800/50 backdrop-blur-sm text-slate-200 border border-slate-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Event Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Date & Time</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {format(event.date, 'EEEE, dd MMMM yyyy')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Venue</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{event.venue}</p>
                    <p className="text-slate-600 dark:text-slate-300">{event.city}, {event.country}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Attendees</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {event.attendees.toLocaleString('en-IN')} interested
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 fill-current" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Rating</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{event.rating} / 5.0</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">About This Event</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{event.description}</p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Organized By</h3>
                <p className="text-slate-600 dark:text-slate-300">{event.organizer}</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 sticky top-24"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" />
                Select Tickets
              </h3>

              <div className="space-y-4 mb-6">
                {ticketTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTier === tier.id
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-slate-700/50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{tier.name}</h4>
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          ₹{tier.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      {selectedTier === tier.id && (
                        <CheckCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {tier.available} / {tier.total} available
                    </p>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold text-slate-800 dark:text-slate-100 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedTierData?.available || 1, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Service Fee</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">₹{(totalPrice * 0.05).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-700 dark:text-slate-200">Total</span>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    ₹{(totalPrice * 1.05).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-shadow"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Book Tickets</span>
              </button>

              <div className="flex items-center justify-center space-x-4 mt-4">
                <button className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
