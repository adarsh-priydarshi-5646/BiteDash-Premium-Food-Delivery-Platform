/**
 * archData.js - Single source of truth for the interactive System Design viewer.
 * Derived from the actual BiteDash codebase (backend/ + frontend/).
 */

// ---------------------------------------------------------------------------
// HLD: layered system diagram (Client -> Edge -> Application -> Data/External)
// ---------------------------------------------------------------------------
export const layers = [
  {
    id: 'client',
    name: 'Client Layer',
    nodes: [
      {
        id: 'react-spa',
        name: 'React 19 SPA',
        tech: 'Vite · React Router 7 · Redux Toolkit · Tailwind v4',
        role: 'Single-page app serving 3 roles: Customer, Shop Owner, Delivery Partner',
        details: [
          'Lazy-loaded routes with React.lazy + Suspense for code splitting',
          'Role-based dashboards rendered from one Home route (UserDashboard / OwnerDashboard / DeliveryBoy)',
          'Redux store: userSlice (auth, cart, socket), ownerSlice (shop, items), mapSlice (live tracking)',
          'Cart persisted to localStorage and re-hydrated on boot',
          'Leaflet + react-leaflet renders live delivery tracking maps',
          'Axios with withCredentials:true so the JWT cookie rides on every call',
        ],
        connectsTo: ['alb'],
      },
      {
        id: 'socket-client',
        name: 'Socket.IO Client',
        tech: 'socket.io-client 4 · WebSocket + polling fallback',
        role: 'Persistent duplex channel for live order + location updates',
        details: [
          'Connects only after the user is authenticated',
          "Emits 'identity' with userId on connect to register the socket",
          "Delivery partners emit 'updateLocation' with GPS coords",
          "Listens for 'newOrder', 'orderStatusUpdate', 'updateDeliveryLocation', 'newDeliveryAssignment'",
          'Auto-reconnect: 5 attempts, 1s → 5s backoff',
        ],
        connectsTo: ['socket-server'],
      },
    ],
  },
  {
    id: 'edge',
    name: 'Edge / Load Balancing',
    nodes: [
      {
        id: 'alb',
        name: 'AWS Application Load Balancer',
        tech: 'AWS ALB (us-east-1)',
        role: 'Terminates traffic and routes HTTP + WebSocket upgrade requests to backend',
        details: [
          'Production frontend points at bitedash-alb-*.us-east-1.elb.amazonaws.com',
          'Sticky sessions recommended for Socket.IO long-polling fallback',
          'Health checks against Express /health-style endpoints',
        ],
        connectsTo: ['express'],
      },
    ],
  },
  {
    id: 'app',
    name: 'Application Layer (Node.js Monolith)',
    nodes: [
      {
        id: 'express',
        name: 'Express API Server',
        tech: 'Node.js · Express · port 8000',
        role: 'REST API: 5 routers → 5 controllers → services → Mongoose models',
        details: [
          'Middleware pipeline: security headers → compression → CORS(credentials) → cookie-parser → rate limiters → isAuth(JWT) → cache → multer upload',
          'Routers: /api/auth, /api/user, /api/shop, /api/item, /api/order',
          'Route-level rate limits: authRateLimiter on auth endpoints, orderRateLimiter on place-order',
          'In-memory response cache (cacheMiddleware) with 60–120s TTLs on hot read paths',
          'Central errorHandler util normalizes error responses; logger util for structured logs',
        ],
        connectsTo: ['mongodb', 'stripe', 'cloudinary', 'mail', 'delivery-service'],
      },
      {
        id: 'socket-server',
        name: 'Socket.IO Server',
        tech: 'socket.io attached to the same HTTP server',
        role: 'Real-time fan-out: order events, delivery GPS stream, assignment broadcasts',
        details: [
          "'identity' → stores socketId + isOnline:true on the User document",
          "'updateLocation' → updates User.location (GeoJSON Point) and broadcasts 'updateDeliveryLocation' to trackers",
          "'disconnect' → clears socketId, marks user offline",
          'Server-side emits target specific socketIds looked up from MongoDB',
        ],
        connectsTo: ['mongodb'],
      },
      {
        id: 'delivery-service',
        name: 'Delivery Assignment Engine',
        tech: 'services/delivery.service.js',
        role: 'Geo-matches orders to nearby online delivery partners (broadcast + FCFS accept)',
        details: [
          'On order "out of delivery": $near geo-query finds online deliveryBoy users within radius of the shop',
          'Creates a DeliveryAssignment (status: broadcasted) listing candidate partners',
          "Emits 'newDeliveryAssignment' to each candidate's socketId",
          'First partner to hit /accept-order/:assignmentId wins — atomic status check prevents double-assignment',
          'OTP handover: sendDeliveryOtp emails the customer; verifyDeliveryOtp completes delivery',
        ],
        connectsTo: ['mongodb', 'mail'],
      },
    ],
  },
  {
    id: 'data',
    name: 'Data & External Services',
    nodes: [
      {
        id: 'mongodb',
        name: 'MongoDB',
        tech: 'Mongoose ODM · 5 collections',
        role: 'Primary datastore: users, shops, items, orders, deliveryassignments',
        details: [
          '2dsphere geo-indexes on User.location and Shop.location power $near queries',
          'Orders embed per-shop sub-orders (shopOrders[]) so one checkout can span shops',
          'Indexes on city, shop, category for browse queries (config/indexes.js)',
          'DB connection managed in config/db.js',
        ],
        connectsTo: [],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        tech: 'Checkout Sessions · @stripe/react-stripe-js',
        role: 'Online payment processing',
        details: [
          'Backend creates a Checkout Session; client redirects to Stripe-hosted page',
          '/verify-stripe-payment confirms session status before marking order paid',
          'Cash-on-delivery supported as the alternate payment path',
        ],
        connectsTo: [],
      },
      {
        id: 'cloudinary',
        name: 'Cloudinary',
        tech: 'utils/cloudinary.js · multer memory upload',
        role: 'Image CDN for shop and food item photos',
        details: [
          'multer (upload.middleware) buffers the file, cloudinary util streams it up',
          'Only the secure_url is persisted on Shop/Item documents',
        ],
        connectsTo: [],
      },
      {
        id: 'mail',
        name: 'Email Providers',
        tech: 'Nodemailer · Resend · SendGrid (fallback chain)',
        role: 'OTP delivery: password reset + delivery-confirmation OTPs',
        details: [
          'Three mail utils (mail.js, resendMail.js, sendgridMail.js) provide provider redundancy',
          'OTPs stored on the User / Order documents with expiry timestamps',
        ],
        connectsTo: [],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Data models (ER)
// ---------------------------------------------------------------------------
export const models = [
  {
    name: 'User',
    collection: 'users',
    color: '#E23744',
    fields: [
      { name: '_id', type: 'ObjectId', note: 'PK' },
      { name: 'fullName / email / mobile', type: 'String', note: 'email unique' },
      { name: 'password', type: 'String (bcrypt)', note: 'omitted for Google auth' },
      { name: 'role', type: 'enum', note: 'user · owner · deliveryBoy' },
      { name: 'location', type: 'GeoJSON Point', note: '2dsphere index' },
      { name: 'addresses[]', type: 'subdocs', note: 'saved delivery addresses' },
      { name: 'bankDetails', type: 'subdoc', note: 'owner/delivery payouts' },
      { name: 'socketId / isOnline', type: 'String / Bool', note: 'realtime presence' },
      { name: 'resetOtp / otpExpires', type: 'String / Date', note: 'password reset' },
    ],
    relations: ['Owns Shop (1:1 via Shop.owner)', 'Places Order (1:N)', 'Assigned in DeliveryAssignment'],
  },
  {
    name: 'Shop',
    collection: 'shops',
    color: '#10b981',
    fields: [
      { name: '_id', type: 'ObjectId', note: 'PK' },
      { name: 'name / image / city / state / address', type: 'String', note: 'city indexed' },
      { name: 'owner', type: 'ObjectId → User', note: 'FK' },
      { name: 'items[]', type: '[ObjectId → Item]', note: 'catalog refs' },
      { name: 'location', type: 'GeoJSON Point', note: '2dsphere index' },
    ],
    relations: ['Belongs to User (owner)', 'Has many Items', 'Referenced by Order.shopOrders.shop'],
  },
  {
    name: 'Item',
    collection: 'items',
    color: '#f59e0b',
    fields: [
      { name: '_id', type: 'ObjectId', note: 'PK' },
      { name: 'name / image / price', type: 'String / Number', note: '' },
      { name: 'category', type: 'enum', note: 'indexed for browse' },
      { name: 'foodType', type: 'enum', note: 'veg · non veg' },
      { name: 'shop', type: 'ObjectId → Shop', note: 'FK' },
      { name: 'rating', type: '{ average, count }', note: 'denormalized aggregate' },
    ],
    relations: ['Belongs to Shop', 'Snapshotted into Order.shopOrders.shopOrderItems'],
  },
  {
    name: 'Order',
    collection: 'orders',
    color: '#3b82f6',
    fields: [
      { name: '_id', type: 'ObjectId', note: 'PK' },
      { name: 'user', type: 'ObjectId → User', note: 'FK (customer)' },
      { name: 'paymentMethod', type: 'enum', note: 'cod · online (Stripe)' },
      { name: 'deliveryAddress', type: '{ text, latitude, longitude }', note: '' },
      { name: 'totalAmount / payment', type: 'Number / Bool', note: '' },
      { name: 'shopOrders[]', type: 'embedded subdocs', note: 'one per shop in cart' },
      { name: '↳ shop / owner', type: 'ObjectId refs', note: 'per-shop routing' },
      { name: '↳ status', type: 'enum', note: 'pending → preparing → out of delivery → delivered' },
      { name: '↳ assignedDeliveryBoy', type: 'ObjectId → User', note: '' },
      { name: '↳ deliveryOtp / otpExpires', type: 'String / Date', note: 'handover proof' },
      { name: '↳ shopOrderItems[]', type: 'price-snapshot subdocs', note: 'immutable at purchase' },
    ],
    relations: ['Belongs to User', 'Embeds ShopOrders (1:N per shop)', 'Linked from DeliveryAssignment'],
  },
  {
    name: 'DeliveryAssignment',
    collection: 'deliveryassignments',
    color: '#8b5cf6',
    fields: [
      { name: '_id', type: 'ObjectId', note: 'PK' },
      { name: 'order / shop', type: 'ObjectId refs', note: 'FK' },
      { name: 'shopOrderId', type: 'ObjectId', note: 'points into Order.shopOrders' },
      { name: 'broadcastedTo[]', type: '[ObjectId → User]', note: 'candidate partners' },
      { name: 'assignedTo', type: 'ObjectId → User', note: 'winner (FCFS)' },
      { name: 'status', type: 'enum', note: 'broadcasted → assigned → completed' },
      { name: 'acceptedAt', type: 'Date', note: '' },
    ],
    relations: ['References Order + Shop', 'Broadcast to many Users (deliveryBoy)', 'Assigned to one User'],
  },
];

// ---------------------------------------------------------------------------
// API surface (from backend/routes/*.js)
// ---------------------------------------------------------------------------
export const apiGroups = [
  {
    name: 'Auth',
    base: '/api/auth',
    file: 'auth.routes.js → auth.controllers.js',
    endpoints: [
      { method: 'POST', path: '/signup', auth: false, notes: 'authRateLimiter · bcrypt hash · sets JWT cookie' },
      { method: 'POST', path: '/signin', auth: false, notes: 'authRateLimiter · credential check' },
      { method: 'GET', path: '/signout', auth: false, notes: 'clears JWT cookie' },
      { method: 'POST', path: '/send-otp', auth: false, notes: 'password-reset OTP via mail chain' },
      { method: 'POST', path: '/verify-otp', auth: false, notes: 'validates OTP + expiry' },
      { method: 'POST', path: '/reset-password', auth: false, notes: 'rehash + clear OTP' },
      { method: 'POST', path: '/google-auth', auth: false, notes: 'Google OAuth sign-in/up' },
    ],
  },
  {
    name: 'User',
    base: '/api/user',
    file: 'user.routes.js → user.controllers.js',
    endpoints: [
      { method: 'GET', path: '/current', auth: true, notes: 'session bootstrap for the SPA' },
      { method: 'POST', path: '/update-location', auth: true, notes: 'writes GeoJSON Point' },
      { method: 'POST', path: '/update-bank-details', auth: true, notes: 'owner / delivery payouts' },
      { method: 'GET', path: '/get-bank-details', auth: true, notes: '' },
      { method: 'POST', path: '/add-address', auth: true, notes: 'saved addresses' },
      { method: 'PUT', path: '/update-address', auth: true, notes: '' },
      { method: 'DELETE', path: '/remove-address/:addressId', auth: true, notes: '' },
      { method: 'PUT', path: '/update-profile', auth: true, notes: '' },
      { method: 'GET', path: '/profile-stats', auth: true, notes: 'aggregated order stats' },
    ],
  },
  {
    name: 'Shop',
    base: '/api/shop',
    file: 'shop.routes.js → shop.controllers.js',
    endpoints: [
      { method: 'POST', path: '/create-edit', auth: true, notes: 'multer image → Cloudinary' },
      { method: 'GET', path: '/get-my', auth: true, notes: "owner's shop" },
      { method: 'GET', path: '/get-by-city/:city', auth: true, notes: 'cached city browse' },
    ],
  },
  {
    name: 'Item',
    base: '/api/item',
    file: 'item.routes.js → item.controllers.js',
    endpoints: [
      { method: 'GET', path: '/all-items', auth: false, notes: 'cacheMiddleware(60s)' },
      { method: 'POST', path: '/add-item', auth: true, notes: 'multer image → Cloudinary' },
      { method: 'POST', path: '/edit-item/:itemId', auth: true, notes: '' },
      { method: 'GET', path: '/delete/:itemId', auth: true, notes: '' },
      { method: 'POST', path: '/rating', auth: true, notes: 'updates denormalized average' },
      { method: 'GET', path: '/get-by-id/:itemId', auth: true, notes: 'cacheMiddleware(120s)' },
      { method: 'GET', path: '/get-by-city/:city', auth: true, notes: 'city feed' },
      { method: 'GET', path: '/get-by-shop/:shopId', auth: true, notes: 'shop menu' },
      { method: 'GET', path: '/search-items', auth: true, notes: 'query + filters' },
    ],
  },
  {
    name: 'Order',
    base: '/api/order',
    file: 'order.routes.js → order.controllers.js',
    endpoints: [
      { method: 'POST', path: '/place-order', auth: true, notes: 'orderRateLimiter · splits cart into shopOrders' },
      { method: 'POST', path: '/create-checkout-session', auth: true, notes: 'Stripe Checkout Session' },
      { method: 'POST', path: '/verify-stripe-payment', auth: true, notes: 'confirms session, marks paid' },
      { method: 'GET', path: '/my-orders', auth: true, notes: 'role-aware: customer or owner view' },
      { method: 'POST', path: '/update-status/:orderId/:shopId', auth: true, notes: 'owner advances status · triggers delivery broadcast' },
      { method: 'GET', path: '/get-assignments', auth: true, notes: 'delivery partner inbox' },
      { method: 'GET', path: '/accept-order/:assignmentId', auth: true, notes: 'FCFS claim — atomic guard' },
      { method: 'GET', path: '/get-current-order', auth: true, notes: 'active delivery for partner' },
      { method: 'POST', path: '/send-delivery-otp', auth: true, notes: 'emails customer the handover OTP' },
      { method: 'POST', path: '/verify-delivery-otp', auth: true, notes: 'completes delivery' },
      { method: 'GET', path: '/get-order-by-id/:orderId', auth: true, notes: 'tracking page payload' },
      { method: 'GET', path: '/get-today-deliveries', auth: true, notes: 'partner earnings today' },
      { method: 'POST', path: '/cancel-order', auth: true, notes: '' },
      { method: 'DELETE', path: '/delete-order/:orderId', auth: true, notes: '' },
      { method: 'POST', path: '/rate-order/:orderId', auth: true, notes: '' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Socket.IO event protocol
// ---------------------------------------------------------------------------
export const socketEvents = [
  { name: 'identity', dir: 'client → server', payload: '{ userId }', desc: 'Registers socketId on the User doc, marks online' },
  { name: 'updateLocation', dir: 'client → server', payload: '{ latitude, longitude, userId }', desc: 'Delivery partner GPS ping → updates GeoJSON location' },
  { name: 'updateDeliveryLocation', dir: 'server → client', payload: '{ deliveryBoyId, latitude, longitude }', desc: 'Live position pushed to customers tracking an order' },
  { name: 'newDeliveryAssignment', dir: 'server → client', payload: 'assignment summary', desc: 'Broadcast to nearby online partners when order is ready' },
  { name: 'newOrder', dir: 'server → client', payload: 'shopOrder payload', desc: 'Notifies shop owner dashboard instantly' },
  { name: 'orderStatusUpdate', dir: 'server → client', payload: '{ orderId, shopId, status }', desc: 'Customer order timeline updates in real time' },
  { name: 'disconnect', dir: 'client → server', payload: '—', desc: 'Clears socketId, marks user offline' },
];

// ---------------------------------------------------------------------------
// Key end-to-end flows (LLD sequences)
// ---------------------------------------------------------------------------
export const flows = [
  {
    id: 'order',
    name: 'Order Lifecycle',
    summary: 'Cart checkout to doorstep, spanning customer, owner, and delivery partner.',
    steps: [
      { actor: 'Customer', action: 'Builds cart (Redux + localStorage), picks address, chooses COD or Stripe' },
      { actor: 'React SPA', action: 'POST /api/order/place-order — cart is split into one shopOrder per shop' },
      { actor: 'Express', action: 'Validates, computes totals server-side, persists Order with embedded shopOrders[]' },
      { actor: 'Socket.IO', action: "Emits 'newOrder' to each shop owner's socketId" },
      { actor: 'Owner', action: 'Advances status: pending → preparing → out of delivery via /update-status' },
      { actor: 'Delivery Engine', action: '$near geo-query finds online partners near the shop → creates DeliveryAssignment → broadcasts' },
      { actor: 'Partner', action: 'First to GET /accept-order/:assignmentId claims it (atomic status check)' },
      { actor: 'Socket.IO', action: "GPS pings stream 'updateDeliveryLocation' to the customer's Leaflet map" },
      { actor: 'Partner + Customer', action: 'OTP emailed to customer → partner enters it → /verify-delivery-otp → status: delivered' },
    ],
  },
  {
    id: 'payment',
    name: 'Stripe Payment',
    summary: 'Hosted Checkout Session with server-side verification.',
    steps: [
      { actor: 'Customer', action: 'Selects "online" at checkout' },
      { actor: 'React SPA', action: 'POST /api/order/create-checkout-session' },
      { actor: 'Express', action: 'Creates Stripe Checkout Session with order line items, returns session URL' },
      { actor: 'Customer', action: 'Redirected to Stripe-hosted payment page, completes card payment' },
      { actor: 'Stripe', action: 'Redirects back to /order-placed with session id' },
      { actor: 'React SPA', action: 'POST /api/order/verify-stripe-payment with the session id' },
      { actor: 'Express', action: 'Retrieves session from Stripe API — only marks Order.payment=true if status is paid' },
    ],
  },
  {
    id: 'auth',
    name: 'Authentication',
    summary: 'JWT-in-httpOnly-cookie sessions with OTP password reset and Google OAuth.',
    steps: [
      { actor: 'User', action: 'Signs up / signs in (or Google OAuth via /google-auth)' },
      { actor: 'Express', action: 'bcrypt-verifies password → utils/token.js signs a JWT' },
      { actor: 'Express', action: 'JWT set as httpOnly cookie (XSS-safe) — never exposed to JS' },
      { actor: 'React SPA', action: 'On boot, GET /api/user/current hydrates Redux userSlice' },
      { actor: 'isAuth middleware', action: 'Every protected route verifies the cookie JWT and attaches userId to req' },
      { actor: 'Forgot password', action: 'send-otp → email OTP (Nodemailer/Resend/SendGrid) → verify-otp → reset-password' },
    ],
  },
  {
    id: 'assignment',
    name: 'Delivery Assignment (Geo-Broadcast + FCFS)',
    summary: 'How an order finds its delivery partner.',
    steps: [
      { actor: 'Owner', action: 'Marks shopOrder "out of delivery"' },
      { actor: 'Delivery Engine', action: 'MongoDB $near query on User.location (2dsphere): role=deliveryBoy, isOnline=true, within radius of shop' },
      { actor: 'Delivery Engine', action: 'Creates DeliveryAssignment{ status: broadcasted, broadcastedTo: [candidates] }' },
      { actor: 'Socket.IO', action: "Pushes 'newDeliveryAssignment' to every candidate's socketId" },
      { actor: 'Partners', action: 'See the offer in their dashboard inbox (GET /get-assignments)' },
      { actor: 'Race guard', action: 'accept-order checks status === "broadcasted" before assigning — second click gets rejected' },
      { actor: 'System', action: 'Assignment → assigned; shopOrder.assignedDeliveryBoy set; customer sees partner on map' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Middleware pipeline (request lifecycle)
// ---------------------------------------------------------------------------
export const middlewarePipeline = [
  { name: 'security.middleware', desc: 'Security headers (helmet-style hardening)' },
  { name: 'compression.middleware', desc: 'gzip response compression' },
  { name: 'CORS + cookie-parser', desc: 'credentials:true CORS, parses JWT cookie' },
  { name: 'rateLimit.middleware', desc: 'authRateLimiter / orderRateLimiter on sensitive routes' },
  { name: 'isAuth (auth.middleware)', desc: 'Verifies JWT from httpOnly cookie → req.userId' },
  { name: 'cache.middleware', desc: 'In-memory response cache, 60–120s TTL on hot reads' },
  { name: 'upload.middleware (multer)', desc: 'Buffers multipart images before Cloudinary upload' },
  { name: 'Controller → Service → Model', desc: 'Business logic, then Mongoose persistence' },
  { name: 'errorHandler util', desc: 'Central error normalization + logger' },
];

// ---------------------------------------------------------------------------
// HLD overview facts
// ---------------------------------------------------------------------------
export const nfrs = [
  { name: 'Security', items: ['JWT in httpOnly cookies (XSS-safe)', 'bcrypt password hashing', 'Route-level rate limiting', 'Server-side price computation', 'Input sanitization utils'] },
  { name: 'Performance', items: ['Route-level code splitting (React.lazy)', 'In-memory API cache (60–120s TTL)', 'gzip compression', 'MongoDB indexes: city, category, 2dsphere geo', 'Denormalized item ratings'] },
  { name: 'Scalability', items: ['Stateless REST — horizontal scale behind ALB', 'Socket state persisted in MongoDB (socketId per user)', 'Embedded shopOrders avoid checkout-time joins', 'Cloudinary offloads media bandwidth'] },
  { name: 'Reliability', items: ['3-provider email fallback chain', 'Socket auto-reconnect with backoff', 'Atomic FCFS guard on delivery assignment', 'Payment verified server-side, never trusted from client'] },
];

export const techStack = [
  { layer: 'Frontend', items: 'React 19 · Vite · Redux Toolkit · React Router 7 · Tailwind CSS v4 · Framer Motion · Leaflet · Recharts' },
  { layer: 'Backend', items: 'Node.js · Express · Socket.IO · Mongoose · Multer · JWT · bcrypt' },
  { layer: 'Data', items: 'MongoDB (5 collections, 2dsphere geo-indexes) · in-memory cache' },
  { layer: 'External', items: 'Stripe Checkout · Cloudinary · Nodemailer / Resend / SendGrid · Google OAuth' },
  { layer: 'Infra', items: 'AWS ALB · Docker Compose · Vite static build' },
];

export const tradeoffs = [
  { decision: 'Monolith over microservices', why: 'One Express app is simpler to deploy and debug at this scale; clean router/controller/service layering keeps a future split cheap.' },
  { decision: 'Embedded shopOrders in Order', why: 'One checkout can span multiple shops; embedding gives atomic writes and join-free reads, at the cost of document growth.' },
  { decision: 'Broadcast + FCFS assignment', why: 'Simpler than an optimizing dispatcher; latency-optimal for partners who are actually watching, with an atomic guard against double-claims.' },
  { decision: 'JWT cookie over token-in-header', why: 'httpOnly cookie removes XSS token theft; costs CSRF care and CORS credentials config.' },
  { decision: 'In-memory cache over Redis', why: 'Zero-dependency speed win for hot reads; must move to Redis when scaling past one instance.' },
];
