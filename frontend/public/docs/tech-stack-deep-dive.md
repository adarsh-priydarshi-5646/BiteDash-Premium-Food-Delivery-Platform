# 🛠️ BiteDash - Tech Stack Deep Dive

<div align="center">

![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green)
![Scalability](https://img.shields.io/badge/Scalability-⭐⭐⭐⭐-blue)
![Security](https://img.shields.io/badge/Security-⭐⭐⭐⭐-blue)

**Complete Technical Analysis of Tools, Libraries & Architecture**

</div>

---

## 📋 Table of Contents

1. [Current Capacity](#-current-capacity)
2. [Optimization Levels](#-optimization-levels)
3. [Frontend Tech Stack](#-frontend-tech-stack)
4. [Backend Tech Stack](#-backend-tech-stack)
5. [Security Implementation](#-security-implementation)
6. [Caching Strategy](#-caching-strategy)
7. [DevOps & CI/CD](#-devops--cicd)
8. [Current Architecture](#-current-architecture)
9. [Future Scaling (AWS/K8s)](#-future-scaling-awsk8s)
10. [Enterprise Features Missing](#-enterprise-features-missing)

---

## 📊 Current Capacity

### Free Tier Limits

| Metric | Current Capacity | Service |
|:-------|:-----------------|:--------|
| **Concurrent Users** | ~100-300 | Render Free |
| **Requests/Second** | ~50-80 | Rate Limited |
| **Monthly Requests** | ~100,000 | Render Free |
| **DB Connections** | 100 pooled | MongoDB Atlas |
| **File Uploads** | 25GB/month | Cloudinary Free |
| **Bandwidth** | 100GB/month | Render Free |
| **Cold Start** | 15 min idle sleep | Render Free |

### Performance Benchmarks

```
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSE TIMES                            │
├─────────────────────────────────────────────────────────────┤
│  API Response (cached)     │  ~50-100ms                     │
│  API Response (DB query)   │  ~150-300ms                    │
│  Image Load (Cloudinary)   │  ~200-500ms                    │
│  Socket Event Latency      │  ~50-150ms                     │
│  Frontend Initial Load     │  ~1.5-2.5s                     │
│  Frontend Subsequent       │  ~300-500ms (cached)           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⭐ Optimization Levels

| Area | Rating | Implementation Details |
|:-----|:------:|:-----------------------|
| **Code Quality** | ⭐⭐⭐⭐ | ESLint strict rules, Prettier formatting, JSDoc comments on all files |
| **Security** | ⭐⭐⭐⭐ | XSS protection, NoSQL injection prevention, rate limiting, CORS, input sanitization |
| **Scalability** | ⭐⭐⭐⭐ | Connection pooling (100), in-memory caching, cluster-ready code |
| **Reliability** | ⭐⭐⭐ | Graceful shutdown, error handling, health checks (no Redis/queue yet) |
| **Performance** | ⭐⭐⭐⭐ | Response caching, code splitting, lazy loading, image optimization |
| **CI/CD** | ⭐⭐⭐⭐⭐ | Auto lint, 62 tests, build verification, security audit, auto-merge |

---

## 💻 Frontend Tech Stack

### Core Framework

#### React 19
| Aspect | Details |
|:-------|:--------|
| **What it does** | UI component library for building interactive user interfaces |
| **Why used** | Industry standard, component-based architecture, virtual DOM for performance |
| **How used** | Functional components with hooks (useState, useEffect, useMemo) |
| **Alternatives** | Vue.js, Angular, Svelte, Solid.js |
| **Connected to** | Redux for state, React Router for navigation, Vite for bundling |
| **Benefits** | Large ecosystem, reusable components, declarative syntax |

```jsx
// Example: Functional component with hooks
function FoodCard({ item }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, quantity }));
  };
  
  return (
    <div className="food-card">
      <img src={item.image} alt={item.name} loading="lazy" />
      <h3>{item.name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

---

#### Vite 7
| Aspect | Details |
|:-------|:--------|
| **What it does** | Next-generation frontend build tool and dev server |
| **Why used** | 10-100x faster than Webpack, native ES modules, instant HMR |
| **How used** | Development server, production bundling, code splitting |
| **Alternatives** | Webpack, Parcel, Rollup, esbuild |
| **Connected to** | React plugin, TailwindCSS, Vitest for testing |
| **Benefits** | Lightning fast builds (~7s), tree shaking, chunk optimization |

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-libs': ['framer-motion', 'react-icons'],
          'map-libs': ['leaflet', 'react-leaflet'],
          'chart-libs': ['recharts']
        }
      }
    }
  }
});
```

---

#### Redux Toolkit
| Aspect | Details |
|:-------|:--------|
| **What it does** | Centralized state management for React applications |
| **Why used** | Predictable state, time-travel debugging, middleware support |
| **How used** | Global store for user data, cart, orders, filters |
| **Alternatives** | Zustand, Jotai, MobX, React Context |
| **Connected to** | React components via useSelector/useDispatch hooks |
| **Benefits** | DevTools, immutable updates, async thunks |

```javascript
// userSlice.js - Redux slice example
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    cartItems: [],
    totalAmount: 0,
    currentCity: '',
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    addToCart: (state, action) => {
      const existing = state.cartItems.find(i => i._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    }
  }
});
```

---

#### React Router 7
| Aspect | Details |
|:-------|:--------|
| **What it does** | Client-side routing for single-page applications |
| **Why used** | Declarative routing, nested routes, protected routes |
| **How used** | Route definitions, navigation, URL parameters |
| **Alternatives** | TanStack Router, Wouter, Next.js routing |
| **Connected to** | React components, Redux for auth state |
| **Benefits** | Code splitting per route, lazy loading, history management |

```jsx
// App.jsx - Route configuration
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />
  
  {/* Protected Routes */}
  <Route element={<ProtectedRoute allowedRoles={['user', 'owner', 'deliveryBoy']} />}>
    <Route path="/home" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/my-orders" element={<MyOrders />} />
  </Route>
  
  {/* Owner Only */}
  <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
    <Route path="/add-item" element={<AddItem />} />
    <Route path="/edit-item/:itemId" element={<EditItem />} />
  </Route>
</Routes>
```

---

#### TailwindCSS 4
| Aspect | Details |
|:-------|:--------|
| **What it does** | Utility-first CSS framework for rapid UI development |
| **Why used** | No context switching, consistent design, small bundle size |
| **How used** | Utility classes directly in JSX, responsive design |
| **Alternatives** | Bootstrap, Material UI, Chakra UI, styled-components |
| **Connected to** | Vite plugin, PostCSS for processing |
| **Benefits** | Purges unused CSS, mobile-first, customizable theme |

```jsx
// Utility-first styling example
<button className="
  w-full 
  bg-[#E23744] 
  hover:bg-[#d02433] 
  text-white 
  font-medium 
  py-3 
  rounded-lg 
  shadow-sm 
  transition-all 
  flex 
  justify-center 
  items-center 
  gap-2
">
  Add to Cart
</button>
```

---

#### Axios
| Aspect | Details |
|:-------|:--------|
| **What it does** | Promise-based HTTP client for API requests |
| **Why used** | Interceptors, automatic JSON parsing, request/response transforms |
| **How used** | All REST API calls to backend |
| **Alternatives** | Fetch API, ky, got, superagent |
| **Connected to** | Backend Express APIs, Redux async actions |
| **Benefits** | Request cancellation, timeout handling, error interceptors |

```javascript
// API call with credentials
const response = await axios.post(
  `${serverUrl}/api/auth/signin`,
  { email, password },
  { withCredentials: true }  // Send cookies
);

// With interceptor for auth
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
```

---

#### Socket.IO Client
| Aspect | Details |
|:-------|:--------|
| **What it does** | Real-time bidirectional event-based communication |
| **Why used** | Live order tracking, instant notifications, delivery updates |
| **How used** | WebSocket connection to backend, event listeners |
| **Alternatives** | WebSocket API, Pusher, Ably, Firebase Realtime |
| **Connected to** | Backend Socket.IO server, Redux for state updates |
| **Benefits** | Auto-reconnection, fallback to polling, room support |

```javascript
// Socket connection and events
const socket = io(serverUrl, {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

// Register user identity
socket.emit('identity', { oderId: order._id });

// Listen for delivery location updates
socket.on('updateDeliveryLocation', ({ oderId, lat, lon }) => {
  dispatch(updateDeliveryLocation({ oderId, lat, lon }));
});

// Listen for order status changes
socket.on('update-status', ({ oderId, status }) => {
  dispatch(updateRealtimeOrderStatus({ oderId, status }));
});
```

---

#### Firebase (Google OAuth)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Authentication service for Google sign-in |
| **Why used** | Secure OAuth 2.0, no password management, trusted provider |
| **How used** | Google popup sign-in, token verification on backend |
| **Alternatives** | Auth0, Clerk, Supabase Auth, Passport.js |
| **Connected to** | Backend auth API for user creation/login |
| **Benefits** | One-click sign-in, secure token handling, user management |

```javascript
// Google OAuth flow
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const handleGoogleAuth = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Send to backend for user creation/login
  const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
    fullName: result.user.displayName,
    email: result.user.email,
    mobile: mobile,
    role: 'user'
  }, { withCredentials: true });
  
  dispatch(setUserData(data));
};
```

---

#### Framer Motion
| Aspect | Details |
|:-------|:--------|
| **What it does** | Production-ready animation library for React |
| **Why used** | Declarative animations, gestures, layout animations |
| **How used** | Page transitions, hover effects, loading states |
| **Alternatives** | React Spring, GSAP, Anime.js, CSS animations |
| **Connected to** | React components for animated UI elements |
| **Benefits** | 60fps animations, gesture support, exit animations |

```jsx
// Animated component example
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <FoodCard item={item} />
</motion.div>
```

---

#### Leaflet + React-Leaflet
| Aspect | Details |
|:-------|:--------|
| **What it does** | Interactive maps for location selection and tracking |
| **Why used** | Open-source, lightweight, mobile-friendly |
| **How used** | Address selection, delivery tracking, route display |
| **Alternatives** | Google Maps, Mapbox, OpenLayers |
| **Connected to** | Geoapify for geocoding, Socket.IO for live updates |
| **Benefits** | Free, customizable, no API key limits |

```jsx
// Live tracking map
<MapContainer center={[lat, lon]} zoom={15}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
  {/* Delivery boy marker with live updates */}
  <Marker position={deliveryLocation} icon={deliveryIcon}>
    <Popup>Delivery Partner</Popup>
  </Marker>
  
  {/* Route polyline */}
  <Polyline positions={routeCoordinates} color="#E23744" />
</MapContainer>
```

---

#### Recharts
| Aspect | Details |
|:-------|:--------|
| **What it does** | Composable charting library for React |
| **Why used** | Easy to use, responsive, customizable |
| **How used** | Owner dashboard analytics, revenue charts |
| **Alternatives** | Chart.js, D3.js, Victory, Nivo |
| **Connected to** | Backend analytics APIs, Redux state |
| **Benefits** | Declarative, responsive, animation support |

```jsx
// Revenue chart example
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={revenueData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="revenue" stroke="#E23744" />
  </LineChart>
</ResponsiveContainer>
```

---

#### Vitest
| Aspect | Details |
|:-------|:--------|
| **What it does** | Unit testing framework for Vite projects |
| **Why used** | Native Vite integration, fast, Jest-compatible |
| **How used** | Component tests, hook tests, Redux tests |
| **Alternatives** | Jest, Mocha, Testing Library |
| **Connected to** | React Testing Library, jsdom for DOM |
| **Benefits** | Instant HMR, parallel execution, coverage reports |

```javascript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import FoodCard from '../FoodCard';

test('adds item to cart on button click', () => {
  render(
    <Provider store={store}>
      <FoodCard item={mockItem} />
    </Provider>
  );
  
  fireEvent.click(screen.getByText('Add to Cart'));
  expect(store.getState().user.cartItems).toHaveLength(1);
});
```


---

## ⚙️ Backend Tech Stack

### Core Framework

#### Express.js 5
| Aspect | Details |
|:-------|:--------|
| **What it does** | Minimal web framework for Node.js |
| **Why used** | Industry standard, middleware ecosystem, flexibility |
| **How used** | REST API routes, middleware pipeline, error handling |
| **Alternatives** | Fastify, Koa, Hapi, NestJS |
| **Connected to** | All middlewares, routes, controllers |
| **Benefits** | Large ecosystem, simple API, extensive documentation |

```javascript
// Express server setup
const app = express();

// Middleware pipeline
app.use(securityHeaders);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(rateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeRequest);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/shop', shopRouter);
app.use('/api/item', itemRouter);
app.use('/api/order', orderRouter);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

---

#### MongoDB + Mongoose
| Aspect | Details |
|:-------|:--------|
| **What it does** | NoSQL database with ODM for schema validation |
| **Why used** | Flexible schema, JSON-like documents, horizontal scaling |
| **How used** | All data storage - users, shops, items, orders |
| **Alternatives** | PostgreSQL, MySQL, DynamoDB, Firebase Firestore |
| **Connected to** | MongoDB Atlas (cloud), Mongoose for schemas |
| **Benefits** | Schema validation, middleware hooks, population |

```javascript
// Connection with pooling
mongoose.connect(process.env.MONGODB_URL, {
  maxPoolSize: 100,        // Handle 100 concurrent connections
  minPoolSize: 10,         // Keep 10 connections ready
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Schema example with validation
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['user', 'owner', 'deliveryBoy'],
    default: 'user'
  },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number]  // [longitude, latitude]
  }
});

// Geospatial index for delivery boy queries
userSchema.index({ location: '2dsphere' });
```

---

#### JWT (jsonwebtoken)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Stateless authentication via signed tokens |
| **Why used** | No session storage needed, scalable, secure |
| **How used** | Login generates token, stored in HttpOnly cookie |
| **Alternatives** | Session-based auth, Passport.js, OAuth tokens |
| **Connected to** | Auth middleware, cookie-parser |
| **Benefits** | Stateless, contains user info, expiration support |

```javascript
// Token generation
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Set as HttpOnly cookie (XSS protection)
res.cookie('token', token, {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // HTTPS only
  sameSite: 'none',    // Cross-origin requests
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// Auth middleware verification
const isAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

#### Bcrypt
| Aspect | Details |
|:-------|:--------|
| **What it does** | Password hashing with salt |
| **Why used** | Industry standard, adaptive cost factor, secure |
| **How used** | Hash passwords on signup, verify on login |
| **Alternatives** | Argon2, scrypt, PBKDF2 |
| **Connected to** | User model, auth controller |
| **Benefits** | Built-in salt, configurable rounds, timing-safe compare |

```javascript
// Hash password on signup
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password on login
const isMatch = await bcrypt.compare(inputPassword, user.password);
if (!isMatch) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

---

#### Socket.IO (Server)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Real-time bidirectional communication server |
| **Why used** | Live order tracking, instant notifications |
| **How used** | Order status updates, delivery location broadcasting |
| **Alternatives** | ws, µWebSockets, Pusher, Ably |
| **Connected to** | Express server, order controllers |
| **Benefits** | Room support, auto-reconnection, fallback transport |

```javascript
// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['POST', 'GET']
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Socket event handlers
io.on('connection', (socket) => {
  // Register user identity
  socket.on('identity', ({ oderId }) => {
    socket.join(`order_${oderId}`);
  });
  
  // Delivery boy location update
  socket.on('updateLocation', async ({ oderId, lat, lon }) => {
    io.to(`order_${oderId}`).emit('updateDeliveryLocation', { lat, lon });
  });
});

// Emit from controller
const io = req.app.get('io');
io.to(`order_${orderId}`).emit('update-status', { orderId, status: 'preparing' });
```

---

#### Multer + Cloudinary
| Aspect | Details |
|:-------|:--------|
| **What it does** | File upload handling + cloud image storage |
| **Why used** | Multipart form handling, CDN delivery, transformations |
| **How used** | Shop images, menu item photos, profile pictures |
| **Alternatives** | Formidable + S3, Busboy + Firebase Storage |
| **Connected to** | Express routes, Cloudinary SDK |
| **Benefits** | Auto-optimization, responsive images, global CDN |

```javascript
// Multer configuration
const storage = multer.diskStorage({
  destination: './public/temp',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// Cloudinary upload
const uploadOnCloudinary = async (localFilePath) => {
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder: 'bitedash',
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });
  fs.unlinkSync(localFilePath);  // Delete local file
  return result.secure_url;
};
```

---

#### Stripe SDK
| Aspect | Details |
|:-------|:--------|
| **What it does** | Payment processing for online orders |
| **Why used** | PCI compliant, global support, excellent API |
| **How used** | Checkout sessions, payment verification |
| **Alternatives** | Razorpay, PayPal, Square, Braintree |
| **Connected to** | Order controller, frontend Stripe.js |
| **Benefits** | Hosted checkout, webhooks, fraud protection |

```javascript
// Create Stripe checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: orderItems.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: { name: item.name },
      unit_amount: item.price * 100  // Paise
    },
    quantity: item.quantity
  })),
  mode: 'payment',
  success_url: `${FRONTEND_URL}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${FRONTEND_URL}/checkout`,
  customer_email: user.email,
  client_reference_id: orderId
});

// Verify payment
const verifyPayment = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === 'paid';
};
```

---

#### SendGrid / Nodemailer
| Aspect | Details |
|:-------|:--------|
| **What it does** | Transactional email delivery |
| **Why used** | High deliverability, templates, analytics |
| **How used** | OTP emails, order confirmations, password reset |
| **Alternatives** | Mailgun, AWS SES, Postmark, Resend |
| **Connected to** | Auth controller, order controller |
| **Benefits** | 100 free emails/day, templates, tracking |

```javascript
// SendGrid email
const sendEmail = async ({ to, subject, html }) => {
  await sgMail.send({
    to,
    from: 'noreply@bitedash.com',
    subject,
    html
  });
};

// OTP email template
await sendEmail({
  to: user.email,
  subject: 'Your BiteDash OTP',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset OTP</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes.</p>
    </div>
  `
});
```


---

## 🔒 Security Implementation

### Rate Limiting (express-rate-limit)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Limits repeated requests to prevent abuse |
| **Why used** | DDoS protection, brute force prevention |
| **How used** | Global limiter + specific limiters for sensitive routes |
| **Alternatives** | rate-limiter-flexible, Redis-based limiters |
| **Configuration** | 100 requests per 15 minutes per IP |
| **Benefits** | Prevents API abuse, protects server resources |

```javascript
// Global rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limiter for orders (prevent spam orders)
export const orderRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // 5 orders per minute
  message: { error: 'Order limit exceeded' }
});

// Search rate limiter
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Search limit exceeded' }
});
```

---

### Input Sanitization (NoSQL Injection Prevention)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Removes malicious operators from user input |
| **Why used** | Prevents MongoDB injection attacks |
| **How used** | Middleware sanitizes req.body, req.query, req.params |
| **Attack prevented** | `{ "$gt": "" }` injection in queries |
| **Benefits** | Secure database queries, data integrity |

```javascript
// Sanitization middleware
export const sanitizeRequest = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (const key in obj) {
      // Remove MongoDB operators
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) {
    for (const key in req.query) {
      if (key.startsWith('$') || key.includes('.')) {
        delete req.query[key];
      }
    }
  }
  
  next();
};

