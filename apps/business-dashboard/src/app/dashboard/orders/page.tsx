"use client";

import { useSession } from "next-auth/react";
import OrderList from "./OrderList";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderTrackingModal from "./OrderTrackingModal";
import { useEffect, useState } from "react";
import { Order } from "./Orders";

export default function Restaurants() {
  const { data: session } = useSession();
  const user = session?.user;
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] =
    useState<Order | null>(null);
  const [orderData, setorderData] = useState<Order[] | null>(null);
  // const [businessData, setBusinessData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pendingOrders, setpendingOrders] = useState<Order[] | null>(null);
  // const [completedOrders, setCompletedOrders] = useState<Order[]|null>(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/order");
      console.log(res);
      const data = await res.json();
      setorderData(data);
    } catch (error: any) {
      console.error("Failed to fetch Orders:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (orderData && Array.isArray(orderData)) {
      setpendingOrders(orderData.filter((order: Order) => order));
      // setCompletedOrders(
      //   orderData.filter((order: Order) => order.order_status === "delivered")
      // );
    }
    console.log(orderData);
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
          order_id={selectedTrackingOrder?.id}
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}
    </div>
  );
}
