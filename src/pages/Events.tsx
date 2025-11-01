import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import EventCard from '../components/EventCard';
import { Event, EventCategory } from '../types';
import { generateMockEvents } from '../utils/mockData';
import { useSearchParams } from 'react-router-dom';

const Events: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Food & Drink', 'Technology', 'Business', 'Comedy', 'Film'];

  useEffect(() => {
    const allEvents = generateMockEvents(24);
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price.min - b.price.min);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.min - a.price.min);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.attendees - a.attendees);
        break;
    }

    setFilteredEvents(filtered);
  }, [selectedCategory, sortBy, events, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-cyan-100 to-blue-200 dark:from-cyan-800 dark:to-blue-900 text-slate-800 dark:text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-slate-600 dark:text-slate-300">Find your next amazing experience</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 space-y-6`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                      selectedCategory === category
                        ? 'bg-cyan-500 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200"
              >
                <option value="date">Date</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredEvents.length}</span> events
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No events found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
