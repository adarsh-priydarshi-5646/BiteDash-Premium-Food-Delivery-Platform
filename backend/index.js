/**
 * Express Server - Main application entry point
 *
 * Features: REST API routes, Socket.IO real-time updates, JWT auth,
 * Security middlewares (helmet, CORS, rate limiting), Gzip compression,
 * Multer file uploads, MongoDB connection, graceful shutdown
 * 
 * Libraries: express, socket.io, mongoose, dotenv, cors, cookie-parser,
 * helmet, compression, multer
 * 
 * Routes: /api/auth, /api/user, /api/shop, /api/item, /api/order, /health
 * Port: 8000 (configurable via PORT env)
 */
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import { createIndexes } from './config/indexes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import itemRouter from './routes/item.routes.js';
import shopRouter from './routes/shop.routes.js';
import orderRouter from './routes/order.routes.js';
import passport from './config/passport.js';

import { rateLimiter } from './middlewares/rateLimit.middleware.js';
import {
  securityHeaders,
  sanitizeRequest,
} from './middlewares/security.middleware.js';
import { socketHandler } from './socket.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'X-RateLimit-Remaining'],
  maxAge: 86400,
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['POST', 'GET'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

app.set('io', io);

const port = process.env.PORT || 5000;

app.use(securityHeaders);

app.use(cors(corsOptions));

app.set('trust proxy', 1);
app.use(rateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(sanitizeRequest);
app.use(logger.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/shop', shopRouter);
app.use('/api/item', itemRouter);
app.use('/api/order', orderRouter);

app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid,
    version: '1.0.0',
  };

  // Check database connection
  try {
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState === 1) {
      health.database = 'connected';
    } else {
      health.database = 'disconnected';
      health.status = 'degraded';
    }
  } catch (error) {
    health.database = 'error';
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

socketHandler(io);

server.listen(port, () => {
  connectDb();
  createIndexes(); // Create database indexes on startup
  logger.info('Server started', {
    port,
    mode: process.env.NODE_ENV || 'development',
    pid: process.pid,
  });
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
