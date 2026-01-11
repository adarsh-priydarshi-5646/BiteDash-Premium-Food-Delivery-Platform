import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { escapeRegex } from "../utils/sanitize.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
        isDefault: false,
      });
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          owner: req.userId,
          isDefault: false,
        },
        { new: true }
      );
    }

    await shop.populate("owner items");
    return res.status(201).json(shop);
  } catch (error) {
    console.error("Create shop error:", error);
    return res.status(500).json({ message: "Failed to create shop. Please try again." });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shop) {
      return null;
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error("Get my shop error:", error);
    return res.status(500).json({ message: "Failed to get shop. Please try again." });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    // Escape regex special characters to prevent ReDoS
    const safeCity = escapeRegex(city);
    
    const cityShops = await Shop.find({
      city: { $regex: new RegExp(`^${safeCity}$`, "i") },
      isDefault: false,
    }).populate("items");

    const defaultShop = await Shop.findOne({ isDefault: true }).populate("items");

    const shops = defaultShop ? [defaultShop, ...cityShops] : cityShops;

    if (!shops || shops.length === 0) {
      return res.status(400).json({ message: "shops not found" });
    }
    return res.status(200).json(shops);
  } catch (error) {
    console.error("Get shop by city error:", error);
    return res.status(500).json({ message: "Failed to get shops. Please try again." });
  }
};
