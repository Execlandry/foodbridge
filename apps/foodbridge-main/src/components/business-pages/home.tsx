import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  MinusCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";
import {
  fetchDishesForLandingPage,
  listDishesForLandingPage,
  UpdateDishStatus,
} from "../../redux/dishes/dishes.slice";
import { addCartItems, removeCartItems, fetchCartItems, CartItemsSelector } from "../../redux/cart/cart.slice";
import { fetchBusinesses, topBusinesses } from "../../redux/business/business.slice";
import { UserAddressSelector, fetchAddress } from "../../redux/user/user.slice";
import { UserContext, UserContextType } from "../../hooks/user-context";
import useAuth from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";
import delivery_bike_icon from "../../assets/banner/2.png";
import banner_image_spags from "../../assets/banner/1.jpeg";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  lat?: number;
  long?: number;
}

interface Business {
  id: string | number;
  name: string;
  thumbnails?: string;
  is_available: boolean;
  latitude: string | number;
  longitude: string | number;
  address?: Address;
}

interface Dish {
  id: string | number;
  dish_id?: string | number;
  name: string;
  expires_at: string;
  thumbnails?: string;
  description: string;
  status: string;
  ingredients: string;
  quantity: string;
  food_type: string;
  business: Business;
  business_id?: string | number;
}

interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  status: string;
  food_type: string;
  quantity?: string;
  ingredients?: string;
  thumbnails?: string;
  expires_at?: string;
}

interface CartItem {
  business: Business;
  business_id: string | number;
  menu_items: MenuItem[];
}

