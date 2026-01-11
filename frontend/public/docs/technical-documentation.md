# 🍔 BiteDash - Technical Documentation

<div align="center">

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Tests](https://img.shields.io/badge/Tests-62%20Passing-brightgreen)
![Last Updated](https://img.shields.io/badge/Updated-January%202026-orange)

**A Modern Full-Stack Food Delivery Platform**

[Overview](#-overview) • [Architecture](#-architecture) • [Frontend](#-frontend-guide) • [Backend](#-backend-guide) • [API Reference](#-api-reference) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Architecture](#-architecture)
3. [Frontend Guide](#-frontend-guide)
4. [Backend Guide](#-backend-guide)
5. [Database Models](#-database-models)
6. [API Reference](#-api-reference)
7. [Real-Time Events](#-real-time-events)
8. [State Management](#-state-management)
9. [Performance](#-performance)
10. [Deployment](#-deployment)

---

## 🎯 Overview

### What is BiteDash?

BiteDash is a **hyper-local food delivery ecosystem** that connects restaurants with customers through a seamless digital experience. Built with the MERN stack, it delivers a 60FPS mobile-first experience with real-time tracking.

### Key Features

| Feature | Description | Technology |
|:--------|:------------|:-----------|
| 🎭 **Multi-Role** | Distinct dashboards for Users, Owners, Riders | React 19 + Redux |
| 📍 **Live Tracking** | Real-time map with < 1s latency | Socket.IO + Leaflet |
| 💳 **Secure Pay** | PCI-compliant Stripe & COD | Stripe API |
| 🌍 **Auto-Locate** | Zero-input city detection | Geoapify API |
| 📊 **Analytics** | Revenue & order heatmaps | Recharts |

### Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  React 19  │  Redux Toolkit  │  TailwindCSS  │  Framer Motion│
│  React Router 7  │  Leaflet Maps  │  Recharts  │  Axios      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│  Node.js  │  Express.js  │  Socket.IO  │  JWT Auth          │
│  Mongoose  │  Multer  │  Bcrypt  │  Rate Limiting           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                               │
├─────────────────────────────────────────────────────────────┤
│  MongoDB Atlas  │  Cloudinary  │  Stripe  │  SendGrid       │
│  Geoapify  │  Firebase Auth  │  Vercel  │  Render           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗 Architecture

### System Design

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│  Vercel CDN  │────▶│  React App   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌────────────────────────────┼────────────────────────────┐
                     │                            │                            │
                     ▼                            ▼                            ▼
              ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
              │ Redux Store  │           │  Socket.IO   │           │  REST APIs   │
              └──────────────┘           └──────┬───────┘           └──────┬───────┘
                                                │                          │
                                                └──────────┬───────────────┘
                                                           │
                                                           ▼
                                                ┌──────────────────┐
                                                │  Express Server  │
                                                └────────┬─────────┘
                                                         │
                     ┌───────────────────────────────────┼───────────────────────────────────┐
                     │                   │               │               │                   │
                     ▼                   ▼               ▼               ▼                   ▼
              ┌──────────┐       ┌──────────┐    ┌──────────┐    ┌──────────┐       ┌──────────┐
              │ MongoDB  │       │Cloudinary│    │  Stripe  │    │ SendGrid │       │ Geoapify │
              └──────────┘       └──────────┘    └──────────┘    └──────────┘       └──────────┘
```

### Application Layers

| Layer | Technology | Responsibility |
|:------|:-----------|:---------------|
| **Presentation** | React + TailwindCSS | UI rendering, user interactions |
| **State** | Redux Toolkit | Global state, caching, persistence |
| **Communication** | Axios + Socket.IO | REST calls, real-time events |
| **Business Logic** | Express Controllers | Validation, processing, orchestration |
| **Data Access** | Mongoose ODM | Database operations, schema enforcement |
| **Infrastructure** | MongoDB + Cloud Services | Storage, payments, media, email |

---

## 💻 Frontend Guide

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Nav.jsx              # Navigation bar
│   │   ├── Footer.jsx           # Footer component
│   │   ├── FoodCard.jsx         # Item display card
│   │   ├── UserDashboard.jsx    # Customer dashboard
│   │   ├── OwnerDashboard.jsx   # Restaurant dashboard
│   │   ├── DeliveryBoy.jsx      # Delivery partner view
│   │   ├── AddressModal.jsx     # Address picker
│   │   └── FilterSidebar.jsx    # Search filters
│   │
│   ├── pages/               # Route components
│   │   ├── LandingPage.jsx      # Public homepage
│   │   ├── Home.jsx             # Role-based dashboard
│   │   ├── SignIn.jsx           # Login page
│   │   ├── SignUp.jsx           # Registration
│   │   ├── CheckOut.jsx         # Order checkout
│   │   ├── MyOrders.jsx         # Order history
│   │   ├── TrackOrderPage.jsx   # Live tracking
│   │   ├── Profile.jsx          # User profile
│   │   ├── Shop.jsx             # Restaurant page
│   │   ├── CategoryPage.jsx     # Category listing
│   │   ├── CartPage.jsx         # Shopping cart
│   │   ├── AddItem.jsx          # Add menu item
│   │   ├── EditItem.jsx         # Edit menu item
│   │   └── CreateEditShop.jsx   # Shop management
│   │
│   ├── redux/               # State management
│   │   ├── store.js             # Redux store config
│   │   ├── userSlice.js         # User & cart state
│   │   └── ownerSlice.js        # Owner state
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useGetCity.jsx       # Location detection
│   │   ├── useGetCurrentUser.jsx# Auth state
│   │   ├── useGetMyOrders.jsx   # Order fetching
│   │   └── useUpdateLocation.jsx# GPS tracking
│   │
│   ├── constants/           # App constants
│   │   └── index.js             # API URLs, configs
│   │
│   ├── utils/               # Helper functions
│   │   └── index.js             # Formatters, validators
│   │
│   └── App.jsx              # Root component
│
├── public/                  # Static assets
├── index.html               # Entry HTML
└── vite.config.js           # Build config
```

### Page Documentation

#### 1. Landing Page (`/`)

**Purpose**: Public homepage showcasing the platform

**Features**:
- 🌍 Auto location detection via Geoapify
- 🏙️ City selector dropdown
- 🔥 Trending items carousel
- 📱 Responsive hero section
- ✨ Framer Motion animations

**User Flow**:
```
Visit → Detect Location → Show Trending Items → Browse/Sign In
```

---

#### 2. Authentication (`/signin`, `/signup`)

**Sign In Features**:
- Email/password login
- Google OAuth (Firebase)
- Password visibility toggle
- Auto-redirect if authenticated

**Sign Up Features**:
- Role selection (User/Owner/Delivery)
- Form validation
- OTP verification ready

**Security**:
- JWT in HttpOnly cookies
- CSRF protection
- Rate limiting on attempts

---

#### 3. Home Dashboard (`/home`)

**Role-Based Rendering**:

| Role | Component | Features |
|:-----|:----------|:---------|
| **User** | `UserDashboard` | Browse items, filters, cart |
| **Owner** | `OwnerDashboard` | Orders, analytics, menu |
| **Delivery** | `DeliveryBoy` | Assignments, tracking |

---

#### 4. Checkout (`/checkout`)

**Features**:
- 📍 Interactive Leaflet map
- 🏠 Saved addresses
- 💳 Payment options (COD/Stripe)
- 📝 Order summary

**Payment Flow**:
```
Select Address → Choose Payment → Place Order → Confirmation
       │                │
       │                ├── COD: Direct order creation
       │                └── Online: Stripe checkout → Webhook → Order
       │
       └── Geoapify autocomplete for new addresses
```

---

#### 5. Order Tracking (`/track-order/:id`)

**Real-Time Features**:
- 🗺️ Live map with delivery location
- 📍 Route polyline
- 🛵 Animated delivery marker
- 📊 Status timeline
- 👤 Delivery partner info

**Socket Events**:
```javascript
socket.on('updateDeliveryLocation', ({ lat, lon }) => {
  // Update marker position
  // Pan map to new location
});
```

---

#### 6. Profile (`/profile`)

**Sections**:
- Profile header with avatar
- Statistics (orders, spent, points)
- Saved addresses management
- Edit profile form

---

### Component Patterns

#### Protected Routes
```jsx
<Route element={<ProtectedRoute allowedRoles={['user', 'owner']} />}>
  <Route path="/home" element={<Home />} />
</Route>
```

#### Lazy Loading
```jsx
const CheckOut = lazy(() => import('./pages/CheckOut'));

<Suspense fallback={<Loader />}>
  <CheckOut />
</Suspense>
```

#### Redux Integration
```jsx
const { cartItems, userData } = useSelector(state => state.user);
const dispatch = useDispatch();

dispatch(addToCart(item));
```

---

## ⚙️ Backend Guide

### Project Structure

```
backend/
├── controllers/             # Request handlers
│   ├── auth.controllers.js      # Authentication
│   ├── user.controllers.js      # User operations
│   ├── shop.controllers.js      # Shop management
│   ├── item.controllers.js      # Menu items
│   └── order.controllers.js     # Order processing
│
├── models/                  # Database schemas
│   ├── user.model.js            # User schema
│   ├── shop.model.js            # Shop schema
│   ├── item.model.js            # Item schema
│   ├── order.model.js           # Order schema
│   └── deliveryAssignment.model.js
│
├── routes/                  # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── shop.routes.js
│   ├── item.routes.js
│   └── order.routes.js
│
├── middlewares/             # Express middlewares
│   ├── isAuth.js                # JWT verification
│   ├── rateLimiter.js           # Rate limiting
│   ├── security.js              # Security headers
│   └── upload.js                # File uploads
│
├── services/                # Business logic
│   ├── auth.service.js          # Auth operations
│   └── delivery.service.js      # Delivery logic
│
├── validators/              # Input validation
│   ├── auth.validator.js
│   ├── order.validator.js
│   └── shop.validator.js
│
├── config/                  # Configuration
│   ├── db.js                    # MongoDB connection
│   ├── cache.js                 # In-memory cache
│   └── stripe.js                # Stripe setup
│
├── utils/                   # Utilities
│   ├── sendgridMail.js          # Email service
│   ├── cloudinary.js            # Image uploads
│   └── sanitize.js              # Input sanitization
│
├── socket.js                # Socket.IO setup
├── cluster.js               # Cluster mode
└── index.js                 # Entry point
```

### Middleware Pipeline

```
Request → Rate Limiter → Security Headers → Auth Check → Validation → Controller → Response
```

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sign Up   │────▶│ Hash Pass   │────▶│ Create User │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sign In   │────▶│ Verify Pass │────▶│ Generate JWT│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Set Cookie  │
                                        │ (HttpOnly)  │
                                        └─────────────┘
```

---

## 📊 Database Models

### User Model

```javascript
{
  fullName: String,           // Required
  email: String,              // Unique, indexed
  mobile: String,             // 10 digits
  password: String,           // Hashed
  role: 'user' | 'owner' | 'deliveryBoy',
  addresses: [{
    type: 'home' | 'work' | 'other',
    label: String,
    fullAddress: String,
    latitude: Number,
    longitude: Number,
    isDefault: Boolean
  }],
  location: {                 // GeoJSON for delivery boys
    type: 'Point',
    coordinates: [lon, lat]
  },
  isOnline: Boolean,
  socketId: String,
  totalEarnings: Number,
  createdAt: Date
}
```

### Shop Model

```javascript
{
  name: String,               // Required
  city: String,
  state: String,
  address: String,
  image: String,              // Cloudinary URL
  owner: ObjectId,            // Ref: User
  items: [ObjectId],          // Ref: Item[]
  isDefault: Boolean,
  createdAt: Date
}
```

### Item Model

```javascript
{
  name: String,               // Required
  description: String,
  price: Number,              // Required
  image: String,              // Cloudinary URL
  category: String,           // Biryani, Pizza, etc.
  foodType: 'veg' | 'non-veg',
  rating: {
    average: Number,
    count: Number
  },
  deliveryTime: Number,       // Minutes
  shop: ObjectId,             // Ref: Shop
  createdAt: Date
}
```

### Order Model

```javascript
{
  user: ObjectId,             // Ref: User
  paymentMethod: 'cod' | 'online',
  deliveryAddress: {
    text: String,
    latitude: Number,
    longitude: Number
  },
  totalAmount: Number,
  payment: Boolean,
  stripeSessionId: String,
  orderRating: {
    rating: Number,           // 1-5
    review: String,
    ratedAt: Date
  },
  shopOrders: [{              // Multi-shop support
    shop: ObjectId,
    owner: ObjectId,
    subtotal: Number,
    status: 'pending' | 'preparing' | 'out of delivery' | 'delivered' | 'cancelled',
    shopOrderItems: [{
      item: ObjectId,
      name: String,
      price: Number,
      quantity: Number
    }],
    assignedDeliveryBoy: ObjectId,
    deliveryOtp: String,
    otpExpires: Date,
    deliveredAt: Date
  }],
  createdAt: Date
}
```

---

## 📡 API Reference

### Authentication APIs

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `POST` | `/api/auth/signup` | Register new user | ❌ |
| `POST` | `/api/auth/signin` | Login user | ❌ |
| `POST` | `/api/auth/google` | Google OAuth | ❌ |
| `GET` | `/api/auth/current` | Get current user | ✅ |
| `POST` | `/api/auth/logout` | Logout user | ✅ |
| `POST` | `/api/auth/forgot-password` | Send reset OTP | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password | ❌ |

### User APIs

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `PUT` | `/api/user/update-profile` | Update profile | ✅ |
| `PUT` | `/api/user/update-location` | Update GPS location | ✅ |
| `GET` | `/api/user/profile-stats` | Get user statistics | ✅ |

### Shop APIs

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `POST` | `/api/shop/create-edit-shop` | Create/update shop | Owner |
| `GET` | `/api/shop/my-shop` | Get owner's shop | Owner |
| `GET` | `/api/shop/city/:city` | Get shops by city | ❌ |
| `GET` | `/api/shop/:shopId` | Get shop details | ❌ |

### Item APIs

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `POST` | `/api/item/add-item` | Add menu item | Owner |
| `PUT` | `/api/item/:itemId` | Update item | Owner |
| `DELETE` | `/api/item/:itemId` | Delete item | Owner |
| `GET` | `/api/item/all-items` | Get all items | ❌ |
| `GET` | `/api/item/city/:city` | Get items by city | ❌ |

### Order APIs

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `POST` | `/api/order/place-order` | Place new order | ✅ |
| `GET` | `/api/order/my-orders` | Get user's orders | ✅ |
| `GET` | `/api/order/:orderId` | Get order details | ✅ |
| `PUT` | `/api/order/status/:orderId/:shopId` | Update status | Owner |
| `POST` | `/api/order/send-otp` | Send delivery OTP | Delivery |
| `POST` | `/api/order/verify-otp` | Verify delivery OTP | Delivery |
| `POST` | `/api/order/rate/:orderId` | Rate order | ✅ |
| `POST` | `/api/order/create-stripe-payment-intent` | Create Stripe session | ✅ |
| `POST` | `/api/order/verify-stripe-payment` | Verify payment | ✅ |

### Delivery APIs

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/api/order/assignments` | Get available orders | Delivery |
| `POST` | `/api/order/accept/:assignmentId` | Accept delivery | Delivery |
| `GET` | `/api/order/current-order` | Get active delivery | Delivery |
| `GET` | `/api/order/today-deliveries` | Get today's stats | Delivery |

---

## 🔌 Real-Time Events

### Socket.IO Architecture

```
┌─────────────┐                    ┌─────────────┐
│   Client    │◀──── Events ──────│   Server    │
│  (Browser)  │────── Emit ──────▶│  (Node.js)  │
└─────────────┘                    └─────────────┘
```

### Client → Server Events

| Event | Payload | Description |
|:------|:--------|:------------|
| `identity` | `{ userId }` | Register socket connection |
| `updateLocation` | `{ userId, lat, lon }` | Update delivery location |
| `disconnect` | - | Handle disconnection |

### Server → Client Events

| Event | Payload | Description |
|:------|:--------|:------------|
| `newOrder` | `{ order, shopOrder }` | New order notification |
| `update-status` | `{ orderId, status }` | Order status change |
| `newAssignment` | `{ assignment }` | New delivery assignment |
| `updateDeliveryLocation` | `{ lat, lon }` | Delivery boy location |
| `orderDelivered` | `{ orderId }` | Delivery confirmation |
| `orderCancelled` | `{ orderId, reason }` | Order cancellation |

---

## 🗄 State Management

### Redux Store Structure

```javascript
{
  user: {
    userData: Object | null,      // Current user
    authLoading: Boolean,         // Auth state loading
    currentCity: String,          // Selected city
    cartItems: Array,             // Shopping cart
    totalAmount: Number,          // Cart total
    shopInMyCity: Array,          // City shops
    itemsInMyCity: Array,         // City items
    searchItems: String,          // Search query
    myOrders: Array,              // Order history
    selectedCategories: Array,    // Active filters
    priceRange: Object,           // Price filter
    sortBy: String,               // Sort option
    quickFilters: Object,         // Veg, fast delivery, etc.
    socket: Object                // Socket.IO instance
  },
  owner: {
    myShopData: Object | null     // Owner's shop
  },
  map: {
    location: Object,             // Current location
    address: String               // Current address
  }
}
```

### Key Actions

```javascript
// Authentication
setUserData(user)
logout()

// Cart Management
addToCart(item)
updateQuantity({ id, quantity })
removeCartItem(id)
clearCart()

// Location
setCurrentCity(city)
setLocation({ lat, lon, address })

// Orders
setMyOrders(orders)
updateRealtimeOrderStatus({ orderId, status })

// Filters
toggleCategory(category)
setPriceRange({ min, max })
setSortBy(option)
```

---

## ⚡ Performance

### Optimization Techniques

| Technique | Implementation | Impact |
|:----------|:---------------|:-------|
| **Code Splitting** | `React.lazy()` for routes | 70% smaller initial bundle |
| **Memoization** | `React.memo`, `useMemo` | 50% fewer re-renders |
| **Image Lazy Load** | `loading="lazy"` | 40% faster page load |
| **Chunk Splitting** | Vite manual chunks | Better caching |
| **Connection Pooling** | MongoDB 100 connections | Handle 5000+ req/s |
| **Rate Limiting** | 100 req/15min per IP | DDoS protection |
| **In-Memory Cache** | Node-cache for hot data | Reduced DB queries |

### Bundle Analysis

```
dist/
├── index.html                    6.73 kB
├── react-vendor.js              44.18 kB   (React core)
├── redux-vendor.js              27.27 kB   (Redux)
├── ui-libs.js                  130.31 kB   (Framer, Icons)
├── map-libs.js                 153.28 kB   (Leaflet)
├── chart-libs.js               275.71 kB   (Recharts)
└── index.js                    291.08 kB   (App code)
```

---

## 🚀 Deployment

### Frontend (Vercel)

**Configuration** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Environment Variables**:
```env
VITE_FIREBASE_APIKEY=xxx
VITE_GEOAPIKEY=xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_xxx
VITE_API_BASE=https://api.bitedash.com
```

**Build**: `npm run build`  
**Output**: `dist/`

---

### Backend (Render)

**Environment Variables**:
```env
PORT=8000
NODE_ENV=production
MONGODB_URL=mongodb+srv://xxx
JWT_SECRET=xxx
STRIPE_SECRET_KEY=sk_xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SENDGRID_API_KEY=SG.xxx
FRONTEND_URL=https://bitedash.vercel.app
```

**Start**: `npm start`  
**Health Check**: `GET /`

---

### Database (MongoDB Atlas)

**Indexes**:
```javascript
users.createIndex({ email: 1 }, { unique: true })
users.createIndex({ location: '2dsphere' })
orders.createIndex({ user: 1 })
items.createIndex({ shop: 1 })
```

---

## 📈 Summary

| Metric | Value |
|:-------|:------|
| **Frontend Pages** | 17 |
| **Backend APIs** | 30+ |
| **Database Models** | 5 |
| **Test Coverage** | 62 tests passing |
| **Build Time** | ~7 seconds |
| **Bundle Size** | ~1.2 MB (gzipped: ~350 KB) |

---

<div align="center">

**Built with ❤️ by BiteDash Team**

[Report Bug](https://github.com/bitedash/issues) • [Request Feature](https://github.com/bitedash/issues)

</div>
