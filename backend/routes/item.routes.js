/**
 * Item Routes - Food menu item CRUD, search & rating endpoints
 *
 * Endpoints: /add, /edit/:itemId, /delete/:itemId, /:itemId, /city/:city, /search, /rating
 * Features: In-memory caching for city items, rate-limited search, Multer file upload
 * Protected routes require JWT auth, search supports query + city filtering
 */
import express from 'express';
import isAuth from '../middlewares/auth.middleware.js';
import { cacheMiddleware } from '../config/cache.js';
import { searchRateLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  addItem,
  deleteItem,
  editItem,
  getItemByCity,
  getItemById,
  getItemsByShop,
  rating,
  searchItems,
} from '../controllers/item.controllers.js';
import { upload } from '../middlewares/upload.middleware.js';

const itemRouter = express.Router();

itemRouter.post('/add-item', isAuth, upload.single('image'), addItem);
itemRouter.post('/edit-item/:itemId', isAuth, upload.single('image'), editItem);
itemRouter.get('/delete/:itemId', isAuth, deleteItem);
itemRouter.post('/rating', isAuth, rating);

itemRouter.get('/get-by-id/:itemId', isAuth, cacheMiddleware(120), getItemById);
itemRouter.get(
  '/get-by-city/:city',
  isAuth,
  cacheMiddleware(60),
  getItemByCity,
);
itemRouter.get(
  '/get-by-shop/:shopId',
  isAuth,
  cacheMiddleware(60),
  getItemsByShop,
);
itemRouter.get(
  '/search-items',
  isAuth,
  searchRateLimiter,
  cacheMiddleware(30),
  searchItems,
);

export default itemRouter;
