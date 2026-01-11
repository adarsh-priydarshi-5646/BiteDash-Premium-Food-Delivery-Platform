/**
 * Delivery Service - Delivery assignment business logic
 * 
 * Functions: findNearbyDeliveryBoys, assignDeliveryBoy, getAvailableDeliveryBoys
 * Uses MongoDB geospatial queries ($near) for location-based search
 * Filters out busy delivery boys with active assignments
 */
import User from '../models/user.model.js';
import DeliveryAssignment from '../models/deliveryAssignment.model.js';
import { GEO_CONFIG, ASSIGNMENT_STATUS } from '../constants/index.js';

/**
 * Find nearby delivery boys using geospatial query
 */
export const findNearbyDeliveryBoys = async (longitude, latitude, maxDistance = GEO_CONFIG.MAX_DELIVERY_DISTANCE) => {
  return await User.find({
    role: 'deliveryBoy',
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

/**
 * Get busy delivery boy IDs (already assigned to orders)
 */
export const getBusyDeliveryBoyIds = async (deliveryBoyIds) => {
  const busyIds = await DeliveryAssignment.find({
    assignedTo: { $in: deliveryBoyIds },
    status: { $nin: [ASSIGNMENT_STATUS.BROADCASTED, ASSIGNMENT_STATUS.COMPLETED] },
  }).distinct('assignedTo');
  
  return new Set(busyIds.map((id) => String(id)));
};

/**
 * Filter available delivery boys (not busy)
 */
export const filterAvailableDeliveryBoys = (deliveryBoys, busyIdSet) => {
  return deliveryBoys.filter((boy) => !busyIdSet.has(String(boy._id)));
};

/**
 * Create delivery assignment
 */
export const createDeliveryAssignment = async (orderId, shopId, shopOrderId, candidates) => {
  return await DeliveryAssignment.create({
    order: orderId,
    shop: shopId,
    shopOrderId: shopOrderId,
    brodcastedTo: candidates,
    status: ASSIGNMENT_STATUS.BROADCASTED,
  });
};

/**
 * Notify delivery boys via socket
 */
export const notifyDeliveryBoys = (io, deliveryBoys, assignmentData) => {
  if (!io) return;
  
  deliveryBoys.forEach((boy) => {
    const boySocketId = boy.socketId;
    if (boySocketId) {
      io.to(boySocketId).emit('newAssignment', {
        sentTo: boy._id,
        ...assignmentData,
      });
    }
  });
};

/**
 * Check if delivery boy is already assigned
 */
export const isDeliveryBoyBusy = async (deliveryBoyId) => {
  const assignment = await DeliveryAssignment.findOne({
    assignedTo: deliveryBoyId,
    status: { $nin: [ASSIGNMENT_STATUS.BROADCASTED, ASSIGNMENT_STATUS.COMPLETED] },
  });
  
  return !!assignment;
};

/**
 * Accept delivery assignment
 */
export const acceptDeliveryAssignment = async (assignmentId, deliveryBoyId) => {
  const assignment = await DeliveryAssignment.findById(assignmentId);
  
  if (!assignment || assignment.status !== ASSIGNMENT_STATUS.BROADCASTED) {
    return null;
  }
  
  assignment.assignedTo = deliveryBoyId;
  assignment.status = ASSIGNMENT_STATUS.ASSIGNED;
  assignment.acceptedAt = new Date();
  await assignment.save();
  
  return assignment;
};

/**
 * Complete delivery assignment
 */
export const completeDeliveryAssignment = async (shopOrderId, orderId, deliveryBoyId) => {
  await DeliveryAssignment.deleteOne({
    shopOrderId,
    order: orderId,
    assignedTo: deliveryBoyId,
  });
};

/**
 * Calculate delivery earnings
 */
export const calculateDeliveryEarnings = (deliveryCount, ratePerDelivery = 50) => {
  return deliveryCount * ratePerDelivery;
};

export default {
  findNearbyDeliveryBoys,
  getBusyDeliveryBoyIds,
  filterAvailableDeliveryBoys,
  createDeliveryAssignment,
  notifyDeliveryBoys,
  isDeliveryBoyBusy,
  acceptDeliveryAssignment,
  completeDeliveryAssignment,
  calculateDeliveryEarnings,
};
