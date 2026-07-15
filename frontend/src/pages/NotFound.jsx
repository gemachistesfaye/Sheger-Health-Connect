import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePageTitle from '../hooks/usePageTitle';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  usePageTitle('Page Not Found');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/5 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-black text-primary mb-4">404</div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
