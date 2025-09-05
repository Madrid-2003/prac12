# Real Estate Platform

A comprehensive full-stack real estate platform built with React, Node.js, Express, and MongoDB. This platform connects buyers, sellers, and administrators with advanced features including property listings, user management, payment integration, and admin approval systems.

## Features

### For Buyers
- Browse and search properties with advanced filters
- Save favorite properties
- Send inquiries to sellers
- Premium and VIP subscription plans
- Property alerts and notifications
- Virtual property tours

### For Sellers
- List unlimited properties (with SellPro plan)
- Upload property images and documents
- Manage property listings
- View analytics and performance metrics
- Lead management system
- Professional photography service

### For Administrators
- Approve/reject user registrations
- Manage property listings
- Handle payment transactions
- Respond to customer inquiries
- View comprehensive analytics
- User and content moderation

### General Features
- Secure authentication system
- PayU payment gateway integration
- Responsive design with dark mode
- Real-time notifications
- Document upload and management
- Advanced search and filtering
- Interactive maps and location services

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Lucide React** for icons
- **Leaflet** for maps

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **PayU** payment gateway
- **Express Validator** for validation
- **Helmet** for security

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- PayU merchant account

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd real-estate-platform
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realEstate
JWT_SECRET=your_jwt_secret_key_here
PAYU_KEY=your_payu_key
PAYU_MERCHANT_SALT=your_payu_salt
PAYU_ENV=test
PAYU_BASE_URL=https://test.payu.in/_payment
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
real-estate-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── ...
├── models/                # MongoDB models
├── routes/                # Express routes
├── middleware/            # Custom middleware
├── server.js             # Main server file
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (seller only)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/properties/:id/like` - Like/unlike property
- `POST /api/properties/:id/inquire` - Send inquiry

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/favorites` - Get favorite properties
- `GET /api/users/inquiries` - Get user inquiries

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history
- `GET /api/payments/plans` - Available plans
- `POST /api/payments/refund-request` - Request refund

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/approve` - Approve/reject user
- `GET /api/admin/properties` - Get all properties
- `PUT /api/admin/properties/:id/approve` - Approve/reject property
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/contacts` - Get contact messages

## Subscription Plans

### For Buyers
- **Free Plan**: Basic property browsing, limited features
- **Premium Plan** (₹999/month): Advanced search, property alerts, priority support
- **VIP Plan** (₹1999/month): Exclusive properties, personal consultant, investment reports

### For Sellers
- **Free Plan**: List 1 property, basic features
- **SellPro Plan** (₹1499/month): Unlimited listings, featured properties, analytics

## Payment Integration

The platform integrates with PayU payment gateway for secure transactions:
- Credit/Debit cards
- Net banking
- UPI payments
- Digital wallets
- EMI options

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- File upload restrictions

## Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder

### Database
- Use MongoDB Atlas for cloud database
- Set up proper indexes for performance
- Configure backup and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@realestate.com
- Phone: +91-9876543210
- Address: 123 Business Park, Mumbai, Maharashtra 400001

## Future Enhancements

- Mobile app development
- AI-powered property recommendations
- Virtual reality property tours
- Blockchain-based property verification
- Advanced analytics and reporting
- Multi-language support
- Social media integration
- Property investment tools
