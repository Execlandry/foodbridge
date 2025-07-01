import React from "react";
import {
  XIcon,
  MapIcon,
  PhoneIcon,
  GlobeAltIcon,
  StarIcon,
  CurrencyDollarIcon,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={restaurant.banner}
            alt={restaurant.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </h2>
              <p className="text-gray-600">{restaurant.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {restaurant.average_rating && (
                <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                  <StarIcon className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">
                    {restaurant.average_rating}
                  </span>
                </div>
              )}
              <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                <CurrencyDollarIcon className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-blue-600 font-medium">
                  ${restaurant.average_price}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* <div className="flex items-start space-x-2">
                <MapIcon className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    {restaurant.address.street}, {restaurant.address.city}<br />
                    {restaurant.address.state}, {restaurant.address.country}<br />
                    {restaurant.address.pincode}
                  </p>
                </div>
              </div> */}

              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Contact</h3>
                  <p className="text-gray-600">{restaurant.contact_no}</p>
                </div>
              </div>

              {restaurant.website_url && (
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Website</h3>
                    <a
                      href={restaurant.website_url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Services</h3>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    Delivery: {restaurant.delivery_options}
                  </p>
                  <p className="text-gray-600">
                    Pickup: {restaurant.pickup_options}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                title="Restaurant Location"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.longitude},${restaurant.latitude},${restaurant.longitude},${restaurant.latitude}&layer=mapnik&marker=${restaurant.latitude},${restaurant.longitude}`}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
