"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Business } from "@fbe/types";
import { useEffect, useState } from "react";
import { RestaurantPopup } from "@components/BusinessPopUp/BusinessPopUp";
import Image from "next/image";

export default function Restaurants() {
  const { data: session } = useSession();
  const user = session?.user;
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
    <div className="animate-pulse bg-white border border-green-100 rounded-2xl shadow-md">
      <div className="h-48 bg-green-100/50 rounded-t-2xl"></div>
      <div className="p-5 space-y-4">
        <div className="h-6 bg-green-100 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-green-100 rounded"></div>
          <div className="h-4 bg-green-100 rounded w-5/6"></div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-green-100 rounded-lg"></div>
          <div className="flex-1 h-10 bg-green-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-8 tracking-tight">
          Explore Restaurants
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          ) : businesses.length > 0 ? (
            businesses.map((data: Business) => (
              <div
                key={data.id}
                className="group bg-white border border-green-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <Image
                    src={data.banner}
                    alt={data.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="33vw"
                    priority
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2 truncate group-hover:text-green-600 transition-colors duration-300">
                    {data.name}
                  </h3>
                  <p className="text-green-700/80 text-sm mb-4 line-clamp-2">
                    {data.description || "No description available"}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => openBusiness(data)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                    >
                      View Dishes
                      <svg
                        className="w-4 h-4 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => selectRestaurant(data)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                    >
                      View Profile
                      <svg
                        className="w-4 h-4 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-green-700/80 text-lg font-medium">
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
