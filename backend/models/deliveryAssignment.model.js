/**
 * Delivery Assignment Model - Order broadcast & assignment to delivery partners
 *
 * Flow: Order broadcasted to nearby delivery boys → one accepts → assigned
 * Fields: order, shop, shopOrderId, brodcastedTo (array), assignedTo, status
 * Status: brodcasted → assigned → completed (deleted after delivery)
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
  { timestamps: true }
);

const DeliveryAssignment = mongoose.model('DeliveryAssignment', deliveryAssignmentSchema);
export default DeliveryAssignment;
