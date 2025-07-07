import React from "react";
import { Order } from "./Orders";
import OrderCard from "./OrderCard";
import { InboxIcon } from "@heroicons/react/outline";

interface OrderListProps {
  orders: Order[] | null;
  title: string;
  emptyMessage: string;
  onViewDetails: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  title,
  emptyMessage,
  onViewDetails,
  onTrackOrder,
}) => {
  const isEmpty = !orders || orders.length === 0;

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8">
      {isEmpty ? (
        <div className="bg-white/60 backdrop-blur-sm border border-dashed border-gray-300 rounded-2xl py-16 px-8 text-center shadow-xl transition-all duration-300">
          <div className="flex justify-center mb-4">
            <InboxIcon className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
              onTrackOrder={onTrackOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
