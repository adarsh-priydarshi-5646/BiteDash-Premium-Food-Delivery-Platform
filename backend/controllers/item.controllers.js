/**
 * Item Controller - Food menu items CRUD with search & rating system
 * 
 * Endpoints: addItem, editItem, deleteItem, getItemById, getItemByCity, searchItems, rating
 * Features: Cloudinary image upload, city-based filtering, text search, 5-star rating system
 * Items linked to shops, supports veg/non-veg foodType & category classification
 */
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { escapeRegex } from "../utils/sanitize.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(201).json(shop);

  } catch (error) {
    console.error("Add item error:", error);
    return res.status(500).json({ message: "Failed to add item. Please try again." });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;

    let image;
    
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true }
    );
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (error) {
    console.error("Edit item error:", error);
    return res.status(500).json({ message: "Failed to edit item. Please try again." });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error("Get item error:", error);
    return res.status(500).json({ message: "Failed to get item. Please try again." });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i !== item._id);
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (error) {
    console.error("Delete item error:", error);
    return res.status(500).json({ message: "Failed to delete item. Please try again." });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }
    
    const safeCity = escapeRegex(city);
    
    const cityShops = await Shop.find({
      city: { $regex: new RegExp(`^${safeCity}$`, "i") },
      isDefault: false,
    }).populate("items");

    const defaultShop = await Shop.findOne({ isDefault: true }).populate("items");

    const cityShopIds = cityShops.map((shop) => shop._id);
    const shopIds = defaultShop ? [defaultShop._id, ...cityShopIds] : cityShopIds;

    const items = await Item.find({ shop: { $in: shopIds } });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Get item by city error:", error);
    return res.status(500).json({ message: "Failed to get items. Please try again." });
  }
};

export const getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(400).json("shop not found");
    }
    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    console.error("Get item by shop error:", error);
    return res.status(500).json({ message: "Failed to get items. Please try again." });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) {
      return res.status(400).json({ message: "query and city required" });
    }
    
    const safeCity = escapeRegex(city);
    const safeQuery = escapeRegex(query);
    
    const cityShops = await Shop.find({
      city: { $regex: new RegExp(`^${safeCity}$`, "i") },
      isDefault: false,
    }).populate("items");

    const defaultShop = await Shop.findOne({ isDefault: true }).populate("items");

    const cityShopIds = cityShops.map((s) => s._id);
    const shopIds = defaultShop ? [defaultShop._id, ...cityShopIds] : cityShopIds;

    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } },
      ],
    }).populate("shop", "name image");

    return res.status(200).json(items);
  } catch (error) {
    console.error("Search item error:", error);
    return res.status(500).json({ message: "Search failed. Please try again." });
  }
};

export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;

    if (!itemId || !rating) {
      return res.status(400).json({ message: "itemId and rating is required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be between 1 to 5" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const newCount = item.rating.count + 1;
    const newAverage =
      (item.rating.average * item.rating.count + rating) / newCount;

    item.rating.count = newCount;
    item.rating.average = newAverage;
    await item.save();
    return res.status(200).json({ rating: item.rating });
  } catch (error) {
    console.error("Rating error:", error);
    return res.status(500).json({ message: "Failed to submit rating. Please try again." });
  }
};
