import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home, 
  Heart, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  Users, 
  Eye,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isBuyer = user.role === 'buyer';
  const isSeller = user.role === 'seller';

  const buyerStats = [
    { name: 'Favorites', value: '12', icon: Heart, color: 'text-red-500' },
    { name: 'Inquiries', value: '8', icon: MessageSquare, color: 'text-blue-500' },
    { name: 'Properties Viewed', value: '45', icon: Eye, color: 'text-green-500' },
    { name: 'Saved Searches', value: '3', icon: Star, color: 'text-yellow-500' },
  ];

  const sellerStats = [
    { name: 'Total Properties', value: '5', icon: Home, color: 'text-blue-500' },
    { name: 'Active Listings', value: '3', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Total Views', value: '1,234', icon: Eye, color: 'text-purple-500' },
    { name: 'Inquiries', value: '15', icon: MessageSquare, color: 'text-orange-500' },
  ];

  const recentActivities = [
    { id: 1, action: 'Viewed property', property: 'Luxury Apartment in Mumbai', time: '2 hours ago' },
    { id: 2, action: 'Added to favorites', property: 'Modern Villa in Bangalore', time: '1 day ago' },
    { id: 3, action: 'Sent inquiry', property: 'Cozy House in Delhi', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your {isBuyer ? 'property search' : 'property listings'} today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(isBuyer ? buyerStats : sellerStats).map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isBuyer ? (
                  <>
                    <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">Browse Properties</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Find your dream home</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">View Favorites</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Your saved properties</div>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">Add Property</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">List a new property</div>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">View Analytics</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Track your listings</div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.property}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription</h3>
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  user.subscription.plan === 'free' 
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {user.subscription.plan.toUpperCase()} Plan
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {user.subscription.isActive ? 'Active subscription' : 'Free plan'}
                </p>
                {user.subscription.plan === 'free' && (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Upgrade Plan
                  </button>
                )}
              </div>
            </motion.div>

            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">100%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Documents</span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">60%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-3">💡 Pro Tip</h3>
              <p className="text-sm opacity-90">
                {isBuyer 
                  ? "Set up property alerts to get notified when new properties matching your criteria are listed."
                  : "Upload high-quality photos and write detailed descriptions to attract more buyers to your properties."
                }
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
