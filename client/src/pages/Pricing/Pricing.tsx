import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Crown, 
  Building2, 
  CreditCard,
  Shield,
  Zap,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const { user } = useAuth();

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await api.get('/payments/plans');
      return response.data;
    },
  });

  const handleSelectPlan = async (planType: string) => {
    if (!user) {
      toast.error('Please login to subscribe to a plan');
      return;
    }

    try {
      setSelectedPlan(planType);
      const response = await api.post('/payments/create-order', {
        plan: planType,
        duration: 30
      });

      // Redirect to PayU payment page
      const { payuParams, payuUrl } = response.data;
      
      // Create a form and submit to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuUrl;
      form.target = '_blank';

      Object.entries(payuParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      toast.error('Failed to initiate payment');
      setSelectedPlan('');
    }
  };

  const buyerPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Users,
      color: 'gray',
      features: [
        'Browse basic properties',
        'Limited search filters',
        'Basic property details',
        'Contact sellers directly',
        'Save up to 5 favorites'
      ],
      limitations: [
        'Limited to 20 properties per day',
        'No advanced filters',
        'No priority support'
      ]
    },
    {
      name: 'Premium',
      price: plans?.premium?.price || 999,
      period: 'month',
      icon: Star,
      color: 'blue',
      popular: true,
      features: [
        'Access to all properties',
        'Advanced search filters',
        'Property alerts & notifications',
        'Priority customer support',
        'Property comparison tool',
        'Unlimited favorites',
        'Market insights & trends',
        'Virtual property tours'
      ]
    },
    {
      name: 'VIP',
      price: plans?.vip?.price || 1999,
      period: 'month',
      icon: Crown,
      color: 'purple',
      features: [
        'All Premium features',
        'Exclusive VIP properties',
        'Personal property consultant',
        'Investment analysis reports',
        'Early access to new listings',
        'Negotiation assistance',
        'Legal document support',
        'Priority booking for viewings'
      ]
    }
  ];

  const sellerPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Building2,
      color: 'gray',
      features: [
        'List 1 property',
        'Basic property details',
        'Contact management',
        'Basic analytics'
      ],
      limitations: [
        'Limited to 1 property',
        'No featured listings',
        'Basic support only'
      ]
    },
    {
      name: 'SellPro',
      price: plans?.sellpro?.price || 1499,
      period: 'month',
      icon: TrendingUp,
      color: 'green',
      popular: true,
      features: [
        'List unlimited properties',
        'Featured property listings',
        'Advanced analytics dashboard',
        'Lead management system',
        'Professional photography service',
        'Marketing tools & campaigns',
        'Priority customer support',
        'Property performance insights'
      ]
    }
  ];

  const isBuyer = user?.role === 'buyer';
  const currentPlans = isBuyer ? buyerPlans : sellerPlans;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your {isBuyer ? 'property search' : 'property selling'} needs
          </p>
        </motion.div>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <div className="flex">
              <button
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  isBuyer
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => window.location.href = '/pricing?role=buyer'}
              >
                For Buyers
              </button>
              <button
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  !isBuyer
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => window.location.href = '/pricing?role=seller'}
              >
                For Sellers
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.color === 'gray' ? 'bg-gray-100 dark:bg-gray-700' :
                    plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                    plan.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' :
                    'bg-green-100 dark:bg-green-900'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      plan.color === 'gray' ? 'text-gray-600 dark:text-gray-400' :
                      plan.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      plan.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations && (
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Limitations:</h4>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name.toLowerCase())}
                  disabled={selectedPlan === plan.name.toLowerCase() || plan.price === 0}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    plan.price === 0
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {selectedPlan === plan.name.toLowerCase() ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : plan.price === 0 ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Choose Our Premium Plans?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All transactions are secured with industry-standard encryption
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get immediate access to premium features after payment
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Priority customer support for all premium users
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flexible Billing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cancel anytime with no long-term commitments
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We offer a 7-day free trial for all premium plans. No credit card required.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We accept all major credit cards, debit cards, net banking, and UPI payments.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I get a refund?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, we offer a 7-day money-back guarantee for all premium subscriptions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
