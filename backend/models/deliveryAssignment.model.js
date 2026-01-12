/**
 * Delivery Assignment Model - Order broadcast & assignment system
 *
 * Flow: Order broadcasted to nearby delivery boys → one accepts → assigned
 * Fields: order, shop, shopOrderId, brodcastedTo[] (User refs), 
 * assignedTo (User ref), status (brodcasted/assigned/completed)
 * 
 * Libraries: mongoose
 * Features: Geospatial broadcast (10km radius), first-come-first-serve assignment
 * Lifecycle: Created on order → deleted after delivery completion
 * Indexes: order, shop, assignedTo
 */
import mongoose from 'mongoose';

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    brodcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['brodcasted', 'assigned', 'completed'],
      default: 'brodcasted',
    },
    acceptedAt: Date,
  },
  { timestamps: true },
);

const DeliveryAssignment = mongoose.model(
  'DeliveryAssignment',
  deliveryAssignmentSchema,
);
export default DeliveryAssignment;
