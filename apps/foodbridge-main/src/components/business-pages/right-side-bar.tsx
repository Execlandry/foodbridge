import React, { useContext, useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { CartItemsSelector, fetchCartItems } from "../../redux/cart/cart.slice";
import useAuth from "../../hooks/use-auth";
import { UserContext, UserContextType } from "../../hooks/user-context";

interface RightSideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function RightSideBar({ isOpen, toggleSidebar }: RightSideBarProps) {
  const dispatch = useDispatch();
  const { logoutUser } = useAuth();
  const { data } = useSelector(CartItemsSelector);
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const goToCheckout = () => navigate("/fbe/checkout");

  // Mini Navbar UI
  function MiniNavBar() {
    console.log("cart data",data)
    return (
      <div className="p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"}
              />
            </svg>
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white transition-transform group-hover:scale-110">4</span>
              </button>
            </div>
            {user && (
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                  {user.name?.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{user.email}</span>
                  <span className="text-xs text-gray-500">{user.name}</span>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:text-green-600 transition-colors duration-200" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Order Menu UI
  function OrderMenu() {
    const CartCard = ({ cart_item }: { cart_item: any }) => (
      <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-gray-100 hover:border-green-100 transition-all duration-300 group">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={cart_item?.thumbnails} 
              alt={cart_item?.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{cart_item?.name}</p>
            {/* <p className="text-xs text-gray-500 mt-1">
              {cart_item?.count} <span className="text-green-600">×</span> ${Number(cart_item?.price).toFixed(2)}
            </p> */}
          </div>
        </div>
        {/* <p className="text-sm font-semibold text-green-600 pl-4">
          ${(Number(cart_item?.price) * Number(cart_item?.count)).toFixed(2)}
        </p> */}
      </div>
    );

    return (
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Order</h2>
          {/* <button className="flex items-center text-sm text-green-600 hover:text-green-700 transition-colors duration-200">
            View All
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button> */}
        </div>
        <div className="space-y-3">

  {data?.length > 0 ? (
    data.map((item: any, idx: number) =>
      item.menu_items?.map((cart_item: any, index: number) => (
        <CartCard key={`${idx}-${index}`} cart_item={cart_item} />
      ))
    )
  ) : (
    <div className="text-center py-8 text-gray-500 text-sm">
      Your cart is empty
    </div>
  )}
</div>

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
      <div className="p-4 bg-gray-50 border-t border-gray-100 sticky bottom-0">
        <div className="space-y-4">
          {/* <input
            type="text"
            placeholder="Any suggestions? We’ll pass it on..."
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
          /> */}
          {/* <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20">
            Apply Coupon
          </button>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Bill Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
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
              <hr className="my-2 border-gray-100" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div> */}
          <button
            onClick={goToCheckout}
            className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!data}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <MiniNavBar />
      {isOpen && (
        <>
          <OrderMenu />
          <Message />
        </>
      )}
    </div>
  );
}

export default RightSideBar;