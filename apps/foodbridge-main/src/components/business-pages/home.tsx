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
} from "../../redux/dishes/dishes.slice";
import { addCartItems, removeCartItems } from "../../redux/cart/cart.slice";
import {
  fetchBusinesses,
  topBusinesses,
} from "../../redux/business/business.slice";
import Rating from "./rating";
import delivery_bike_icon from "../../assets/banner/2.png";
import banner_image_spags from "../../assets/banner/1.jpeg";
import { UserContext, UserContextType } from "../../hooks/user-context";
import { CartItemsSelector, fetchCartItems } from "../../redux/cart/cart.slice";
import useAuth from "../../hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";

interface Business {
  id: string | number;
  name: string;
  thumbnails?: string;
  category?: string;
  avg_price?: number;
  address?:Address;
}

interface Dish {
  id: string | number;
  dish_id?: string | number;
  name: string;
  thumbnails?: string;
  description: string;
  status: string;
  ingredients: string;
  quantity: string;
  food_type: string;
  business: Business;
  business_id?: string | number;
}

interface Address
{
  id:string,
  name:string,
  street:string,
  city:string,
  state:string,
  country:string,
  pincode:string,
}

interface GroupedDishes {
  [key: string]: {
    business: Business;
    dishes: Dish[];
  };
}

function Home() {
  const dispatch = useDispatch();
  const { data } = useSelector(listDishesForLandingPage);
  const { data: businessesData } = useSelector(topBusinesses);
  const { data: cartData } = useSelector(CartItemsSelector);
  const { user } = useContext(UserContext) as UserContextType;
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setcartItems] = useState<string[]>([]);

  useEffect(() => {
    // if(user && user.permissions=="business-admin")
    // {
    //   window.location.href = 'http://localhost:3007/signin';
    //   return;
    // }
    dispatch(fetchDishesForLandingPage());
    dispatch(fetchBusinesses());
    dispatch(fetchCartItems());
    // console.log(data);
  }, [dispatch]);

  const groupDishesByBusiness = (): GroupedDishes => {
    const grouped: GroupedDishes = {};
    data?.foodHolder?.forEach((dish: Dish) => {
      const businessId = dish?.business_id || "unknown";
      if (!grouped[businessId] && dish?.business) {
        grouped[businessId] = { business: dish.business, dishes: []};
      }
      if (dish?.business) grouped[businessId].dishes.push(dish);
    });
    console.log("grouped Dishes :g",grouped);
    console.log("Data Dishes :g",data.foodHolder);

    return grouped;
  };

  useEffect(() => {
    const cartDishIds: string[] = [];
    if (cartData && Array.isArray(cartData)) {
      for (const cart of cartData) {
        if (cart.menu_items && Array.isArray(cart.menu_items)) {
          for (const item of cart.menu_items) {
            cartDishIds.push(item.id);
          }
        }
      }
      setcartItems(cartDishIds);
      console.log(cartDishIds);
      console.log(user);
    }
  }, [cartData]);

  const groupedDishes = groupDishesByBusiness();
  const filteredBusinesses = businessesData?.filter((business: Business) =>
    business.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  const addToCart = (dish: Dish) => {
    // console.log(dish);
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

  // const addAllDishesToCart = (businessId: string | number) => {
  //   if (!user || user.permissions === "business-admin") return;
  //   const businessDishes = groupedDishes[businessId]?.dishes || [];
  //   businessDishes.forEach((dish) => addToCart(dish));
  // };

  // Top Section UI
  function TopSection() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Today’s Surplus Menu <span className="text-green-600">🥗</span>
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
              Get{" "}
              <span className="font-bold text-yellow-200">free delivery</span>{" "}
              on orders over 10 meals
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
    const BusinessCard = ({ business }: { business: Business }) => {
      const businessDishes = groupedDishes[business.id]?.dishes || [];
      // const CartDishes=businessDishes.filter((dish: Dish) => !cartItems.includes(dish.dish_id?.toString() || ''));
      // groupedDishes[business.id]?.dishes || [];

      return (
        <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          {/* Business Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <img
              src={business?.thumbnails || "https://via.placeholder.com/150"}
              alt={business?.name}
              className="w-24 h-24 object-cover rounded-lg shadow-sm"
              loading="lazy"
            />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-semibold text-gray-900 truncate">
                {business?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {business?.category || "Cuisine"}
              </p>
              
              <span className="text-green-600 font-medium text-base">
                {/* Avg: ${business?.avg_price?.toFixed(2) || "N/A"} */}
              </span>
            </div>
            {/* {businessDishes.length > 0 && ( */}
            {/* <button
                onClick={() => addAllDishesToCart(business.id)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!user || user.permissions === "business-admin"}
              >
                <ShoppingCartIcon className="h-4 w-4" />
                <span>Add All</span>
              </button> */}
          </div>

          {/* Dishes */}
          {/* {businessDishes.length > 0 ? ( */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businessDishes.map((dish: Dish) => (
              <div
                key={dish.dish_id || dish.id}
                className={`bg-gray-50 rounded-lg p-3 flex items-center gap-3 group hover:bg-green-50 transition-all duration-200 ${
                  cartItems.includes(dish.dish_id?.toString() || "")
                    ? "bg-green-200"
                    : ""
                }`}
              >
                <img
                  src={dish?.thumbnails || "https://via.placeholder.com/100"}
                  alt={dish?.name}
                  className="w-16 h-16 object-cover rounded-md shadow-sm group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {dish?.name} 
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-green-600 font-medium text-sm">
                      {" "}
                      {dish?.quantity} Kg
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => removeFromCart(dish)}
                        className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                        disabled={
                          !cartItems.includes(dish.dish_id?.toString() || "")
                        }
                      >
                        <MinusCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addToCart(dish)}
                        className={`w-7 h-7 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 
                            ${
                              cartItems.includes(dish.dish_id?.toString() || "")
                                ? "bg-green-800"
                                : "bg-green-500"
                            }`}
                        disabled={cartItems.includes(
                          dish.dish_id?.toString() || ""
                        )}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* ) : (
            <p className="text-gray-500 text-sm text-center">No dishes available</p>
          )} */}
        </div>
      );
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Featured Businesses
        </h2>
        <div className="space-y-8">
          {filteredBusinesses?.map((business: Business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
          {!filteredBusinesses?.length && (
            <p className="text-center text-gray-500 text-sm py-8">
              No businesses found
            </p>
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
