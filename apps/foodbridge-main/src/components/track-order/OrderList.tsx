import React from "react";
import { Order } from "../types/Orders";
import OrderCard from "./OrderCard";

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
  if (orders?.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {orders?.map((order: any) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={onViewDetails}
            onTrackOrder={onTrackOrder}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
