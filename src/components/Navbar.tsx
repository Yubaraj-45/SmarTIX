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
          className="absolute right-0 mt-2 w-56 origin-top-right bg-popover text-popover-foreground divide-y divide-border rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
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
    { name: 'Organizer Intelligence', path: '/dashboard/organizer' },
    { name: 'Dynamic Pricing', path: '/dashboard/dynamic-pricing' },
    { name: 'Booking Integrity', path: '/dashboard/booking-integrity' },
    { name: 'My Dashboard', path: '/dashboard/user' },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">
              SmarTIX
            </span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search for events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
                />
              </div>
            </form>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Dropdown
              button={
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center px-3 py-2 rounded-md">
                  Dashboards <ChevronDown className="w-4 h-4 ml-1" />
                </span>
              }
            >
              {dashboardLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 text-sm ${
                    location.pathname === link.path ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                  } hover:bg-accent hover:text-accent-foreground`}
                >
                  {link.name}
                </Link>
              ))}
            </Dropdown>
            <ThemeSwitcher />
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-muted-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-background border-t border-border"
        >
          <div className="px-4 pt-4 pb-3 space-y-3">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
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
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <div className="border-t border-border pt-3">
                <h3 className="px-4 text-sm font-semibold text-muted-foreground">Dashboards</h3>
                <div className="mt-2 space-y-1">
                {dashboardLinks.map((link) => (
                    <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === link.path
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    >
                    {link.name}
                    </Link>
                ))}
                </div>
            </div>
            <div className="mt-4">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
