/**
 * Database Indexes Configuration
 * Optimizes query performance for frequently accessed fields
 */

import User from '../models/user.model.js';
import Shop from '../models/shop.model.js';
import Item from '../models/item.model.js';
import Order from '../models/order.model.js';

export const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });

    // Shop indexes
    await Shop.collection.createIndex({ owner: 1 });
    await Shop.collection.createIndex({ city: 1 });
    await Shop.collection.createIndex({ isOpen: 1 });
    await Shop.collection.createIndex({ city: 1, isOpen: 1 }); // Compound index for filtering
    await Shop.collection.createIndex({ rating: -1 }); // For sorting by rating

    // Item indexes
    await Item.collection.createIndex({ shop: 1 });
    await Item.collection.createIndex({ category: 1 });
    await Item.collection.createIndex({ city: 1 });
    await Item.collection.createIndex({ city: 1, category: 1 }); // Compound index
    await Item.collection.createIndex({ isAvailable: 1 });
    await Item.collection.createIndex({ price: 1 }); // For price sorting

    // Order indexes
    await Order.collection.createIndex({ user: 1 });
    await Order.collection.createIndex({ shop: 1 });
    await Order.collection.createIndex({ deliveryBoy: 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ user: 1, createdAt: -1 }); // User's recent orders
    await Order.collection.createIndex({ shop: 1, status: 1 }); // Shop's pending orders
    await Order.collection.createIndex({ deliveryBoy: 1, status: 1 }); // Delivery boy's active orders
    await Order.collection.createIndex({ createdAt: -1 }); // Recent orders

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};
