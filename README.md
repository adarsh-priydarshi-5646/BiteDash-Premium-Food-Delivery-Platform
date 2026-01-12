# 🍔 BiteDash - Food Delivery Platform

A full-stack food delivery application I built to learn and implement real-world features like real-time tracking, payment integration, and geospatial queries. The platform connects customers with restaurants and delivery partners through a complete order management system.

**Live Demo**: [bitedash-food.vercel.app](https://bitedash-food.vercel.app)  
**API Documentation**: [bitedash-food.vercel.app/docs](https://bitedash-food.vercel.app/docs)  
**Backend API**: [food-delivery-full-stack-app-3.onrender.com](https://food-delivery-full-stack-app-3.onrender.com)

---

## 📋 What I Built

I developed BiteDash to understand how food delivery platforms work end-to-end. The application handles everything from browsing restaurants to delivery confirmation with OTP verification.

### 🎯 Core Features

**Customer Experience:**
- Browse restaurants filtered by city and category
- Real-time order tracking with Socket.IO showing live delivery partner location
- Payment through Stripe or Cash on Delivery
- Order history with rating system

**Restaurant Owner Dashboard:**
- Menu management with Cloudinary for image uploads
- Real-time order notifications via Socket.IO
- Accept/reject orders with status updates
- Earnings and order analytics

**Delivery Partner App:**
- Geospatial order assignment within 10km radius using MongoDB's $near operator
- Live navigation between pickup and delivery locations
- OTP-based delivery verification for security
- Daily earnings tracker with hourly breakdown

---

## 🛠️ Technology Stack

### Frontend
I chose React 19 with Redux Toolkit for state management because it handles complex state updates efficiently, especially for real-time order tracking. Used Vite as the build tool for faster development experience.

- **React 19** - UI library with hooks
- **Redux Toolkit** - Centralized state management
- **TailwindCSS** - Utility-first styling
- **Socket.IO Client** - Real-time updates
- **React Router 7** - Client-side routing
- **Leaflet** - Interactive maps for tracking
- **Recharts** - Analytics charts
- **Axios** - HTTP requests

### Backend
Implemented the backend with Node.js and Express, using cluster mode to utilize all CPU cores for better performance under load.

- **Node.js 20** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication with httpOnly cookies
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cluster Mode** - Multi-core utilization

### External Services
- **MongoDB Atlas** - Cloud database with geospatial indexing
- **Cloudinary** - Image storage and optimization
- **Stripe** - Payment processing
- **SendGrid** - Transactional emails
- **Firebase** - Google OAuth authentication
- **Geoapify** - Location and geocoding services

### DevOps
Set up automated CI/CD pipelines with GitHub Actions for testing, security scanning, and deployment.

- **GitHub Actions** - 14 automated workflows
- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend hosting with auto-deploy
- **ESLint** - Code quality checks
- **Vitest** - Unit and integration testing

---

## 📁 Project Structure

I organized the codebase into clear modules for maintainability:

```
BiteDash/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection with pooling
│   │   ├── cache.js           # In-memory cache implementation
│   │   └── stripe.js          # Stripe configuration
│   ├── controllers/           # Business logic for each feature
│   │   ├── auth.controllers.js
│   │   ├── order.controllers.js
│   │   ├── shop.controllers.js
│   │   └── user.controllers.js
│   ├── middlewares/
│   │   ├── isAuth.js          # JWT verification
│   │   ├── rateLimiter.js     # Rate limiting (100 req/15min)
│   │   └── upload.middleware.js
│   ├── models/                # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── shop.model.js
│   │   ├── order.model.js
│   │   └── deliveryAssignment.model.js
│   ├── routes/                # API endpoints
│   ├── utils/                 # Helper functions
│   ├── validators/            # Input validation
│   ├── cluster.js             # Cluster mode setup
│   ├── socket.js              # Socket.IO configuration
│   └── index.js               # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route components
│   │   ├── redux/
│   │   │   ├── userSlice.js   # User state
│   │   │   ├── cartSlice.js   # Shopping cart
│   │   │   └── socketSlice.js # Socket connection
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Helper functions
│   └── public/
│       └── docs/              # Technical documentation
│
└── .github/
    └── workflows/             # CI/CD pipelines
        ├── ci.yml
        ├── pr-checks.yml
        ├── security.yml
        └── release.yml
```

---

## 🚀 Getting Started

### Prerequisites

You'll need these installed:
- Node.js v18 or higher
- MongoDB Atlas account (free tier works)
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App.git
cd Food-Delivery-Full-Stack-App
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SENDGRID_API_KEY=your_sendgrid_key
FRONTEND_URL=http://localhost:5173
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_FIREBASE_APIKEY=your_firebase_key
VITE_GEOAPIKEY=your_geoapify_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Start Development Servers**
```bash
# Terminal 1 - Backend (runs on port 8000)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on port 5173)
cd frontend
npm run dev
```

Visit http://localhost:5173 to see the application.

---

## 🏗️ Architecture & Implementation

### System Design

I designed the application with a client-server architecture where the frontend communicates with the backend through REST APIs and Socket.IO for real-time features.

**Request Flow:**
```
User Action → React Component → Redux Action → API Call
→ Express Route → Controller → MongoDB → Response
→ Redux Store Update → UI Re-render
```

**Real-time Flow:**
```
Server Event → Socket.IO Emit → Client Socket Listener
→ Redux Action → State Update → UI Update
```

### Key Technical Implementations

#### 1. Geospatial Delivery Assignment

I implemented this using MongoDB's geospatial queries to find delivery partners within a 10km radius:

```javascript
// In order.controllers.js
const nearByDeliveryBoys = await User.find({
  role: 'deliveryBoy',
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: 10000  // 10km in meters
    }
  }
});
```

I added a 2dsphere index on the location field in the User model for efficient queries:
```javascript
userSchema.index({ location: '2dsphere' });
```

#### 2. Real-Time Order Tracking

Implemented Socket.IO for bidirectional communication. When a user connects, I store their socket ID in the database:

```javascript
// In socket.js
socket.on('identity', async ({ userId }) => {
  await User.findByIdAndUpdate(userId, {
    socketId: socket.id,
    isOnline: true
  });
  socket.join(userId);
});
```

This allows me to send targeted updates to specific users:
```javascript
io.to(userSocketId).emit('update-status', orderData);
```

#### 3. Payment Processing

Integrated Stripe Checkout Sessions for card payments with a fallback to Cash on Delivery:

```javascript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [...],
  mode: 'payment',
  success_url: `${FRONTEND_URL}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${FRONTEND_URL}/checkout`
});
```

After successful payment, I verify the session and update the order status.

#### 4. Cluster Mode for Scalability

Implemented cluster mode to utilize all CPU cores:

```javascript
// In cluster.js
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process runs the Express server
  require('./index.js');
}
```

This improved the application's ability to handle concurrent requests.

#### 5. Caching Strategy

Implemented in-memory caching for frequently accessed data like restaurant lists:

```javascript
// In cache.js
class Cache {
  set(key, value, ttlSeconds = 300) {
    this.store.set(key, value);
    this.ttlStore.set(key, Date.now() + ttlSeconds * 1000);
  }
  
  get(key) {
    const expiry = this.ttlStore.get(key);
    if (!expiry || Date.now() > expiry) {
      this.delete(key);
      return null;
    }
    return this.store.get(key);
  }
}
```

Cache TTL is set to 5 minutes for shop/item lists.

---

## 📡 API Documentation

Complete API documentation with request/response examples is available at: [bitedash-food.vercel.app/docs](https://bitedash-food.vercel.app/docs)

### Main Endpoints

**Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login with email/password
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/current` - Get authenticated user
- `POST /api/auth/logout` - Logout and clear cookie

**Orders**
- `POST /api/order/place-order` - Create new order
- `GET /api/order/my-orders` - Get user's order history
- `PUT /api/order/status/:orderId/:shopId` - Update order status
- `POST /api/order/verify-otp` - Verify delivery with OTP
- `POST /api/order/create-payment` - Create Stripe checkout session

**Shops**
- `GET /api/shop/city/:city` - Get all shops in a city
- `POST /api/shop/create` - Create new shop (owner only)
- `PUT /api/shop/:id` - Update shop details
- `DELETE /api/shop/:id` - Delete shop

**Items**
- `GET /api/item/city/:city` - Get all items in a city
- `POST /api/item/create` - Add menu item (owner only)
- `PUT /api/item/:id` - Update menu item
- `DELETE /api/item/:id` - Remove menu item

---

## 🧪 Testing

I wrote tests for critical functionality using Vitest and React Testing Library:

```bash
cd frontend
npm test
```

**Test Coverage:**
- Component rendering and user interactions
- Redux slice logic and state updates
- API integration tests
- Form validation

Current test suite: 62 tests across 21 test files

---

## 🔄 CI/CD Pipeline

I set up 14 automated workflows using GitHub Actions:

### On Pull Request:
- **Code Quality**: ESLint checks and formatting validation
- **Testing**: Run all 62 tests
- **Security**: Dependency vulnerability scanning with CodeQL
- **Build**: Verify production build succeeds

### On Merge to Main:
- **Deploy**: Automatic deployment to Vercel (frontend) and Render (backend)
- **Health Check**: Verify deployment is accessible
- **Rollback**: Automatic revert if deployment fails
- **Notification**: Post success/failure message on PR

### Scheduled:
- **Backend Health**: Check API health every 6 hours
- **Performance**: Monitor bundle size and Lighthouse scores weekly
- **Dependencies**: Check for outdated packages weekly
- **Security Audit**: Run npm audit weekly

---

## 🚀 Deployment

### Frontend (Vercel)

I configured automatic deployments from the main branch. The `vercel.json` specifies:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

Deployment happens automatically on every push to main, with retry logic for rate limits.

### Backend (Render)

The backend runs on Render with these settings:
- **Build Command**: `npm install`
- **Start Command**: `node cluster.js`
- **Environment**: Node.js 20
- **Auto-Deploy**: Enabled from main branch

I use cluster mode in production to handle multiple concurrent requests efficiently.

---

## ⚡ Performance

### Metrics I Tracked

I tested the application performance using Lighthouse and manual load testing:

**Frontend Performance:**
- Lighthouse Performance Score: 92/100
- First Contentful Paint: ~1.2s
- Time to Interactive: ~2.8s
- Bundle Size (gzipped): ~350 KB

**Backend Performance:**
- Average API Response Time: ~150ms
- Database Query Time: ~50ms (with indexes)
- Concurrent Users Handled: ~500 (tested with cluster mode)
- Socket.IO Connections: Stable up to 1000 concurrent connections

**Optimizations I Implemented:**
- Code splitting with React.lazy for route-based chunks
- Image optimization through Cloudinary (auto-format, auto-quality)
- API response caching (5-minute TTL for shop/item lists)
- Database indexes on frequently queried fields
- Connection pooling for MongoDB (100 connections)
- Cluster mode for utilizing all CPU cores

---

## 🔒 Security

### Authentication & Authorization

I implemented JWT-based authentication with these security measures:

- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (customer, owner, delivery partner)
- Google OAuth as alternative login method

### API Security

- Rate limiting: 100 requests per 15 minutes per IP
- Input validation using express-validator
- CORS configured to allow only frontend domain
- Helmet.js for security headers
- Request sanitization to prevent XSS attacks

### Data Protection

- Environment variables for all sensitive data
- MongoDB connection with SSL/TLS encryption
- File uploads validated for type and size
- Payment processing handled entirely by Stripe (PCI compliant)

---

## 🔮 Future Improvements

Features I plan to add:

**Technical:**
- Implement Redis for distributed caching across multiple server instances
- Add Stripe webhook handlers for reliable payment verification
- Use MongoDB transactions for atomic multi-document operations
- Implement push notifications using Firebase Cloud Messaging
- Add comprehensive error tracking with Sentry

**Features:**
- Admin dashboard for platform-wide analytics
- Advanced search with filters (cuisine, price range, ratings)
- Scheduled orders (order now, deliver later)
- Loyalty points and referral system
- Multi-language support (i18n)

---

## 🤝 Contributing

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes with clear commit messages
4. Write tests for new functionality
5. Push to your branch (`git push origin feature/new-feature`)
6. Open a Pull Request with a description of changes

---

## 📞 Contact

**Adarsh Priydarshi**  
Email: priydarshiadarsh3@gmail.com  
GitHub: [@adarsh-priydarshi-5646](https://github.com/adarsh-priydarshi-5646)

Project Link: [github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App](https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App)

---

## 🙏 Acknowledgments

This project uses several open-source libraries and services:
- React and Redux teams for the excellent frontend tools
- Express.js community for the robust backend framework
- MongoDB for the flexible database with geospatial support
- Socket.IO for making real-time features straightforward
- Stripe for secure payment processing
- Cloudinary for image management
- Vercel and Render for reliable hosting

---

*I built this project to learn full-stack development with real-world features like real-time communication, payment integration, and geospatial queries. It demonstrates my understanding of modern web technologies and best practices.*
