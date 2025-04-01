import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  MinusCircleIcon,
} from "@heroicons/react/outline";
import {
  changeFoodCategorySelection,
  fetchDishesForLandingPage,
  listDishesForLandingPage,
} from "../../redux/dishes/dishes.slice";
import { addCartItems, removeCartItems } from "../../redux/cart/cart.slice";
import Rating from "./rating";
import delivery_bike_icon from "../../assets/banner/2.png";
import banner_image_spags from "../../assets/banner/1.jpeg";

function Home() {
  const dispatch = useDispatch();
  const { data } = useSelector(listDishesForLandingPage);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDishesForLandingPage());
  }, [dispatch]);

  const addToCart = (dish: any) => {
    dispatch(
      addCartItems({
        business_id: dish.business_id,
        business: dish.business,
        menu_item: { ...dish, id: dish.dish_id },
      })
    );
  };

  const removeFromCart = (dish: any) => {
    dispatch(
      removeCartItems({
        business: dish.business,
        business_id: dish.business_id,
        menu_item: { ...dish, id: dish.dish_id },
      })
    );
  };

  const changeCategorySelection = (menu: any) => {
    dispatch(changeFoodCategorySelection(menu));
  };

  const filterFood = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFood = data?.foodHolder?.filter((item: any) =>
    item.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  // Top Section UI
  function TopSection() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Today’s Menu{" "}
            <span className="text-green-600">😋</span>
          </h1>
          <div className="relative w-full max-w-md">
            <input
              onChange={filterFood}
              type="text"
              placeholder="Search delicious eats..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 text-gray-700"
            />
            <SearchIcon className="h-5 w-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-3xl p-8 flex items-center justify-between shadow-xl transform transition-all hover:shadow-2xl duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-opacity-10 bg-green-800 pattern-dots" />
          <img src={delivery_bike_icon} alt="Delivery" className="w-40 h-40 object-contain z-10" />
          <div className="text-center text-white z-10">
            <p className="text-xl font-bold">Hey Jeremy!</p>
            <p className="mt-2 text-sm max-w-xs mx-auto">
              Enjoy <span className="font-bold text-yellow-200">free delivery</span> on every order over $20
            </p>
            <button className="mt-4 px-8 py-2 bg-white text-green-600 rounded-full font-semibold shadow-md hover:bg-gray-100 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300">
              Learn More
            </button>
          </div>
          <img src={banner_image_spags} alt="Food" className="w-40 h-40 object-cover rounded-xl z-10" />
        </div>
      </div>
    );
  }

  // Menu Category UI
  function MenuCategory() {
    const { menuCategory } = data;

    const MenuCard = ({ menu }: { menu: any }) => (
      <button
        onClick={() => changeCategorySelection(menu)}
        className={`w-36 p-5 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
          checkSelectedCategory(menu)
            ? "bg-green-600 text-white shadow-md"
            : "bg-white shadow-sm hover:bg-gray-50"
        }`}
      >
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
          <img src={menu?.menu_image} alt={menu?.name} className="w-8 h-8 object-contain" />
        </div>
        <p className={`mt-3 font-semibold text-sm ${checkSelectedCategory(menu) ? "text-white" : "text-gray-900"}`}>
          {menu?.name}
        </p>
        <div
          className={`mt-3 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
            checkSelectedCategory(menu) ? "bg-white" : "bg-green-600"
          }`}
        >
          <ChevronRightIcon
            className={`h-4 w-4 ${checkSelectedCategory(menu) ? "text-green-600" : "text-white"}`}
          />
        </div>
      </button>
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
          <button className="flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
            View All
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {menuCategory?.map((menu: any, index: number) => (
            <MenuCard key={index} menu={menu} />
          ))}
        </div>
      </div>
    );
  }

  // Food UI
  function Food() {
    const FoodCard = ({ food_item }: { food_item: any }) => (
      <div className="w-72 bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
        <div className="relative">
          <img
            src={food_item?.food_image}
            alt={food_item?.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-green-600 shadow-sm">
            ${food_item?.price}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{food_item?.name}</h3>
          <div className="mt-2 flex items-center">
            <Rating />
            <span className="ml-2 text-xs text-gray-500">(4.5)</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-green-600 font-bold text-lg">
              ${food_item?.price.toFixed(2)}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => removeFromCart(food_item)}
                className="w-9 h-9 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => addToCart(food_item)}
                className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredFood?.map((food_item: any, index: number) => (
            <FoodCard key={index} food_item={food_item} />
          ))}
        </div>
      </div>
    );
  }

  const checkSelectedCategory = (menu: any) =>
    data?.selectedCategory?.id === menu?.id;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <TopSection />
      <MenuCategory />
      <Food />
    </div>
  );
}

export default Home;