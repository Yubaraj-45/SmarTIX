import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { generateMockEvents } from '../utils/mockData';
import { Link, useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';

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
    { name: 'Music', icon: '🎵', color: 'from-purple-500 to-pink-500' },
    { name: 'Sports', icon: '⚽', color: 'from-blue-500 to-cyan-500' },
    { name: 'Arts & Theatre', icon: '🎭', color: 'from-red-500 to-orange-500' },
    { name: 'Food & Drink', icon: '🍔', color: 'from-green-500 to-teal-500' },
    { name: 'Technology', icon: '💻', color: 'from-indigo-500 to-purple-500' },
    { name: 'Business', icon: '💼', color: 'from-gray-600 to-gray-800' },
    { name: 'Comedy', icon: '😂', color: 'from-yellow-500 to-orange-500' },
    { name: 'Film', icon: '🎬', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <BannerCarousel />

      <div className="relative bg-white dark:bg-slate-900 text-slate-800 dark:text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-300/30 dark:bg-cyan-600/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-60 dark:opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-300/30 dark:bg-teal-600/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-60 dark:opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300/30 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-60 dark:opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 z-20">
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
              className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">AI-Powered Event Discovery</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-slate-50">
              Discover Your Next
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-300">
                Unforgettable Experience
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              Smart ticketing powered by AI. Get personalized recommendations for concerts, sports, festivals, and more.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Music', 'Sports', 'Comedy', 'Technology', 'Food & Drink'].map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/events?category=${category}`)}
                  className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">AI Recommendations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Picked Just for You
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-shadow"
          >
            <span className="font-medium">View All AI Picks</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-slate-100 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Browse by Category
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Find events that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/events?category=${category.name}`}
                  className={`block p-6 rounded-2xl bg-gradient-to-br ${category.color} text-white text-center hover:shadow-xl transition-shadow`}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-rose-100 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
              Featured Events
            </h2>
          </div>
          <Link
            to="/events"
            className="hidden md:block text-cyan-600 dark:text-cyan-400 font-medium hover:text-cyan-500 dark:hover:text-cyan-300"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-900 dark:to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold mb-2">10K+</div>
              <p className="text-slate-200 dark:text-slate-400">Events Listed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">500K+</div>
              <p className="text-slate-200 dark:text-slate-400">Happy Attendees</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-slate-200 dark:text-slate-400">Cities Covered</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
