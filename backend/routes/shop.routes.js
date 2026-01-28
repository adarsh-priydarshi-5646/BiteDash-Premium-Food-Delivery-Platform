/**
 * Shop Routes - Restaurant/Shop CRUD with city-based filtering
 *
 * Endpoints: /create-edit, /my-shop, /city/:city
 * Features: In-memory caching for city shops (10 min TTL), Multer image upload
 * Protected routes for create/edit, public city endpoint with cache
 */
import express from 'express';
import {
  createEditShop,
  getMyShop,
  getShopByCity,
} from '../controllers/shop.controllers.js';
import isAuth from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { cacheMiddleware } from '../config/cache.js';

const shopRouter = express.Router();

shopRouter.post('/create-edit', isAuth, upload.single('image'), createEditShop);
shopRouter.get('/get-my', isAuth, getMyShop);
shopRouter.get(
  '/get-by-city/:city',
  isAuth,
  cacheMiddleware(600),
  getShopByCity,
);

export default shopRouter;
