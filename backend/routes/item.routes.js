import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { cacheMiddleware } from "../config/cache.js";
import { searchRateLimiter } from "../middlewares/rateLimiter.js";
import {
  addItem,
  deleteItem,
  editItem,
  getItemByCity,
  getItemById,
  getItemsByShop,
  rating,
  searchItems,
} from "../controllers/item.controllers.js";
import { upload } from "../middlewares/multer.js";

const itemRouter = express.Router();

// Write operations (no cache)
itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);
itemRouter.post("/rating", isAuth, rating);

// Read operations (with cache for performance)
itemRouter.get("/get-by-id/:itemId", isAuth, cacheMiddleware(120), getItemById);
itemRouter.get("/get-by-city/:city", isAuth, cacheMiddleware(60), getItemByCity);
itemRouter.get("/get-by-shop/:shopId", isAuth, cacheMiddleware(60), getItemsByShop);
itemRouter.get("/search-items", isAuth, searchRateLimiter, cacheMiddleware(30), searchItems);

export default itemRouter;
