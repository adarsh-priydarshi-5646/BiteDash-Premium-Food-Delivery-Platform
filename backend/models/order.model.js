/**
 * Order Model - Multi-shop order with delivery tracking & payment
 *
 * Structure: Main order → shopOrders[] (one per restaurant) → items[]
 * Fields: user, totalAmount, paymentMethod (COD/Stripe), deliveryAddress,
 * shopOrders[] {shop, items[], deliveryBoy, status, otp, rating}
 * 
 * Libraries: mongoose
 * Status flow: pending → accepted → preparing → ready → out for delivery → delivered
 * Features: Multi-shop orders, delivery OTP verification, per-shop ratings
 * Payment: COD or Stripe checkout session
 */
import mongoose from 'mongoose';

const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true },
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subtotal: Number,
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'preparing', 'out of delivery', 'delivered'],
      default: 'pending',
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryAssignment',
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deliveryOtp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      required: true,
    },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
    },
    shopOrders: [shopOrderSchema],
    payment: {
      type: Boolean,
      default: false,
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    stripeSessionId: {
      type: String,
      default: '',
    },
    stripePaymentIntentId: {
      type: String,
      default: '',
    },
    orderRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      review: {
        type: String,
        default: '',
      },
      ratedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
