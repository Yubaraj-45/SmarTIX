import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, Zap } from 'lucide-react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { generateMockEvents } from '../utils/mockData';

const AIRecommendations: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [personalizedEvents, setPersonalizedEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const allEvents = generateMockEvents(24);
    
    const aiPicks = allEvents
      .filter(e => e.aiScore && e.aiScore > 0.85)
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    
    setEvents(aiPicks);
    setPersonalizedEvents(aiPicks.slice(0, 6));
    setTrendingEvents(allEvents.sort((a, b) => b.attendees - a.attendees).slice(0, 6));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900 text-slate-800 dark:text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI-Powered Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">
              Your Personalized Event Feed
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our advanced AI analyses your preferences, browsing history, and trending events to curate the perfect experiences for you
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Smart Matching</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              AI analyses your interests and past bookings to find perfect matches
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Trend Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Stay ahead with events gaining popularity in your area
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Real-time Updates</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Get instant notifications for events matching your profile
            </p>
          </motion.div>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Picked Just for You</h2>
              <p className="text-slate-600 dark:text-slate-400">Based on your preferences and activity</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>AI Match Score: 85%+</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalizedEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Trending in Your Area</h2>
              <p className="text-slate-600 dark:text-slate-400">What others are booking right now</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Want Better Recommendations?</h2>
            <p className="text-slate-100 dark:text-slate-200 mb-6 max-w-2xl mx-auto">
              Sign in to unlock personalized AI recommendations based on your unique preferences and booking history
            </p>
            <button className="px-8 py-3 bg-white text-cyan-600 rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Create Free Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIRecommendations;
