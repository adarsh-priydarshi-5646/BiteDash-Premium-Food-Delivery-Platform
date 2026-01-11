/**
 * Item Model - Food menu item with pricing, category & rating system
 *
 * Fields: name, image, category, foodType (veg/non-veg), price, shop reference
 * Features: Embedded rating object with count & average for 5-star system
 * Linked to Shop model, supports Cloudinary image URLs
 */
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    category: {
      type: String,
      enum: [
        'Snacks',
        'Main Course',
        'Desserts',
        'Pizza',
        'Burgers',
        'Sandwiches',
        'South Indian',
        'North Indian',
        'Chinese',
        'Fast Food',
        'Others',
      ],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    foodType: {
      type: String,
      enum: ['veg', 'non veg'],
      required: true,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
