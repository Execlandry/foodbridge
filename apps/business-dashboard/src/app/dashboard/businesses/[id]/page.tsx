"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Business } from "@fbe/types";
import { useEffect, useState } from "react";
import { PlusIcon, XIcon } from "@heroicons/react/solid";

export default function BusinessDetails({ params }: any) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { id } = params;

  const [business, setBusiness] = useState<Business>({});
  const [menuItem, setMenuItem] = useState<any>([]);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const AddDishes = () => {
    router.push(`/dashboard/businesses/${id}/add`);
  };

  const fetchBusiness = async () => {
    const res = await fetch(`/api/business/${id}`);
    const data = await res.json();
    setBusiness(data);

    const items = [];
    const dishData = data.dishes;
    for (const i in dishData) {
      items.push({
        key: i,
        value: dishData[i],
      });
    }
    setMenuItem(items);
    console.log(items);
  };

  const openModal = (dish: any) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDish(null);
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 tracking-tight">
              {business?.name || "Restaurant Name"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-green-700/80 font-medium leading-relaxed">
              {business?.description || "Restaurant Description"}
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 font-semibold transition-colors duration-300"
            onClick={AddDishes}
          >
            <PlusIcon className="h-5 w-5" />
            Add Dishes
          </button>
        </div>

        {/* Menu Items Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuItem && menuItem.length > 0 ? (
            menuItem.map((data: any) => (
              <div
                key={data.value.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100 overflow-hidden"
              >
                <img
                  className="w-full h-48 sm:h-56 object-cover rounded-t-xl"
                  src={data.value.thumbnails}
                  alt={data.value.name}
                />
                <div className="p-4 sm:p-6">
                  <h5 className="text-xl sm:text-2xl font-bold text-green-900 tracking-tight">
                    {data.value.name}
                  </h5>
                  <p className="mt-2 text-sm sm:text-base text-green-700/80 line-clamp-3">
                    {data.value.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-green-600 font-semibold text-sm">
                      {data.value.food_type} • {data.value.quantity}{" "}
                      {data.value.quantity_unit} available
                    </span>
                    <button
                      onClick={() => openModal(data.value)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 transition-colors duration-300"
                    >
                      View Details
                      <svg
                        className="w-3.5 h-3.5 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
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
                No menu items available. Add dishes to get started!
              </p>
            </div>
          )}
        </div>

        {/* Modal for Dish Details */}
        {isModalOpen && selectedDish && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto p-6 sm:p-8 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-green-900 hover:text-green-700"
              >
                <XIcon className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-bold text-green-900 mb-6">
                Dish Details
              </h3>
              <div className="space-y-4">
                <img
                  src={selectedDish.thumbnails}
                  alt={selectedDish.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Dish Name
                  </h4>
                  <p className="text-green-700">{selectedDish.name}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Description
                  </h4>
                  <p className="text-green-700">{selectedDish.description}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Business
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.business?.name || "N/A"}
                    {selectedDish.business?.description && (
                      <span> - {selectedDish.business.description}</span>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Food Type
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.food_type || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Ingredients
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.ingredients || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Quantity
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.quantity} {selectedDish.quantity_unit || ""}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Status
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.status || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Notes
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.notes || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Posted At
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.posted_at
                      ? new Date(selectedDish.posted_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Expires At
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.expires_at
                      ? new Date(selectedDish.expires_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Created At
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.created_at
                      ? new Date(selectedDish.created_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Updated At
                  </h4>
                  <p className="text-green-700">
                    {selectedDish.updated_at
                      ? new Date(selectedDish.updated_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">
                    Thumbnail
                  </h4>
                  <a
                    href={selectedDish.thumbnails}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    View Image
                  </a>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
