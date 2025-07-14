"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Business } from "@fbe/types";
import { useEffect, useState } from "react";
import { RestaurantPopup } from "@components/BusinessPopUp/BusinessPopUp";
import Image from "next/image";

export default function Restaurants() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBusiness = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/business");
      const data = await res.json();
      setBusinesses(data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectRestaurant = (data: Business) => {
    setBusinessData(data);
    setIsPopupOpen(true);
  };

  const openBusiness = (data: Business) => {
    router.push(`/dashboard/businesses/${data.id}`);
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white border border-gray-200 rounded-3xl shadow-sm">
      <div className="h-48 bg-green-100/30 rounded-t-3xl" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-green-100 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-green-100 rounded" />
          <div className="h-4 bg-green-100 rounded w-5/6" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-green-100 rounded-lg" />
          <div className="flex-1 h-10 bg-green-100 rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 px-4 sm:px-6 xl:px-20 py-12">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 tracking-tight mb-10 text-center sm:text-left">
          Explore Restaurants
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          ) : businesses.length > 0 ? (
            businesses.map((data: Business) => (
              <div
                key={data.id}
                className="group bg-white border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden rounded-t-3xl">
                  <Image
                    src={data.banner}
                    alt={data.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-green-900 truncate group-hover:text-green-600 transition-colors duration-300">
                    {data.name}
                  </h3>
                  <p className="text-sm text-green-700/80 line-clamp-2">
                    {data.description || "No description available"}
                  </p>

                  <div className="flex flex-wrap gap-y-3 gap-x-2 pt-2">
                    <button
                      onClick={() => openBusiness(data)}
                      className="flex-1 min-w-[130px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    >
                      View Dishes
                    </button>
                    <button
                      onClick={() => selectRestaurant(data)}
                      className="flex-1 min-w-[130px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 border border-green-600 rounded-full bg-gradient-to-r from-white to-green-50 hover:from-green-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-green-700 text-lg font-medium">
                No restaurants found
              </p>
            </div>
          )}
        </div>

        <RestaurantPopup
          restaurant={businessData}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </div>
    </div>
  );
}
