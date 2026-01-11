# 🍔 BiteDash - Food Delivery Platform

<div align="center">

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![Tests](https://img.shields.io/badge/Tests-62%20Passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

<img src="https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg" alt="BiteDash Banner" width="800" />

**A Production-Ready Full-Stack Food Delivery Platform**

[Live Demo](https://food-delivery-full-stack-app-me1o.vercel.app) • [API Docs](https://food-delivery-full-stack-app-me1o.vercel.app/docs) • [Report Bug](https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👤 Customer Features

| Feature                     | Description                                                |
| :-------------------------- | :--------------------------------------------------------- |
| 🔐 **Authentication**       | Email/Password + Google OAuth (Firebase)                   |
| 🏪 **Restaurant Discovery** | Browse by city, category, ratings                          |
| 🔍 **Smart Search**         | Real-time search with filters (price, veg/non-veg, rating) |
| 🛒 **Cart Management**      | Persistent cart with localStorage                          |
| 💳 **Secure Payments**      | Stripe integration + Cash on Delivery                      |
| 📍 **Live Tracking**        | Real-time order tracking with Socket.IO                    |
| 📱 **Responsive UI**        | Mobile-first design with TailwindCSS                       |

### 🏪 Restaurant Owner Features

| Feature                    | Description                                  |
| :------------------------- | :------------------------------------------- |
| 📊 **Analytics Dashboard** | Revenue, orders, best-sellers                |
| 🍽️ **Menu Management**     | Add/Edit/Delete items with Cloudinary images |
| 📦 **Order Management**    | Accept/Reject orders in real-time            |
| 🛵 **Delivery Assignment** | Auto-assign nearby delivery partners         |

### 🛵 Delivery Partner Features

| Feature                 | Description                      |
| :---------------------- | :------------------------------- |
| 📋 **Order Queue**      | View available deliveries nearby |
| 🗺️ **Route Navigation** | Pickup & delivery locations      |
| ✅ **OTP Verification** | Secure delivery confirmation     |
| 💰 **Earnings Tracker** | Daily/Monthly earnings stats     |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  React 19  │  Redux Toolkit  │  TailwindCSS 4  │  Vite 7    │
│  React Router 7  │  Framer Motion  │  Leaflet  │  Recharts  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│  Node.js 20  │  Express 5  │  Socket.IO  │  Mongoose        │
│  JWT Auth  │  Rate Limiting  │  Cluster Mode  │  Helmet     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                               │
├─────────────────────────────────────────────────────────────┤
│  MongoDB Atlas  │  Cloudinary  │  Stripe  │  SendGrid       │
│  Firebase Auth  │  Geoapify  │  Vercel  │  Render           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

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
                                                │  (Cluster Mode)  │
                                                └────────┬─────────┘
                                                         │
                     ┌───────────────────────────────────┼───────────────────────────────────┐
                     │                   │               │               │                   │
                     ▼                   ▼               ▼               ▼                   ▼
              ┌──────────┐       ┌──────────┐    ┌──────────┐    ┌──────────┐       ┌──────────┐
              │ MongoDB  │       │Cloudinary│    │  Stripe  │    │ SendGrid │       │ Geoapify │
              └──────────┘       └──────────┘    └──────────┘    └──────────┘       └──────────┘
```

---

## 📂 Project Structure

```
BiteDash/
├── .github/                    # GitHub configurations
│   ├── workflows/              # CI/CD pipelines (8 workflows)
│   │   ├── ci.yml              # Main CI pipeline
│   │   ├── pr-checks.yml       # PR validation & auto-labeling
│   │   ├── deploy.yml          # Production deployment
│   │   ├── security.yml        # CodeQL security scanning
│   │   ├── auto-merge.yml      # Dependabot auto-merge
│   │   ├── rollback.yml        # Auto-rollback on failure
│   │   ├── release.yml         # Semantic versioning
│   │   └── stale.yml           # Stale issue management
│   ├── CODEOWNERS              # Code ownership rules
│   ├── dependabot.yml          # Dependency updates
│   └── pull_request_template.md
│
├── backend/                    # Node.js Express Server
│   ├── config/                 # Configuration files
│   │   ├── db.js               # MongoDB connection (pooling)
│   │   ├── cache.js            # In-memory caching
│   │   └── stripe.js           # Stripe configuration
│   ├── constants/              # App constants
│   ├── controllers/            # Request handlers
│   ├── middlewares/            # Express middlewares
│   │   ├── isAuth.js           # JWT authentication
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── security.js         # Security headers
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── services/               # Business logic layer
│   ├── utils/                  # Helper functions
│   ├── validators/             # Input validation
│   ├── cluster.js              # Cluster mode for scaling
│   ├── socket.js               # Socket.IO setup
│   ├── index.js                # Entry point
│   ├── .env.example            # Environment template
│   └── ARCHITECTURE.md         # Backend documentation
│
├── frontend/                   # React Application
│   ├── public/
│   │   └── docs/               # Technical documentation
│   ├── src/
│   │   ├── __tests__/          # Test files (21 test suites)
│   │   ├── components/         # Reusable UI components
│   │   │   └── __tests__/      # Component tests
│   │   ├── pages/              # Route components
│   │   │   └── __tests__/      # Page tests
│   │   ├── redux/              # State management
│   │   │   └── __tests__/      # Redux tests
│   │   ├── hooks/              # Custom React hooks
│   │   ├── constants/          # App constants
│   │   ├── utils/              # Helper functions
│   │   └── App.jsx             # Root component
│   ├── .env.example            # Environment template
│   └── ARCHITECTURE.md         # Frontend documentation
│
└── README.md                   # This file
```

---

## ⚙️ Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Stripe account
- Cloudinary account
- Firebase project (for Google OAuth)
- Geoapify API key

### Quick Start

```bash
# Clone repository
git clone https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App.git
cd Food-Delivery-Full-Stack-App

# Install backend dependencies
cd backend
npm install
cp .env.example .env  # Configure your environment variables

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env  # Configure your environment variables

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/bitedash

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Development
MASTER_OTP=5646
```

### Frontend (`frontend/.env`)

```env
# Firebase
VITE_FIREBASE_APIKEY=xxx

# Geoapify
VITE_GEOAPIKEY=xxx

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Backend API
VITE_API_BASE=http://localhost:8000
```

> 📝 See `.env.example` files for complete configuration with detailed comments.

---

## 🚀 Usage

### User Roles

| Role         | Email                | Password      | Access                     |
| :----------- | :------------------- | :------------ | :------------------------- |
| **Customer** | `user@bitedash.com`  | `password123` | Order food, track delivery |
| **Owner**    | `owner@bitedash.com` | `password123` | Manage restaurant & menu   |
| **Delivery** | `rider@bitedash.com` | `password123` | Accept & deliver orders    |

> 🔑 **Master OTP**: `5646` (for delivery verification & password reset)

### User Flow

```
1. Landing Page → Sign Up/Sign In
2. Browse Restaurants → Add to Cart
3. Checkout → Select Address → Choose Payment
4. Track Order → Receive Delivery → Rate Order
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint            | Description      |
| :----- | :------------------ | :--------------- |
| POST   | `/api/auth/signup`  | Register user    |
| POST   | `/api/auth/signin`  | Login user       |
| POST   | `/api/auth/google`  | Google OAuth     |
| GET    | `/api/auth/current` | Get current user |
| POST   | `/api/auth/logout`  | Logout           |

### Orders

| Method | Endpoint                        | Description     |
| :----- | :------------------------------ | :-------------- |
| POST   | `/api/order/place-order`        | Create order    |
| GET    | `/api/order/my-orders`          | Get user orders |
| PUT    | `/api/order/status/:id/:shopId` | Update status   |
| POST   | `/api/order/verify-otp`         | Verify delivery |

> 📚 Full API documentation: [/docs](https://food-delivery-full-stack-app-me1o.vercel.app/docs)

---

## 🧪 Testing

```bash
# Run all tests
cd frontend && npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- FoodCard.test.jsx
```

**Test Coverage**: 62 tests across 21 test suites

- Unit tests for components
- Integration tests for pages
- Redux slice tests

---

## 🔄 CI/CD

### GitHub Actions Workflows

| Workflow         | Trigger      | Description          |
| :--------------- | :----------- | :------------------- |
| `ci.yml`         | Push/PR      | Lint, test, build    |
| `pr-checks.yml`  | PR           | Auto-label, validate |
| `deploy.yml`     | Push to main | Deploy to Vercel     |
| `security.yml`   | Schedule     | CodeQL scanning      |
| `auto-merge.yml` | Dependabot   | Auto-merge patches   |
| `rollback.yml`   | Deploy fail  | Auto-rollback        |

### Auto-Labeling

PRs are automatically labeled based on changed files:

- 🎨 `frontend` - React changes
- ⚙️ `backend` - Node.js changes
- 📚 `docs` - Documentation
- 🔧 `ci` - Workflow changes

---

## 🔒 Security Features

- ✅ JWT in HttpOnly cookies
- ✅ Rate limiting (100 req/15min)
- ✅ Input sanitization (XSS prevention)
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ CodeQL security scanning
- ✅ Dependabot alerts

---

## 📈 Performance

| Metric             | Value           |
| :----------------- | :-------------- |
| Lighthouse Score   | 90+             |
| Bundle Size (gzip) | ~350 KB         |
| Build Time         | ~7 seconds      |
| MongoDB Pool       | 100 connections |
| Rate Limit         | 5000+ req/s     |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### PR Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Use conventional commits

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ by [Adarsh Priydarshi](https://github.com/adarsh-priydarshi-5646)**

⭐ Star this repo if you find it helpful!

</div>
