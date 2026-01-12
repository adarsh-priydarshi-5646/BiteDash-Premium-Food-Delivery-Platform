/**
 * Item Model - Food menu item with pricing, category & rating
 *
 * Fields: name, image (Cloudinary URL), category, foodType (veg/non-veg),
 * price, description, shop (Shop ref), rating {count, average}
 * 
 * Libraries: mongoose
 * Relationships: Many-to-one with Shop
 * Features: 5-star rating system, category/foodType filtering, text search
 * Indexes: shop, category, name (text index for search)
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
  { timestamps: true },
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
