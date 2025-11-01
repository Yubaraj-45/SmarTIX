import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

const Dropdown: React.FC<{ button: React.ReactNode; children: React.ReactNode }> = ({ button, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button onMouseEnter={() => setIsOpen(true)} className="flex items-center">
        {button}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1">{children}</div>
        </motion.div>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Events', path: '/events' },
    { name: 'Categories', path: '/categories' },
    { name: 'AI Picks', path: '/ai-recommendations' }
  ];

  const dashboardLinks = [
    { name: 'Organizer Analytics', path: '/dashboard/organizer' },
    { name: 'Dynamic Pricing', path: '/dashboard/dynamic-pricing' },
    { name: 'Booking Integrity', path: '/dashboard/booking-integrity' },
    { name: 'My Dashboard', path: '/dashboard/user' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-gradient">
              EventIQ
            </span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-500"
                />
              </div>
            </form>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Dropdown
              button={
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center">
                  Dashboards <ChevronDown className="w-4 h-4 ml-1" />
                </span>
              }
            >
              {dashboardLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 text-sm ${
                    location.pathname === link.path ? 'bg-slate-100 dark:bg-slate-700 text-cyan-500 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'
                  } hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-500 dark:hover:text-cyan-400`}
                >
                  {link.name}
                </Link>
              ))}
            </Dropdown>
            <ThemeSwitcher />
            <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            ) : (
              <Menu className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="px-4 pt-4 pb-3 space-y-3">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200"
                />
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-slate-100 dark:bg-slate-800 text-cyan-500 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <h3 className="px-4 text-sm font-semibold text-slate-500 dark:text-slate-500">Dashboards</h3>
                <div className="mt-2 space-y-1">
                {dashboardLinks.map((link) => (
                    <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === link.path
                        ? 'bg-slate-100 dark:bg-slate-800 text-cyan-500 dark:text-cyan-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    >
                    {link.name}
                    </Link>
                ))}
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
                </button>
                <ThemeSwitcher />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
