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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading event details...</p>
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
    <div className="min-h-screen bg-background">
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {event.aiScore && event.aiScore > 0.85 && (
                <div className="inline-flex items-center space-x-2 bg-primary/80 text-primary-foreground px-4 py-2 rounded-full mb-4 text-sm font-semibold backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Recommended</span>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full text-sm"
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
              className="bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Event Details</h2>
              
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-8 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-md flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold text-foreground">
                      {format(event.date, 'EEEE, dd MMMM yyyy')} at {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-md flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-semibold text-foreground">{event.venue}, {event.city}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-md flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attendees</p>
                    <p className="font-semibold text-foreground">{event.attendees.toLocaleString('en-IN')} interested</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-md flex items-center justify-center"><Star className="w-5 h-5 text-yellow-400 fill-current" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold text-foreground">{event.rating} / 5.0</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-3">About This Event</h3>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-primary" />
                Select Tickets
              </h3>

              <div className="space-y-4 mb-6">
                {ticketTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-4 rounded-md border-2 cursor-pointer transition-all ${
                      selectedTier === tier.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{tier.name}</h4>
                        <p className="text-2xl font-bold text-primary">
                          ₹{tier.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      {selectedTier === tier.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-accent"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold text-foreground w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedTierData?.available || 1, quantity + 1))}
                    className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-accent"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium text-foreground">₹{(totalPrice * 0.05).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">
                    ₹{(totalPrice * 1.05).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-shadow"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Book Tickets</span>
              </button>

              <div className="flex items-center justify-center space-x-4 mt-4">
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
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
