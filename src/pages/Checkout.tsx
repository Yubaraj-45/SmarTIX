import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Lock, Calendar, User, ArrowLeft,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [activeStep, setActiveStep] = useState(1);

  React.useEffect(() => {
    if (!state || !state.event || !state.tier) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state || !state.event || !state.tier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Loading checkout...</p>
      </div>
    );
  }

  const { event, tier, quantity } = state;
  const subtotal = tier.price * quantity;
  const serviceFee = subtotal * 0.05;
  const totalPrice = subtotal + serviceFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing payment...');
    setActiveStep(2);
    setTimeout(() => {
      alert('Booking successful! A confirmation has been sent to your email.');
      navigate('/');
    }, 2000);
  };

  const steps = ['Order Summary', 'Payment', 'Confirmation'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 mb-8 font-medium">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Event</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Checkout</h1>
          
          <div className="mb-12">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-bold ${
                        index < activeStep
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {index < activeStep -1 ? '✓' : index + 1}
                    </div>
                    <span
                      className={`ml-3 font-medium ${
                        index <= activeStep -1 ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-auto border-t-2 transition-colors mx-4 ${
                        index < activeStep -1 ? 'border-cyan-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Payment Details</h2>
              <form onSubmit={handlePayment}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="card-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Name on Card</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" id="card-name" required className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="John Doe" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Card Number</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CreditCard className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" id="card-number" required className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="0000 0000 0000 0000" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
                    <div className="flex-1">
                      <label htmlFor="expiry-date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Expiry Date</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Calendar className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" id="expiry-date" required className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="MM / YY" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cvc" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">CVC</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" id="cvc" required className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-shadow"
                  >
                    <span>Pay {totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-4 flex items-center justify-center">
                    <Lock className="w-3 h-3 mr-1" /> Secure payment powered by Stripe
                  </p>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Order Summary</h2>
              
              <div className="flex space-x-4 mb-6">
                <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{event.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 flex-shrink-0" />{format(event.date, 'dd MMM yyyy')}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" />{event.venue}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-b border-slate-200 dark:border-slate-700 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Ticket Type</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{tier.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Quantity</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Price per ticket</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{tier.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
              </div>

              <div className="space-y-2 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Service Fee (5%)</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{serviceFee.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold border-t border-slate-200 dark:border-slate-700 pt-4">
                <span className="text-slate-800 dark:text-slate-100">Total</span>
                <span className="text-cyan-600 dark:text-cyan-400">{totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
