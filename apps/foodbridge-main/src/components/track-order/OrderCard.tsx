import React from "react";
import { Order } from "../types/Orders";
import { EyeIcon, LocationMarkerIcon, MapIcon } from "@heroicons/react/outline";
// import { Package, Eye, Map } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {order.business.name}
          </h3>
          <p className="text-sm text-gray-500">
            {order.business.address.name} {order.business.address.street}{" "}
            {order.business.address.city} {order.business.address.state}{" "}
            {order.business.address.country},{order.business.address.pincode}
          </p>
          <div className="flex items-center mt-2">
            {/* <Package size={16} className="text-gray-400 mr-1" /> */}
            <span className="text-sm text-gray-600">
              {order.menu_items.length} items
            </span>
          </div>
          {/* <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.payment_status === 'success' 
                ? 'bg-green-100 text-green-800' 
                : order.payment_status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              {order.payment_status}
            </span>
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.order_status === 'delivered' 
                ? 'bg-green-100 text-green-800' 
                : order.order_status === 'in_transit' 
                  ? 'bg-blue-100 text-blue-800' 
                  : order.order_status === 'accepted' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.order_status.replace('_', ' ')}
            </span>
          </div> */}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">Rs{order.amount}</p>
          {/* <p className="text-sm text-gray-500">{order.payment_method.toUpperCase()}</p> */}
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => onViewDetails(order)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <EyeIcon className="mr-1" /> View Details
        </button>

        {order?.request_for_driver && onTrackOrder && (
          <button
            onClick={() => onTrackOrder(order)}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200 flex items-center"
          >
            <LocationMarkerIcon className="mr-1" />
            Track
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
