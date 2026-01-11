/**
 * Order Routes - Complete order lifecycle, delivery & payment endpoints
 *
 * Endpoints: /place, /my-orders, /update-status, /accept, /current, /stripe-payment, etc.
 * Features: COD & Stripe payments, delivery boy assignment, OTP verification, order rating
 * All routes protected, supports user/owner/deliveryBoy role-based access
 */
import express from 'express';
import isAuth from '../middlewares/auth.middleware.js';
import { orderRateLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  acceptOrder,
  getCurrentOrder,
  getDeliveryBoyAssignment,
  getMyOrders,
  getOrderById,
  getTodayDeliveries,
  placeOrder,
  sendDeliveryOtp,
  updateOrderStatus,
  verifyDeliveryOtp,
  deleteOrder,
  rateOrder,
  createStripePaymentIntent,
  verifyStripePayment,
  cancelOrder,
} from '../controllers/order.controllers.js';

const orderRouter = express.Router();

orderRouter.post('/place-order', isAuth, orderRateLimiter, placeOrder);

orderRouter.get('/my-orders', isAuth, getMyOrders);
orderRouter.get('/get-assignments', isAuth, getDeliveryBoyAssignment);
orderRouter.get('/get-current-order', isAuth, getCurrentOrder);
orderRouter.get('/get-order-by-id/:orderId', isAuth, getOrderById);
orderRouter.get('/get-today-deliveries', isAuth, getTodayDeliveries);

orderRouter.post('/cancel-order', isAuth, cancelOrder);
orderRouter.post('/send-delivery-otp', isAuth, sendDeliveryOtp);
orderRouter.post('/verify-delivery-otp', isAuth, verifyDeliveryOtp);
orderRouter.post('/update-status/:orderId/:shopId', isAuth, updateOrderStatus);
orderRouter.get('/accept-order/:assignmentId', isAuth, acceptOrder);
orderRouter.delete('/delete-order/:orderId', isAuth, deleteOrder);
orderRouter.post('/rate-order/:orderId', isAuth, rateOrder);

orderRouter.post('/create-stripe-payment', isAuth, orderRateLimiter, createStripePaymentIntent);
orderRouter.post('/verify-stripe-payment', isAuth, verifyStripePayment);

export default orderRouter;
