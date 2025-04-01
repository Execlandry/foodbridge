import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { CartItemsSelector, fetchCartItems } from "../../redux/cart/cart.slice";
import useAuth from "../../hooks/use-auth";
import { UserContext, UserContextType } from "../../hooks/user-context";

function RightSideBar() {
  const dispatch = useDispatch();
  const { logoutUser } = useAuth();
  const { data } = useSelector(CartItemsSelector);
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const goToCheckout = () => {
    navigate("/fbe/checkout");
  };

  // Mini Navbar UI
  function MiniNavBar() {
    return (
      <div className="p-6 bg-gradient-to-b from-green-50 to-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-end space-x-6">
          <div className="relative">
            <button className="h-11 w-11 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300">
              <BellIcon className="h-6 w-6" />
            </button>
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">4</span>
          </div>
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{user.email}</span>
                <span className="text-xs text-gray-500">{user.name}</span>
              </div>
              <ChevronDownIcon className="h-5 w-5 text-gray-600 hover:text-green-600 transition-colors duration-200" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Order Menu UI
  function OrderMenu() {
    const CartCard = ({ cart_item }: { cart_item: any }) => (
      <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
            <img src={cart_item?.thumbnails} alt={cart_item?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">{cart_item?.name}</p>
            <p className="text-xs text-gray-600 mt-1">
              {cart_item?.count} <span className="text-green-600 font-medium">×</span> ${cart_item?.price}
            </p>
          </div>
        </div>
        <p className="text-sm font-bold text-green-600">${(Number(cart_item?.price) * Number(cart_item?.count)).toFixed(2)}</p>
      </div>
    );

    return (
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
          <button className="flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
            View All
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {data?.menu_items?.map((cart_item: any, index: number) => (
            <CartCard key={index} cart_item={cart_item} />
          ))}
        </div>
        <button
          onClick={goToCheckout}
          className="w-full mt-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Proceed to Checkout
        </button>
      </div>
    );
  }

  // Message/Bill Details UI
  function Message() {
    const total = data?.menu_items?.reduce(
      (acc: number, val: any) => acc + val.price * val.count,
      0
    ) || 0;

    return (
      <div className="p-6 bg-white border-t border-gray-100 shadow-inner">
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Any suggestions? We’ll pass it on..."
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300 shadow-sm"
          />
          <button className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-300">
            Apply Coupon
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Summary</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span className="font-medium">$0.00</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between pt-2 text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gradient-to-b from-gray-50 to-white shadow-xl flex flex-col overflow-y-auto z-50">
      <MiniNavBar />
      <OrderMenu />
      <Message />
    </div>
  );
}

export default RightSideBar;