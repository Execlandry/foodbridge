import React from "react";
import { Order } from "./Orders";
import { XIcon } from "@heroicons/react/solid";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const address = order.business.address;
  console.log("Order Details:", order);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] animate-fadeIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT TIMELINE or STATUS */}
        <div className="w-full md:w-1/3">
          <h3 className="text-xl font-semibold text-emerald-700 mb-6">
            Order Status
          </h3>

          <div className="space-y-6 border-l-2 border-emerald-200 pl-6 relative">
            <div className="absolute top-2 left-[-13px] w-3 h-3 bg-emerald-600 rounded-full"></div>
            <div>
              <h4 className="font-semibold text-gray-800">Order Accepted</h4>
              <p className="text-sm text-gray-600">
                {/* Restaurant is preparing your food */}
              </p>
            </div>
            {/* Add more status blocks here dynamically if needed */}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-800">
              Order Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-emerald-600 transition duration-200"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-emerald-700 font-semibold mb-1">Business</h4>
              <p className="text-gray-900 font-medium">{order.business.name}</p>
              <p className="text-gray-600">
                {address.name}, {address.street}, {address.city},{" "}
                {address.state}, {address.country}, {address.pincode}
              </p>
            </div>

            <div>
              <h4 className="text-emerald-700 font-semibold mb-1">Status</h4>
              <div className="space-y-1">
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Order:</span>
                  <span className="text-emerald-700 font-medium capitalize">
                    {order.order_status?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="text-emerald-700 font-medium">
                    {order.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="text-gray-900 font-medium uppercase">
                    {order.payment_method}
                  </span>
                </div> */}

                {order?.request_for_driver && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="text-gray-800 font-semibold">
                        ₹{order.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">OTP:</span>
                      <span className="text-gray-800 font-medium">
                        {order.otp}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {order?.address && (
              <div>
                <h4 className="text-emerald-700 font-semibold mb-1">
                  Delivery Address
                </h4>
                <p className="text-gray-900 font-medium">
                  {order.address.name}, {order.address.street}
                </p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>
              </div>
            )}
          </div>

          {/* ORDER ITEMS */}
          <div className="mt-8">
            <h4 className="text-emerald-700 font-semibold mb-3">Order Items</h4>
            <div className="rounded-xl border border-emerald-100 overflow-hidden shadow">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-emerald-900">
                  <tr>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-right">Type</th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Ingredients</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {order.menu_items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">{item.food_type}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        {item.ingredients}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {order?.request_for_driver && (
                  <tfoot className="bg-emerald-50 text-emerald-900">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-right font-medium"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        ₹{order.amount}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
