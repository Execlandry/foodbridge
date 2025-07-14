import React from "react";
import {
  XIcon,
  MapIcon,
  PhoneIcon,
  GlobeAltIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import type { Restaurant } from "./business";

interface RestaurantPopupProps {
  restaurant: Restaurant;
  onClose: () => void;
  isOpen: boolean;
}

export function RestaurantPopup({
  restaurant,
  onClose,
  isOpen,
}: RestaurantPopupProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2 sm:p-4 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[75vh] overflow-y-auto shadow-xl transition-all">
        {/* Banner + Close */}
        <div className="relative">
          <img
            src={restaurant?.banner}
            alt={restaurant.name}
            className="w-full h-56 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <XIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {restaurant.name}
              </h2>
              <p className="text-gray-500">{restaurant.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {restaurant.average_rating && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <StarIcon className="w-4 h-4" />
                  {restaurant.average_rating}
                </div>
              )}
              {restaurant.is_available && (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                  Available
                </span>
              )}
            </div>
          </div>

          {/* Grid: Info + Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Section */}
            <div className="space-y-4 text-sm sm:text-base text-gray-700">
              <InfoBlock icon={MapIcon} title="Address">
                {restaurant.address?.street}, {restaurant.address?.city}
                <br />
                {restaurant.address?.state}, {restaurant.address?.country}
                <br />
                {restaurant.address?.pincode}
              </InfoBlock>

              <InfoBlock icon={PhoneIcon} title="Contact">
                {restaurant.contact_no}
              </InfoBlock>

              {restaurant.website_url && (
                <InfoBlock icon={GlobeAltIcon} title="Website">
                  <a
                    href={restaurant.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Visit Website
                  </a>
                </InfoBlock>
              )}

              <InfoBlock icon={ClockIcon} title="Timings">
                Opens: {formatDate(restaurant.opens_at)} <br />
                Closes: {formatDate(restaurant.closes_at)}
              </InfoBlock>

              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  Cuisine
                </h4>
                <p className="text-gray-600">
                  {restaurant.cuisine || "Not specified"}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-64 sm:h-72 rounded-xl overflow-hidden shadow">
              <iframe
                title="Location Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.longitude},${restaurant.latitude},${restaurant.longitude},${restaurant.latitude}&layer=mapnik&marker=${restaurant.latitude},${restaurant.longitude}`}
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
          </div>

          {/* Dishes */}
          {restaurant.dishes?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Dishes Offered
              </h3>
              <div className="space-y-6">
                {restaurant.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex flex-col sm:flex-row gap-4 bg-gray-50 border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <img
                      src={dish.thumbnails}
                      alt={dish.name}
                      className="w-full sm:w-36 sm:h-36 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-1 text-gray-700">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {dish.name}
                      </h4>
                      <p className="text-sm">{dish.description}</p>
                      <p className="text-sm text-gray-500">
                        Type:{" "}
                        <span className="capitalize">{dish.food_type}</span> |
                        Quantity: {dish.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires At: {formatDate(dish.expires_at)}
                      </p>
                      {dish.notes && (
                        <p className="text-sm text-gray-500">
                          Notes: {dish.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Helper Component for Reusable Info Blocks
const InfoBlock = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 mt-1 text-gray-500" />
    <div>
      <h4 className="font-medium text-gray-800 mb-0.5 text-sm">{title}</h4>
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  </div>
);
