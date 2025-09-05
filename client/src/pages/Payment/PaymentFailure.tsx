import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, CreditCard, RefreshCw } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/pricing"
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Link>
          
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <Link
            to="/contact"
            className="w-full flex items-center justify-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;

