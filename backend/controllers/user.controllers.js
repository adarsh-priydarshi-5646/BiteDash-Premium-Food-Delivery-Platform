/**
 * User Controller - User profile, addresses, bank details & statistics
 * 
 * Endpoints: getCurrentUser, updateProfile, updateUserLocation, addAddress, updateAddress, removeAddress
 * Features: Multiple saved addresses with default selection, bank details for owners, profile stats
 * Supports geolocation updates for delivery tracking, earnings calculation for restaurant owners
 */
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Failed to get user. Please try again." });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }

    return res.status(200).json({ message: "location updated" });
  } catch (error) {
    console.error("Update location error:", error);
    return res.status(500).json({ message: "Failed to update location. Please try again." });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "owner") {
      return res.status(403).json({ message: "Only restaurant owners can add bank details" });
    }

    user.bankDetails = {
      accountHolderName: accountHolderName || user.bankDetails.accountHolderName,
      accountNumber: accountNumber || user.bankDetails.accountNumber,
      ifscCode: ifscCode || user.bankDetails.ifscCode,
      bankName: bankName || user.bankDetails.bankName,
      upiId: upiId || user.bankDetails.upiId,
    };

    await user.save();

    return res.status(200).json({ 
      message: "Bank details updated successfully",
      bankDetails: user.bankDetails 
    });
  } catch (error) {
    console.error("Update bank details error:", error);
    return res.status(500).json({ message: "Failed to update bank details. Please try again." });
  }
};

export const getBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ 
      bankDetails: user.bankDetails,
      totalEarnings: user.totalEarnings 
    });
  } catch (error) {
    console.error("Get bank details error:", error);
    return res.status(500).json({ message: "Failed to get bank details. Please try again." });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.addresses.length === 0) {
      address.isDefault = true;
    } else if (address.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(address);
    await user.save();
    return res.status(200).json({ message: "Address added successfully", user });
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({ message: "Failed to add address. Please try again." });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId, updatedAddress } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressIndex = user.addresses.findIndex((addr) => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: "Address not found" });

    if (updatedAddress.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updatedAddress };
    await user.save();
    return res.status(200).json({ message: "Address updated successfully", user });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({ message: "Failed to update address. Please try again." });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressToRemove = user.addresses.id(addressId);
    if (!addressToRemove) return res.status(404).json({ message: "Address not found" });

    const wasDefault = addressToRemove.isDefault;
    user.addresses.pull(addressId);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return res.status(200).json({ message: "Address removed successfully", user });
  } catch (error) {
    console.error("Remove address error:", error);
    return res.status(500).json({ message: "Failed to remove address. Please try again." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile. Please try again." });
  }
};

export const getProfileStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const totalOrders = await Order.countDocuments({ user: userId });
    
    const totalReviews = await Order.countDocuments({ 
      user: userId, 
      "orderRating.rating": { $ne: null } 
    });
    
    const orders = await Order.find({ user: userId, payment: true });
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const points = Math.floor(totalSpent / 10);
    
    const savedTimeMinutes = totalOrders * 20;
    const savedTimeHours = (savedTimeMinutes / 60).toFixed(1);

    return res.status(200).json({
      totalOrders,
      totalReviews,
      points,
      savedTime: `${savedTimeHours} hrs`
    });
  } catch (error) {
    console.error("Get profile stats error:", error);
    return res.status(500).json({ message: "Failed to get profile stats. Please try again." });
  }
};
