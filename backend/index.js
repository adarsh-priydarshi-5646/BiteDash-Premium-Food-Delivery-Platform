import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";

// Middlewares
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { securityHeaders, sanitizeRequest } from "./middlewares/security.js";
import { socketHandler } from "./socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://food-delivery-full-stack-app-me1o.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Socket.IO with optimized settings
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["POST", "GET"],
  },
  // Performance optimizations
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
});

app.set("io", io);

const port = process.env.PORT || 5000;

// ============ MIDDLEWARE STACK (Order matters!) ============

// 1. Security headers first
app.use(securityHeaders);

// 2. CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 3. Trust proxy (for rate limiting behind load balancer)
app.set('trust proxy', 1);

// 4. Rate limiting (before parsing body)
app.use(rateLimiter);

// 5. Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 6. Request sanitization
app.use(sanitizeRequest);

// 7. Static files
app.use(express.static(path.join(__dirname, "public")));

// 8. API headers
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  next();
});

// ============ ROUTES ============
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid,
  });
});

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ============ SERVER START ============
socketHandler(io);

server.listen(port, () => {
  connectDb();
  console.log(`Server started on port ${port} | Mode: ${process.env.NODE_ENV || 'development'} | PID: ${process.pid}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
