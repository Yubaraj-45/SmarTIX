import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Music, Trophy, Mic, Cpu, Utensils } from 'lucide-react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { generateMockEvents } from '../utils/mockData';
import { Link, useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import CurtainReveal from '../components/CurtainReveal';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allEvents = generateMockEvents(24);
    setEvents(allEvents);
    setFeaturedEvents(allEvents.filter(e => e.featured).slice(0, 6));
  }, []);

  const aiPickedEvents = events
    .filter(e => e.aiScore && e.aiScore > 0.85)
    .slice(0, 4);

  const categories = [
    { name: 'Music', icon: <Music className="w-5 h-5" />, color: 'text-purple-400' },
    { name: 'Sports', icon: <Trophy className="w-5 h-5" />, color: 'text-blue-400' },
    { name: 'Comedy', icon: <Mic className="w-5 h-5" />, color: 'text-orange-400' },
    { name: 'Technology', icon: <Cpu className="w-5 h-5" />, color: 'text-green-400' },
    { name: 'Food & Drink', icon: <Utensils className="w-5 h-5" />, color: 'text-red-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BannerCarousel />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-secondary border border-border px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Event Discovery</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Discover Your Next
              <br />
              <span className="text-gradient">
                Unforgettable Experience
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Smart ticketing powered by AI. Get personalized recommendations for concerts, sports, festivals, and more.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/events?category=${category.name}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary border border-border rounded-full text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <span className={category.color}>{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <CurtainReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-secondary border border-border px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI Recommendations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Picked Just for You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI analyses your preferences and trending events to bring you the best experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {aiPickedEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/ai-recommendations"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-shadow"
            >
              <span className="font-medium">View All AI Picks</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </CurtainReveal>

      <section className="bg-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full mb-4">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold text-rose-500">Trending Now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Featured Events
              </h2>
            </div>
            <Link
              to="/events"
              className="hidden md:block text-primary font-medium hover:text-primary/80"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold mb-2">10K+</div>
              <p className="text-slate-200">Events Listed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">500K+</div>
              <p className="text-slate-200">Happy Attendees</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-slate-200">Cities Covered</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
