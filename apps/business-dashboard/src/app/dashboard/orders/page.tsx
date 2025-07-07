"use client";

import { useSession } from "next-auth/react";
import OrderList from "./OrderList";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderTrackingModal from "./OrderTrackingModal";
import { useEffect, useState } from "react";
import { Order } from "./Orders";
import { Business } from "@fbe/types";
// import { RefreshCw } from "lucide-react";

export default function Restaurants() {
  const { data: session } = useSession();
  const user = session?.user;

  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] =
    useState<Order | null>(null);
  const [orderData, setOrderData] = useState<Order[] | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const busRes = await fetch("/api/business");
      if (!busRes.ok) throw new Error("Failed to fetch businesses");

      const busData: Business[] = await busRes.json();
      setBusinesses(busData);

      if (busData.length === 0) {
        setError("No businesses found.");
        return;
      }

      const id = busData[0].owner_id;
      const orderRes = await fetch(`/api/order/${id}`);
      if (!orderRes.ok) {
        const errText = await orderRes.text();
        throw new Error(errText);
      }

      const data: Order[] = await orderRes.json();
      setOrderData(data);
    } catch (error: any) {
      console.error("Failed to fetch Orders:", error);
      setError(error.message || "Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (orderData && Array.isArray(orderData)) {
      setPendingOrders(orderData.filter((order) => order));
    }
  }, [orderData]);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          My Orders
        </h1>

        <button
          onClick={fetchAllOrders}
          className="group flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
        >
          {/* <RefreshCw className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform" /> */}
          <span className="text-gray-700">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-green-500 animate-spin mb-4"></div>
          <p className="text-sm text-gray-500">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-md">
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={fetchAllOrders}
            className="mt-4 px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : (
        <OrderList
          orders={pendingOrders}
          title="Active Orders"
          emptyMessage="You don't have any active orders at the moment."
          onViewDetails={setSelectedOrder}
          onTrackOrder={setSelectedTrackingOrder}
        />
      )}

      {/* Modals */}
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
}
