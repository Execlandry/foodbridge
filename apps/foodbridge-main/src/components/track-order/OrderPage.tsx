import React, { useState, useEffect, useContext } from "react";
import { Order } from "../types/Orders";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  OrderItemsSelector,
} from "../../redux/order/order.slice";
import OrderList from "./OrderList";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderTrackingModal from "./OrderTrackingModal";
import { UserContext, UserContextType } from "../../hooks/user-context";
import useAuth from "../../hooks/use-auth";

// import { ShoppingBag, RefreshCw } from 'lucide-react';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { data: orderData } = useSelector(OrderItemsSelector);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext) as UserContextType;
  const { logoutUser } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] =
    useState<Order | null>(null);
  const [pendingOrders, setpendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  //   const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orderData && Array.isArray(orderData)) {
      setpendingOrders(
        orderData.filter((order: any) => order.order_status !== "delivered")
      );
      setCompletedOrders(
        orderData.filter((order: any) => order.order_status === "delivered")
      );
    }
  }, [orderData]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {/* <ShoppingBag size={28} className="text-blue-600 mr-2" /> */}
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        </div>

        <button
          className={`p-2 rounded-full hover:bg-gray-100 transition-all `}
          aria-label="Refresh orders"
        >
          {/* <RefreshCw size={20} className="text-gray-600" /> */}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
            Try Again
          </button>
        </div>
      ) : (
        <>
          <OrderList
            orders={pendingOrders}
            title="Active Orders"
            emptyMessage="You don't have any active orders."
            onViewDetails={setSelectedOrder}
            onTrackOrder={setSelectedTrackingOrder}
          />

          <OrderList
            orders={completedOrders}
            title="Completed Orders"
            emptyMessage="You don't have any completed orders."
            onViewDetails={setSelectedOrder}
          />
        </>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {selectedTrackingOrder && (
        <OrderTrackingModal
          order_id={selectedTrackingOrder.id}
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
