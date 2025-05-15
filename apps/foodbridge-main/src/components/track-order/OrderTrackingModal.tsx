import React, { useState, useEffect,useContext } from "react";
import { Order } from "../types/Orders";
import { useDispatch, useSelector } from "react-redux";
import { UserContext, UserContextType } from "../../hooks/user-context";
import { XIcon } from "@heroicons/react/solid";
import Map from "./map";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/use-auth";

import {
  FetchCurrentOrder,
  OrderSelector,
} from "../../redux/delivery/delivery.slice";

interface OrderTrackingModalProps {
  order_id: string;
  onClose: () => void;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order_id,
  onClose,
}) => {
  const [Coordinates, setCoordinates] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useContext(UserContext) as UserContextType;
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(FetchCurrentOrder(order_id));
  }, [dispatch]);

  const { data: orderData } = useSelector(OrderSelector);

  useEffect(() => {
    setCoordinates([
      { lat: Number(orderData.order.address.lat), lng:Number(orderData.order.address.lat) },
      {
        lat: Number(orderData.order.business.latitude),
        lng: Number(orderData.order.address.longitude),
      },
      {
        lat: Number(orderData.current_location.lat),
        lng: Number(orderData.current_location.long),
      },
    ]);
  }, [orderData]);
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 opacity-100`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative w-full h-full bg-white shadow-xl transition-transform duration-300 scale-100`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close map"
        >
          <XIcon className="text-gray-700" />
        </button>
        <div className="w-full h-full">
          {Coordinates && <Map coordinates={Coordinates} />}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
