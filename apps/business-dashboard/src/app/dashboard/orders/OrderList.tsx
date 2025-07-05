import React from "react";
import { Order } from "./Orders";
import OrderCard from "./OrderCard";
// import { PackageX } from 'lucide-react'; // Optional icon (install `lucide-react`)

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
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
        {title}
      </h2>

      {isEmpty ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl py-12 px-6 text-center shadow-inner transition">
          <div className="flex justify-center mb-4">
            {/* <PackageX className="w-10 h-10 text-gray-400" /> */}
          </div>
          <p className="text-gray-600 text-base font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
