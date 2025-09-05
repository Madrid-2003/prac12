import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Share2,
  Phone,
  Mail,
  ArrowLeft,
  Car,
  Wifi,
  Shield,
  TreePine,
  Dumbbell,
  Waves
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleLike = async () => {
    try {
      await api.post(`/properties/${id}/like`);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Please login to like properties');
    }
  };

  const handleInquiry = async () => {
    try {
      await api.post(`/properties/${id}/inquire`, {
        message: inquiryMessage,
      });
      toast.success('Inquiry sent successfully!');
      setShowContactForm(false);
      setInquiryMessage('');
    } catch (error) {
      toast.error('Failed to send inquiry');
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/properties"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const amenities = [
    { name: 'Parking', icon: Car },
    { name: 'WiFi', icon: Wifi },
    { name: 'Security', icon: Shield },
    { name: 'Garden', icon: TreePine },
    { name: 'Gym', icon: Dumbbell },
    { name: 'Swimming Pool', icon: Waves },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/properties"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[selectedImage]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleLike}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
                      }`}
                    />
                  </button>
                  <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {property.images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image: { url: string }, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                          selectedImage === index
                            ? 'border-blue-500'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bed className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bath className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Square className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{property.area}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{property.views}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <amenity.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Seller</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {property.seller.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{property.seller.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Property Owner</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Send Inquiry</span>
                  </button>
                  
                  <a
                    href={`tel:${property.seller.phone}`}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                </div>

                {showContactForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <textarea
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                      rows={4}
                    />
                    <button
                      onClick={handleInquiry}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Send Message
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Property Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-gray-900 dark:text-white capitalize">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Purpose:</span>
                  <span className="text-gray-900 dark:text-white capitalize">{property.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price per sq ft:</span>
                  <span className="text-gray-900 dark:text-white">₹{Math.round(property.price / property.area)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Listed:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
