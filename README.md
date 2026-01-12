# BiteDash - Food Delivery Platform

A full-stack food delivery application built with React, Node.js, and MongoDB. Features real-time order tracking, geospatial delivery assignment, and integrated payment processing.

**Live Demo**: [bitedash-food.vercel.app](https://bitedash-food.vercel.app)  
**Documentation**: [bitedash-food.vercel.app/docs](https://bitedash-food.vercel.app/docs)  
**API Backend**: [food-delivery-full-stack-app-3.onrender.com](https://food-delivery-full-stack-app-3.onrender.com)

---

## Overview

BiteDash is a food delivery platform that connects customers with restaurants and delivery partners. The application handles the complete order lifecycle from browsing restaurants to delivery confirmation with OTP verification.

### Key Features

**For Customers:**
- Browse restaurants by city and category
- Real-time order tracking with live location updates
- Multiple payment options (Stripe and Cash on Delivery)
- Order history and ratings

**For Restaurant Owners:**
- Manage menu items with image uploads
- Real-time order notifications
- Accept or reject incoming orders
- Track earnings and order statistics

**For Delivery Partners:**
- Receive orders within 10km radius using geospatial queries
- Live navigation to pickup and delivery locations
- OTP-based delivery verification
- Daily earnings tracking

---

## Tech Stack

### Frontend
- React 19 with Redux Toolkit for state management
- TailwindCSS for styling
- Vite as build tool
- Socket.IO client for real-time updates
- Leaflet for maps
- Recharts for analytics

### Backend
- Node.js 20 with Express 5
- MongoDB with Mongoose ODM
- Socket.IO for real-time communication
- JWT authentication with httpOnly cookies
- Cluster mode for multi-core utilization

### External Services
- MongoDB Atlas for database
- Cloudinary for image storage
- Stripe for payment processing
- SendGrid for email notifications
- Firebase for Google OAuth
- Geoapify for location services

### Deployment
- Frontend: Vercel
- Backend: Render
- CI/CD: GitHub Actions (14 automated workflows)

---

## Project Structure

```
BiteDash/
├── backend/
│   ├── config/          # Database, cache, and service configurations
│   ├── controllers/     # Request handlers for each route
│   ├── middlewares/     # Authentication, rate limiting, validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoint definitions
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation schemas
│   ├── cluster.js       # Cluster mode setup
│   ├── socket.js        # Socket.IO configuration
│   └── index.js         # Application entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level components
│   │   ├── redux/       # State management slices
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Helper functions
│   └── public/
│       └── docs/        # Technical documentation
│
└── .github/
    └── workflows/       # CI/CD pipeline configurations
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App.git
cd Food-Delivery-Full-Stack-App
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
```

4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Environment Variables

#### Backend (.env)
```env
PORT=8000
NODE_ENV=development
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SENDGRID_API_KEY=your_sendgrid_key
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_GEOAPIKEY=your_geoapify_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

See `.env.example` files for complete configuration details.

---

## Architecture

### System Design

The application follows a client-server architecture with real-time communication:

1. **Frontend (React)**: Handles UI rendering and user interactions
2. **Backend (Node.js)**: Processes business logic and data operations
3. **Database (MongoDB)**: Stores application data with geospatial indexing
4. **Socket.IO**: Enables real-time bidirectional communication
5. **External APIs**: Handles payments, storage, and notifications

### Data Flow

```
User Action → React Component → Redux Action → API Call → Express Route
→ Controller → Model → MongoDB → Response → Redux Store → UI Update
```

For real-time features:
```
Server Event → Socket.IO → Client Listener → Redux Update → UI Update
```

### Key Technical Implementations

**Geospatial Delivery Assignment:**
- Uses MongoDB's geospatial queries with 2dsphere indexes
- Finds delivery partners within 10km radius
- Filters out busy partners using assignment status

**Real-Time Order Tracking:**
- Socket.IO rooms for targeted messaging
- Location updates broadcast to relevant users
- Order status changes pushed instantly

**Payment Processing:**
- Stripe Checkout Sessions for card payments
- Webhook integration for payment confirmation
- Fallback to Cash on Delivery option

---

## API Documentation

Complete API documentation is available at: [bitedash-food.vercel.app/docs](https://bitedash-food.vercel.app/docs)

### Main Endpoints

**Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/current` - Get current user
- `POST /api/auth/logout` - Logout user

**Orders**
- `POST /api/order/place-order` - Create new order
- `GET /api/order/my-orders` - Get user's orders
- `PUT /api/order/status/:orderId/:shopId` - Update order status
- `POST /api/order/verify-otp` - Verify delivery OTP

**Shops**
- `GET /api/shop/city/:city` - Get shops by city
- `POST /api/shop/create` - Create new shop (owner only)
- `PUT /api/shop/:id` - Update shop details

**Items**
- `GET /api/item/city/:city` - Get items by city
- `POST /api/item/create` - Add menu item (owner only)
- `PUT /api/item/:id` - Update menu item

---

## Testing

The project includes automated tests for critical functionality:

```bash
cd frontend
npm test
```

Test coverage includes:
- Component rendering tests
- Redux slice logic tests
- API integration tests
- User interaction flows

Current test suite: 62 tests across 21 test files

---

## CI/CD Pipeline

The project uses GitHub Actions for automated workflows:

**On Pull Request:**
- Code linting and formatting checks
- Automated test execution
- Security vulnerability scanning
- Build verification

**On Merge to Main:**
- Production build creation
- Deployment to Vercel (frontend)
- Health check verification
- Automatic rollback on failure

**Scheduled Tasks:**
- Weekly dependency updates
- Security audits
- Performance monitoring
- Backend health checks (every 6 hours)

---

## Deployment

### Frontend (Vercel)

The frontend is automatically deployed to Vercel on every push to main branch.

Configuration is in `vercel.json`:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite"
}
```

### Backend (Render)

The backend is deployed on Render with the following setup:
- Build Command: `npm install`
- Start Command: `node cluster.js`
- Environment: Node.js 20
- Auto-deploy: Enabled on main branch

---

## Performance Considerations

**Frontend Optimizations:**
- Code splitting with React.lazy
- Image optimization via Cloudinary
- API response caching
- Lazy loading for routes

**Backend Optimizations:**
- Database connection pooling
- In-memory caching for frequent queries
- Cluster mode for CPU utilization
- Geospatial indexes for location queries

**Monitoring:**
- Automated performance tracking
- Bundle size monitoring
- API response time tracking
- Error logging and alerts

---

## Security

**Authentication & Authorization:**
- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Role-based access control
- Session management

**API Security:**
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Security headers via Helmet

**Data Protection:**
- Environment variables for sensitive data
- Encrypted database connections
- Secure file upload handling
- Payment data handled by Stripe (PCI compliant)

---

## Known Limitations

- In-memory cache doesn't persist across server restarts (Redis recommended for production)
- Payment verification relies on client redirect (webhook implementation recommended)
- No offline support currently
- Limited to single currency (INR)

---

## Future Improvements

- Implement Redis for distributed caching
- Add Stripe webhook for server-side payment verification
- Implement MongoDB transactions for atomic operations
- Add push notifications for mobile devices
- Implement advanced analytics dashboard
- Add multi-language support
- Create admin panel for platform management

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Write or update tests as needed
5. Commit your changes (`git commit -m 'Add new feature'`)
6. Push to your branch (`git push origin feature/new-feature`)
7. Open a Pull Request

Please ensure:
- Code follows existing style conventions
- All tests pass
- New features include appropriate tests
- Documentation is updated if needed

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Contact

**Developer**: Adarsh Priydarshi  
**Email**: priydarshiadarsh3@gmail.com  
**GitHub**: [@adarsh-priydarshi-5646](https://github.com/adarsh-priydarshi-5646)

**Project Repository**: [github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App](https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App)

---

## Acknowledgments

This project was built using various open-source libraries and services:
- React and Redux teams for the frontend framework
- Express.js for the backend framework
- MongoDB for the database
- Socket.IO for real-time functionality
- Stripe for payment processing
- Cloudinary for image management
- Vercel and Render for hosting

---

*Built as a learning project to demonstrate full-stack development skills with modern web technologies.*