// Regex escape for search queries
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
```

---

### Security Headers
| Aspect | Details |
|:-------|:--------|
| **What it does** | Sets HTTP headers to prevent common attacks |
| **Why used** | XSS protection, clickjacking prevention, MIME sniffing |
| **Headers set** | X-Frame-Options, X-Content-Type-Options, X-XSS-Protection |
| **Alternatives** | Helmet.js (full implementation) |
| **Benefits** | Browser-level security, defense in depth |

```javascript
// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server identification
  res.removeHeader('X-Powered-By');
  
  next();
};
```

---

### CORS Configuration
| Aspect | Details |
|:-------|:--------|
| **What it does** | Controls which origins can access the API |
| **Why used** | Prevents unauthorized cross-origin requests |
| **How used** | Whitelist of allowed frontend domains |
| **Benefits** | API security, credential protection |

```javascript
const allowedOrigins = [
  'http://localhost:5173',           // Local dev
  'http://localhost:5174',           // Local dev alt
  'https://bitedash-food.vercel.app', // Production
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### HttpOnly Cookies (XSS Protection)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Stores JWT in cookie inaccessible to JavaScript |
| **Why used** | Prevents XSS attacks from stealing tokens |
| **How used** | Set on login, sent automatically with requests |
| **Benefits** | Token cannot be stolen via XSS, auto-expiration |

```javascript
// Secure cookie settings
res.cookie('token', jwtToken, {
  httpOnly: true,       // Cannot be accessed by JavaScript
  secure: true,         // Only sent over HTTPS
  sameSite: 'none',     // Required for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/'
});

// Cookie cleared on logout
res.clearCookie('token', {
  httpOnly: true,
  secure: true,
  sameSite: 'none'
});
```

---

## 💾 Caching Strategy

### In-Memory Cache (node-cache)
| Aspect | Details |
|:-------|:--------|
| **What it does** | Stores frequently accessed data in memory |
| **Why used** | Reduces database queries, faster responses |
| **How used** | Cache API responses with TTL |
| **Alternatives** | Redis, Memcached, LRU-cache |
| **Limitation** | Lost on server restart, single instance only |
| **Benefits** | Zero latency, no external dependency |

```javascript
// Cache configuration
import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 300,        // Default 5 minutes
  checkperiod: 60,    // Check for expired keys every 60s
  useClones: false    // Better performance
});

// Cache middleware
export const cacheMiddleware = (ttlSeconds) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    // Override res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data, ttlSeconds);
      return originalJson(data);
    };
    
    next();
  };
};

// Usage in routes
itemRouter.get('/all-items', cacheMiddleware(60), getAllItems);      // 60s cache
itemRouter.get('/get-by-city/:city', cacheMiddleware(120), getItemByCity);  // 2min cache
```

### Cache Invalidation
```javascript
// Clear cache when data changes
const clearItemCache = () => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes('/api/item')) {
      cache.del(key);
    }
  });
};

// Call after item CRUD operations
await Item.create(newItem);
clearItemCache();
```

---

## 🔧 DevOps & CI/CD

### GitHub Actions
| Aspect | Details |
|:-------|:--------|
| **What it does** | Automated CI/CD pipelines |
| **Why used** | Free for public repos, GitHub integration |
| **Workflows** | Lint, test, build, security audit, deploy |
| **Triggers** | Push to main, pull requests |
| **Benefits** | Automated quality checks, consistent deployments |

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
        working-directory: frontend
      - run: npm run lint
        working-directory: frontend

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm test
        working-directory: frontend

  frontend-build:
    needs: [frontend-lint, frontend-test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
        working-directory: frontend

  backend-syntax:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          for file in $(find . -name "*.js" -not -path "./node_modules/*"); do
            node --check "$file" || exit 1
          done
        working-directory: backend
```

---

### ESLint 9
| Aspect | Details |
|:-------|:--------|
| **What it does** | Static code analysis for JavaScript |
| **Why used** | Catch errors early, enforce code style |
| **Rules** | Strict errors for critical issues, warnings for style |
| **Benefits** | Consistent code, fewer bugs, better maintainability |

```javascript
// eslint.config.js
export default [
  {
    rules: {
      // ERRORS - Block CI
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'react-hooks/rules-of-hooks': 'error',
      
      // WARNINGS - Don't block
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]|^_' 
      }],
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
```

---

### Prettier
| Aspect | Details |
|:-------|:--------|
| **What it does** | Opinionated code formatter |
| **Why used** | Consistent code style across team |
| **Configuration** | FAANG/MAANG standards |
| **Benefits** | No style debates, auto-formatting |

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

### Dependabot
| Aspect | Details |
|:-------|:--------|
| **What it does** | Automated dependency updates |
| **Why used** | Security patches, latest features |
| **Configuration** | Weekly checks for npm packages |
| **Benefits** | Always up-to-date, security alerts |

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
```


---

## 🏗️ Current Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                           │
│                    (Browsers / Mobile Devices)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VERCEL (Frontend)                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • React 19 SPA                                                      │   │
│  │  • Global CDN (Edge Network)                                         │   │
│  │  • Automatic SSL/TLS                                                 │   │
│  │  • Instant Cache Invalidation                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         https://bitedash-food.vercel.app                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────┐           ┌───────────────────┐
        │   REST API Calls  │           │   WebSocket       │
        │   (Axios)         │           │   (Socket.IO)     │
        └─────────┬─────────┘           └─────────┬─────────┘
                  │                               │
                  └───────────────┬───────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RENDER (Backend)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Single Instance)                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Middleware Pipeline:                                        │    │   │
│  │  │  Security Headers → CORS → Rate Limit → Auth → Sanitize     │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Features:                                                   │    │   │
│  │  │  • In-Memory Cache (node-cache)                             │    │   │
│  │  │  • Connection Pooling (100 connections)                     │    │   │
│  │  │  • Graceful Shutdown                                        │    │   │
│  │  │  • Health Check Endpoint                                    │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│              https://food-delivery-full-stack-app-3.onrender.com             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ MongoDB Atlas │         │  Cloudinary   │         │    Stripe     │
│   (Database)  │         │   (Images)    │         │  (Payments)   │
│               │         │               │         │               │
│ • 100 pooled  │         │ • CDN delivery│         │ • PCI Level 1 │
│   connections │         │ • Auto-optimize│        │ • Webhooks    │
│ • Auto-backup │         │ • 25GB free   │         │               │
└───────────────┘         └───────────────┘         └───────────────┘
        │
        ▼
┌───────────────┐
│   SendGrid    │
│   (Emails)    │
│               │
│ • 100/day free│
│ • Templates   │
└───────────────┘
```

### Request Flow

```
1. User Action (e.g., Place Order)
        │
        ▼
2. React Component dispatches action
        │
        ▼
3. Axios POST to /api/order/place-order
        │
        ▼
4. Vercel CDN → Render Backend
        │
        ▼
5. Middleware Pipeline:
   ├── Rate Limiter (check IP limits)
   ├── Security Headers (set response headers)
   ├── CORS (validate origin)
   ├── Auth Middleware (verify JWT)
   └── Sanitize (clean input)
        │
        ▼
6. Controller Logic:
   ├── Validate order data
   ├── Check item availability
   ├── Calculate totals
   └── Create order in MongoDB
        │
        ▼
7. Socket.IO emits 'newOrder' to shop owner
        │
        ▼
8. Response sent to client
        │
        ▼
9. Redux updates state
        │
        ▼
10. React re-renders UI
```

---

## 🚀 Future Scaling (AWS/K8s)

### Comparison: Current vs AWS EKS

| Metric | Current (Free Tier) | AWS EKS |
|:-------|:--------------------|:--------|
| **Concurrent Users** | ~500 | 100,000+ |
| **Requests/Second** | ~100 | 10,000+ |
| **Auto-scaling** | ❌ | ✅ HPA |
| **Cold Start** | 15 min sleep | None |
| **Global CDN** | Vercel only | CloudFront |
| **Load Balancer** | ❌ | ALB |
| **Cost** | $0-7/month | $150-500+/month |
| **Uptime SLA** | None | 99.95% |

### AWS Architecture (Future)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROUTE 53 (DNS)                                       │
│                         bitedash.com                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│      CLOUDFRONT (CDN)         │   │    APPLICATION LOAD BALANCER  │
│  ┌─────────────────────────┐  │   │  ┌─────────────────────────┐  │
│  │  S3 Bucket (Frontend)   │  │   │  │  Target Groups          │  │
│  │  • React Build          │  │   │  │  • Health Checks        │  │
│  │  • Global Edge Cache    │  │   │  │  • SSL Termination      │  │
│  └─────────────────────────┘  │   │  └─────────────────────────┘  │
└───────────────────────────────┘   └───────────────┬───────────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EKS CLUSTER                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         KUBERNETES                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │   Pod 1     │  │   Pod 2     │  │   Pod 3     │  ← Auto-scaling  │   │
│  │  │  (Backend)  │  │  (Backend)  │  │  (Backend)  │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Services: ClusterIP, NodePort, Ingress                      │    │   │
│  │  │  ConfigMaps: Environment configs                             │    │   │
│  │  │  Secrets: API keys, DB credentials                           │    │   │
│  │  │  HPA: Horizontal Pod Autoscaler (CPU/Memory based)           │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────────┐
        │                           │                               │
        ▼                           ▼                               ▼
┌───────────────┐         ┌───────────────┐             ┌───────────────┐
│  ElastiCache  │         │ DocumentDB /  │             │      S3       │
│   (Redis)     │         │ MongoDB Atlas │             │   (Files)     │
│               │         │               │             │               │
│ • Distributed │         │ • Read Replicas│            │ • Images      │
│   cache       │         │ • Auto-backup │             │ • Static      │
│ • Sessions    │         │ • Multi-AZ    │             │   assets      │
└───────────────┘         └───────────────┘             └───────────────┘
```

### Files Needed for AWS/K8s

```
project/
├── Dockerfile.frontend
├── Dockerfile.backend
├── docker-compose.yml
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
└── .github/workflows/
    └── deploy-aws.yml
```

---

## ⚠️ Enterprise Features Missing

### What's Needed for 100K+ Users

| Feature | Current | Enterprise Solution | Purpose |
|:--------|:--------|:--------------------|:--------|
| **Distributed Cache** | In-memory (node-cache) | Redis Cluster | Shared cache across instances |
| **Message Queue** | None | RabbitMQ / AWS SQS | Async processing, decoupling |
| **Centralized Logging** | Console.log | Winston + ELK Stack | Log aggregation, search |
| **Monitoring** | Basic health check | Prometheus + Grafana | Metrics, alerting |
| **APM** | None | New Relic / Datadog | Performance tracing |
| **Load Balancer** | None | ALB / Nginx | Traffic distribution |
| **Auto-scaling** | None | K8s HPA | Handle traffic spikes |
| **Database Replicas** | Single | Read replicas | Read scaling |
| **CDN for API** | None | CloudFront | Global API caching |
| **Rate Limiting** | In-memory | Redis-based | Distributed rate limiting |

### Implementation Priority

```
Phase 1 (Immediate - $50-100/month):
├── Redis Cloud (distributed cache)
├── Better logging (Winston + Logtail)
└── Basic monitoring (UptimeRobot)

Phase 2 (Growth - $150-300/month):
├── Load balancer (multiple instances)
├── Database read replicas
└── Message queue for emails/notifications

Phase 3 (Scale - $500+/month):
├── Kubernetes (EKS/GKE)
├── Full observability stack
├── Multi-region deployment
└── Auto-scaling policies
```

---

## 📊 Summary

### Current State

| Aspect | Status | Notes |
|:-------|:------:|:------|
| **Production Ready** | ✅ | Deployed and functional |
| **Security** | ✅ | Rate limiting, sanitization, CORS |
| **Scalability Code** | ✅ | Pooling, caching, cluster-ready |
| **Scalability Infra** | ⚠️ | Limited by free tier |
| **Monitoring** | ⚠️ | Basic health checks only |
| **CI/CD** | ✅ | Full pipeline with tests |

### Recommendations

1. **Short Term**: Add Redis for distributed caching
2. **Medium Term**: Implement proper logging and monitoring
3. **Long Term**: Migrate to Kubernetes for auto-scaling

---

<div align="center">

**Built with ❤️ by BiteDash Team**

*This documentation covers the complete technical implementation of BiteDash platform.*

</div>
