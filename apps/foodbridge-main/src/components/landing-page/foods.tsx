import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchBusinesses,
  fetchTopDishes,
  topBusinesses,
  topDishes,
} from "../../redux/business/business.slice";
import { addCartItems } from "../../redux/cart/cart.slice";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import useAuth from "../../hooks/use-auth";
import { UserContext, UserContextType } from '../../hooks/user-context';

// Define types
interface Business {
  id: string | number;
  name: string;
  thumbnails?: string;
  category?: string;
  avg_price?: number;
}

interface Dish {
  id: string | number;
  name: string;
  thumbnails?: string;
  price: number;
  business: Business;
}

interface GroupedDishes {
  [key: string]: {
    business: Business;
    dishes: Dish[];
  };
}

interface RootState {
  cart: {
    items: Dish[];
  };
}

function Businesses() {
  const storeDispatch = useDispatch();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { user } = useContext(UserContext) as UserContextType;
  
  const { data: businessesData, status: businessStatus } = useSelector(topBusinesses);
  const { data: dishesData, status: dishesStatus } = useSelector(topDishes);
  
  useEffect(() => {
    storeDispatch(fetchBusinesses());
    storeDispatch(fetchTopDishes("order_by=ASC"));
  }, [storeDispatch]);

  const groupDishesByBusiness = (): GroupedDishes => {
    const grouped: GroupedDishes = {};
    dishesData?.forEach((dish: Dish) => {
      const businessId = dish?.business?.id || "unknown";
      if (!grouped[businessId]) {
        grouped[businessId] = { business: dish.business, dishes: [] };
      }
      grouped[businessId].dishes.push(dish);
    });
    return grouped;
  };

  const groupedDishes = groupDishesByBusiness();

  // Add all dishes of a business to the cart
  const addAllDishesToCart = (businessId: string | number) => {
    if (!user || user.permissions == "business-admin") {navigate("/signin"); return}// Prevent unauthorized users

    const businessDishes = groupedDishes[businessId]?.dishes || [];
    
    businessDishes.forEach((dish) => {
      storeDispatch(
        addCartItems({
          business_id: dish.business.id,
          business: dish.business,
          menu_item: { ...dish, id: dish.id },
        })
      );
    });

    // Redirect to /fbe/business after adding items to cart
    navigate("/fbe/business");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
          Explore <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">Top Businesses</span>
        </h1>

        {/* Loading Indicator */}
        {businessStatus === "pending" || dishesStatus === "pending" ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {businessesData?.map((business: Business) => {
              const businessDishes = groupedDishes[business.id]?.dishes || [];

              return (
                <div
                  key={business.id}
                  className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl hover:-translate-y-2 duration-300"
                >
                  {/* Business Info */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                    <img
                      src={business?.thumbnails || "https://via.placeholder.com/300x200"}
                      alt={business?.name}
                      className="w-32 h-32 object-cover rounded-xl sm:mr-6 mb-4 sm:mb-0 shadow-sm"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-gray-900">{business?.name}</h3>
                      <p className="text-sm text-gray-500 italic">{business?.category || "Cuisine"}</p>
                      <span className="text-green-600 font-semibold text-lg">
                        ${business?.avg_price?.toFixed(2) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Add All to Cart Button */}
                  {businessDishes.length > 0 && (
                    <button
                      onClick={() => addAllDishesToCart(business.id)}
                      className={`w-full flex items-center justify-center space-x-2 px-5 py-3 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400"}`}
                      // disabled={!user || user.permissions === "business-admin"}
                    >
                      <ShoppingCartIcon className="h-6 w-6" />
                      <span>
                        Add All Dishes to Cart
                      </span>
                    </button>
                  )}

                  {/* Dishes Under Business */}
                  {businessDishes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {businessDishes.map((dish: Dish) => (
                        <div
                          key={dish.id}
                          className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <img
                            src={dish?.thumbnails || "https://via.placeholder.com/300x200"}
                            alt={dish?.name}
                            className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm"
                          />
                          <h4 className="text-lg font-semibold text-gray-900 truncate">{dish?.name}</h4>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-green-600 font-bold text-lg">${dish?.price?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center mt-4">No dishes available for this business.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Businesses;