interface GroupedDishes {
  [key: string]: {
    business: Business;
    dishes: Dish[];
  };
}

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: dishesData } = useSelector(listDishesForLandingPage);
  const { data: businessesData } = useSelector(topBusinesses);
  const { data: cartData } = useSelector(CartItemsSelector);
  const { data: addresses } = useSelector(UserAddressSelector);
  const { user } = useContext(UserContext) as UserContextType;
  const { logoutUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [filterAvailable, setFilterAvailable] = useState<string[]>([]);
  const [groupedDishes, setGroupedDishes] = useState<GroupedDishes>({});
  const [expiredDishes, setExpiredDishes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.permissions === "business-admin") {
      navigate("/signin");
      return;
    }
    dispatch(fetchDishesForLandingPage());
    dispatch(fetchBusinesses());
    dispatch(fetchCartItems());
    
    if (user?.id) {
      dispatch(fetchAddress(user.id));
    }
  }, [dispatch, navigate, user]);

  useEffect(() => {
    const checkForAvailability = () => {
      console.log("cartData", cartData);
      console.log("filterAvailable", filterAvailable);
      if (cartData && Array.isArray(cartData)) {
        cartData.forEach((cart: CartItem) => {
          if (cart.menu_items && Array.isArray(cart.menu_items)) {
            cart.menu_items.forEach((item: MenuItem) => {
              // Remove item if it's not in the available list OR its status is not "available"
              if (!filterAvailable.includes(item.id?.toString()) || item.status !== "available") {
                dispatch(
                  removeCartItems({
                    business: cart.business,
                    business_id: cart.business_id,
                    menu_item: {
                      name: item.name,
                      description: item.description,
                      status: item.status,
                      food_type: item.food_type,
                      thumbnails: item.thumbnails,
                      id: item.id,
                    },
                  })
                );
              }
            });
          }
        });
      }
    };

    // if (filterAvailable.length > 0) {
      checkForAvailability();
    // }
  }, [cartData, filterAvailable, dispatch]);

  useEffect(() => {
    if (!dishesData?.foodHolder) return;
    const groupDishesByBusiness = (): GroupedDishes => {
      const grouped: GroupedDishes = {};
      const filterAvailableIds: string[] = [];
      const expiredIds = new Set<string>();

      dishesData.foodHolder.forEach((dish: Dish) => {
        // Skip if dish is undefined or doesn't have required properties
        if (!dish || typeof dish !== 'object') return;
        
        // Skip dishes that are expired
        if (dish.expires_at && new Date() > new Date(dish.expires_at)) {
          if (dish.id) expiredIds.add(dish.id.toString());
          return;
        }
        
        // Skip dishes that don't have an available status
        if (dish.status !== "available") {
          return;
        }

        // Skip if business_id is missing
        const businessId = dish.business_id?.toString();
        if (!businessId || !dish.business) return;
        
        // Initialize business group if it doesn't exist
        if (!grouped[businessId]) {
          grouped[businessId] = { business: dish.business, dishes: [] };
        }
        
        // Add dish to the group
        grouped[businessId].dishes.push(dish);
        if (dish.id) filterAvailableIds.push(dish.id.toString());
      });

      setFilterAvailable(filterAvailableIds);
      setExpiredDishes(expiredIds);
      

      // Sort businesses by distance if address is available
      if (addresses?.[0]?.lat && addresses?.[0]?.long) {
        const reference = addresses[0];
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
          const aBusiness = grouped[a].business;
          const bBusiness = grouped[b].business;

          if (!aBusiness?.latitude || !aBusiness?.longitude || 
              !bBusiness?.latitude || !bBusiness?.longitude) {
            return 0;
          }

          const distA = getDistance(
            Number(reference.lat),
            Number(reference.long),
            Number(aBusiness.latitude),
            Number(aBusiness.longitude)
          );
          const distB = getDistance(
            Number(reference.lat),
            Number(reference.long),
            Number(bBusiness.latitude),
            Number(bBusiness.longitude)
          );

          return distA - distB;
        });

        const sortedGrouped: GroupedDishes = {};
        sortedKeys.forEach((key) => {
          sortedGrouped[key] = grouped[key];
        });

        return sortedGrouped;
      }

      return grouped;
    };

    setGroupedDishes(groupDishesByBusiness());
  }, [dishesData, addresses]);

  // Handle expired dishes separately
  useEffect(() => {
    if (expiredDishes.size > 0 && dishesData?.foodHolder) {
      expiredDishes.forEach(dishId => {
        const dish = dishesData.foodHolder.find((d: Dish) => d && d.id && d.id.toString() === dishId);
        if (dish && dish.business_id) {
          dispatch(UpdateDishStatus({ id: dish.business_id, dish }));
        }
      });
    }
  }, [expiredDishes, dishesData, dispatch]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      return Number.MAX_SAFE_INTEGER;
    }
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
  };


  // let groupedDishes = groupDishesByBusiness();

  useEffect(() => {
    const cartDishIds: string[] = [];
    if (cartData && Array.isArray(cartData)) {
      cartData.forEach((cart: CartItem) => {
        if (cart.menu_items && Array.isArray(cart.menu_items)) {
          cart.menu_items.forEach((item: MenuItem) => {
            if (item.id && filterAvailable.includes(item.id.toString())) {
              cartDishIds.push(item.id.toString());
            }
          });
        }
      });
      setCartItems(cartDishIds);
    }
  }, [cartData, filterAvailable]);

  const addToCart = (dish: Dish) => {
    dispatch(
      addCartItems({
        business_id: dish.business_id,
        business: dish.business,
        menu_item: {
          name: dish.name,
          description: dish.description,
          status: dish.status,
          food_type: dish.food_type,
          quantity: dish.quantity.toString(),
          ingredients: dish.ingredients,
          thumbnails: dish.thumbnails,
          id: dish.id,
          expires_at: dish.expires_at,
        },
      })
    );
  };

  const removeFromCart = (dish: Dish) => {
    dispatch(
      removeCartItems({
        business: dish.business,
        business_id: dish.business_id,
        menu_item: {
          name: dish.name,
          description: dish.description,
          status: dish.status,
          food_type: dish.food_type,
          thumbnails: dish.thumbnails,
          id: dish.id,
        },
      })
    );
  };

  // Top Section UI
  function TopSection() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Today's Surplus Menu <span className="text-green-600">🥗</span>
          </h1>
          <div className="relative w-full sm:w-80">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search businesses or meals..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm"
            />
            <SearchIcon className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-opacity-10 bg-green-800 pattern-dots" />
          <img
            src={delivery_bike_icon}
            alt="Delivery"
            className="w-32 h-32 object-contain z-10 mb-4 sm:mb-0"
          />
          <div className="text-center text-white z-10 flex-1 px-4">
            <p className="text-lg font-bold">Hey FoodBridge Partner!</p>
            <p className="mt-1 text-sm max-w-xs mx-auto">
              Get <span className="font-bold text-yellow-200">free delivery</span> on orders over 10 meals
            </p>
            <button className="mt-3 px-6 py-1.5 bg-white text-green-600 rounded-full text-sm font-medium hover:bg-gray-100 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
              Learn More
            </button>
          </div>
          <img
            src={banner_image_spags}
            alt="Surplus Food"
            className="w-32 h-32 object-cover rounded-lg z-10"
          />
        </div>
      </div>
    );
  }

  // Business and Dishes UI
  function BusinessesAndDishes() {
    // Filter businesses by search term AND ensure they have available dishes to display
    const filteredBusinesses = businessesData?.filter((business: Business) => {
      if (!business) return false;
      
      // First filter by search term
      const matchesSearch = business.name?.toUpperCase().includes(searchTerm.toUpperCase());
      
      // Then check if this business has any available dishes in our grouped data
      const hasDishes = groupedDishes[business.id]?.dishes?.length > 0;
      
      return matchesSearch && hasDishes;
    }) || [];

    const BusinessCard = ({ business }: { business: Business }) => {
      const businessDishes = groupedDishes[business.id]?.dishes || [];

      // If no dishes available after filtering, don't show this business card
      if (businessDishes.length === 0) return null;

      return (
        <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <img
              src={business?.thumbnails || "https://via.placeholder.com/150"}
              alt={business?.name}
              className="w-24 h-24 object-cover rounded-lg shadow-sm"
              loading="lazy"
            />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-semibold text-gray-900 truncate">{business?.name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businessDishes.map((dish: Dish) => (
              <div
                key={dish.id}
                className={`bg-gray-50 rounded-lg p-3 flex items-center gap-3 group hover:bg-green-50 transition-all duration-200 ${
                  cartItems.includes(dish.id?.toString()) ? "bg-green-200" : ""
                }`}
              >
                <img
                  src={dish?.thumbnails || "https://via.placeholder.com/100"}
                  alt={dish?.name}
                  className="w-16 h-16 object-cover rounded-md shadow-sm group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{dish?.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-green-600 font-medium text-sm">{dish?.quantity} Kg</span>
                    <div className="mt-1 text-sm text-gray-500">
                      Expires At: {new Date(dish.expires_at).toLocaleString()}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => removeFromCart(dish)}
                        className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                        disabled={!cartItems.includes(dish.id?.toString())}
                      >
                        <MinusCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addToCart(dish)}
                        className={`w-7 h-7 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 
                          ${cartItems.includes(dish.id?.toString()) ? "bg-green-800" : "bg-green-500"}`}
                        disabled={cartItems.includes(dish.id?.toString())}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Businesses</h2>
        <div className="space-y-8">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business: Business) => (
              <BusinessCard key={business.id} business={business} />
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm py-8">No businesses found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopSection />
      <BusinessesAndDishes />
    </div>
  );
}

export default Home;