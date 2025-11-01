import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { generateMockEvents } from '../utils/mockData';
import { Link } from 'react-router-dom';

interface Message {
  text: React.ReactNode;
  sender: 'user' | 'bot';
  options?: string[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const events = generateMockEvents(5);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: 'bot',
          text: "Hello! I'm the EventIQ assistant. How can I help you today?",
          options: ['Find an event', 'Trending events', 'Help with booking'],
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => processMessage(text), 1000);
  };

  const processMessage = (text: string) => {
    let botResponse: Message;
    const lowerCaseText = text.toLowerCase();

    if (lowerCaseText.includes('find') || lowerCaseText.includes('event')) {
      botResponse = {
        sender: 'bot',
        text: 'Great! What category are you interested in?',
        options: ['Music', 'Sports', 'Comedy', 'Any'],
      };
    } else if (['music', 'sports', 'comedy', 'any'].includes(lowerCaseText)) {
      const filteredEvents =
        lowerCaseText === 'any'
          ? events
          : events.filter((e) => e.category.toLowerCase() === lowerCaseText);
      
      if (filteredEvents.length > 0) {
        botResponse = {
          sender: 'bot',
          text: (
            <div>
              Here are some {lowerCaseText !== 'any' && lowerCaseText} events I found:
              <ul className="mt-2 space-y-2">
                {filteredEvents.slice(0, 2).map(event => (
                  <li key={event.id}>
                    <Link to={`/event/${event.id}`} onClick={() => setIsOpen(false)} className="font-semibold text-cyan-500 dark:text-cyan-400 hover:underline">
                      {event.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ),
          options: ['Find an event', 'Trending events'],
        };
      } else {
        botResponse = {
          sender: 'bot',
          text: `Sorry, I couldn't find any ${lowerCaseText} events right now.`,
          options: ['Find an event', 'Trending events'],
        };
      }
    } else if (lowerCaseText.includes('trending')) {
      botResponse = {
        sender: 'bot',
        text: (
          <div>
            Here's a top trending event:
            <div className="mt-2">
              <Link to={`/event/${events[0].id}`} onClick={() => setIsOpen(false)} className="font-semibold text-cyan-500 dark:text-cyan-400 hover:underline">
                {events[0].title}
              </Link>
            </div>
          </div>
        ),
        options: ['Find another event', 'Help with booking'],
      };
    } else if (lowerCaseText.includes('help') || lowerCaseText.includes('booking')) {
      botResponse = {
        sender: 'bot',
        text: 'For booking issues, please visit the event page and ensure you have selected your tickets correctly. If problems persist, contact our support team.',
        options: ['Find an event', 'Trending events'],
      };
    } else {
      botResponse = {
        sender: 'bot',
        text: "I'm not sure how to help with that. Please choose an option.",
        options: ['Find an event', 'Trending events', 'Help with booking'],
      };
    }
    setMessages((prev) => [...prev, botResponse]);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <header className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">EventIQ Assistant</h3>
                <p className="text-xs text-green-500">● Online</p>
              </div>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500 dark:bg-cyan-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {messages[messages.length - 1]?.options && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {messages[messages.length - 1].options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSend(option)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 rounded-full text-sm hover:bg-slate-300 dark:hover:bg-slate-600"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-cyan-500 dark:bg-cyan-600 text-white rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
