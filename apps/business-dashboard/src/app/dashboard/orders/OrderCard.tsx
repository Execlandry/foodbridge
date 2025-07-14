import React from "react";
import { Order } from "./Orders";
import { EyeIcon, LocationMarkerIcon } from "@heroicons/react/outline";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onTrackOrder,
}) => {
  const address = order.business.address;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {order.business.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 leading-5">
            {address.name}, {address.street}, {address.city}, {address.state},{" "}
            {address.country} - {address.pincode}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">{order.menu_items.length}</span> item
            {order.menu_items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="text-right min-w-[80px]">
          <p className="text-xl font-bold text-green-600">${order.amount}</p>
        </div>
      </div>

      {/* Optional Status Tags */}
      {/* 
      <div className="flex flex-wrap gap-2 mt-5">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            order.payment_status === "success"
              ? "bg-green-100 text-green-700"
              : order.payment_status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.payment_status}
        </span>

        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            order.order_status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.order_status === "in_transit"
              ? "bg-blue-100 text-blue-700"
              : order.order_status === "accepted"
              ? "bg-purple-100 text-purple-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.order_status.replace("_", " ")}
        </span>
      </div> 
      */}

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition"
        >
          <EyeIcon className="w-4 h-4 mr-2" />
          View Details
        </button>

        {order.request_for_driver && onTrackOrder && (
          <button
            onClick={() => onTrackOrder(order)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition"
          >
            <LocationMarkerIcon className="w-4 h-4 mr-2" />
            Track
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
