/**
 * Shop Page - Restaurant detail with menu
 *
 * Features: Shop banner, info (rating, delivery time, address), menu items grid
 * Fetches shop data by shopId from URL params
 * FoodCard components with add-to-cart functionality
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaStore,
  FaLocationDot,
  FaStar,
  FaClock,
  FaUtensils,
  FaMotorcycle,
  FaArrowLeft,
} from 'react-icons/fa6';
import FoodCard from '../components/FoodCard';
import Nav from '../components/Nav';

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        {
          withCredentials: true,
        },
      );
      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      {/* Main Content - starts after navbar */}
      <div className="pt-20">
        {shop && (
          <>
            {/* Shop Header - Compact Design */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                <div className="flex items-center gap-4">
                  {/* Back Button */}
                  <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                  >
                    <FaArrowLeft className="text-gray-600" />
                  </button>

                  {/* Shop Image - Small Thumbnail */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Shop Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {shop.name}
                    </h1>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      {shop.cuisine && (
                        <span className="truncate">{shop.cuisine}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <FaLocationDot className="text-[#E23744] text-xs flex-shrink-0" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                  </div>

                  {/* Stats - Right Side */}
                  <div className="hidden sm:flex items-center gap-3">
                    {shop.rating && (
                      <div className="flex items-center gap-1 bg-green-500 text-white px-2.5 py-1 rounded-lg">
                        <FaStar className="text-xs" />
                        <span className="font-bold text-sm">{shop.rating}</span>
                      </div>
                    )}

                    {shop.deliveryTime && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <FaClock className="text-orange-500" />
                        <span>{shop.deliveryTime} mins</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <FaMotorcycle className="text-blue-500" />
                      <span>Free Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="flex sm:hidden items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                  {shop.rating && (
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                      <FaStar className="text-[10px]" />
                      <span className="font-bold">{shop.rating}</span>
                    </div>
                  )}

                  {shop.deliveryTime && (
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <FaClock className="text-orange-500" />
                      <span>{shop.deliveryTime} mins</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <FaMotorcycle className="text-blue-500" />
                    <span>Free Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Menu <span className="text-gray-400 font-normal text-sm">({items.length} items)</span>
                </h2>
              </div>

              {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {items.map((item) => (
                    <FoodCard data={item} key={item._id} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUtensils className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-gray-900 text-lg font-bold mb-2">
                    No Items Available
                  </h3>
                  <p className="text-gray-500 mb-4 text-sm">
                    This restaurant hasn't added any menu items yet.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-5 py-2 bg-[#E23744] text-white font-semibold rounded-lg hover:bg-[#c02a35] transition-all text-sm"
                  >
                    Explore Other Restaurants
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;
