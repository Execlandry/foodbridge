"use client";

import { useState } from "react";

type FoodItem = {
  id: number;
  foodName: string;
  foodType: string;
  quantity: string;
  preparedDate: string;
  expiryDate: string;
  status: string;
};

const foodData: FoodItem[] = [
  {
    id: 1,
    foodName: "Apple",
    foodType: "Fruits",
    quantity: "5 kg",
    preparedDate: "2025-01-25",
    expiryDate: "2025-02-10",
    status: "Available",
  },
  {
    id: 2,
    foodName: "Chicken",
    foodType: "Meat",
    quantity: "10 kg",
    preparedDate: "2025-01-24",
    expiryDate: "2025-02-05",
    status: "Available",
  },
  {
    id: 3,
    foodName: "Rice",
    foodType: "Grains",
    quantity: "20 kg",
    preparedDate: "2025-01-22",
    expiryDate: "2025-01-29",
    status: "Expired",
  },
  {
    id: 4,
    foodName: "Carrot",
    foodType: "Vegetables",
    quantity: "15 kg",
    preparedDate: "2025-01-21",
    expiryDate: "2025-02-02",
    status: "Available",
  },
];

const FoodListingPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Filter food data based on search query
  const filteredFoodData = foodData.filter(
    (item) =>
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quantity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRow = (item: FoodItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="flex items-center gap-4 p-4">
        <h3 className="font-semibold">{item.foodName}</h3>
      </td>
      <td className="hidden md:table-cell">{item.foodType}</td>
      <td className="hidden md:table-cell">{item.quantity}</td>
      <td className="hidden lg:table-cell">{item.preparedDate}</td>
      <td className="hidden lg:table-cell">{item.expiryDate}</td>
      <td className="hidden lg:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-300"
          >
            <img
              src="/images/show.png"
              alt=""
              width={16}
              height={16}
              className="rounded-full"
            />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-300">
            <img
              src="/images/delete.png"
              alt=""
              width={16}
              height={16}
              className="rounded-full" // This ensures the image itself is round
            />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Food Listings</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <img src="/images/search.webp" alt="" width={14} height={14} />
            <input
              type="text"
              placeholder="Search..."
              className="w-[200px] p-2 bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
        </div>
      </div>
      {/* LIST */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            <th className="hidden md:table-cell">Sr. No</th>
            <th>Food Name</th>
            <th className="hidden md:table-cell">Food Type</th>
            <th className="hidden md:table-cell">Quantity</th>
            <th className="hidden lg:table-cell">Prepared Date</th>
            <th className="hidden lg:table-cell">Expiry Date</th>
            <th className="hidden lg:table-cell">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoodData.map((item) => (
            <>
              {renderRow(item)}
              {expandedRow === item.id && (
                <tr className="bg-gray-50">
                  <td colSpan={8} className="p-4 border-t">
                    <div className="flex flex-col gap-2">
                      <p><strong>Food Name:</strong> {item.foodName}</p>
                      <p><strong>Food Type:</strong> {item.foodType}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Prepared Date:</strong> {item.preparedDate}</p>
                      <p><strong>Expiry Date:</strong> {item.expiryDate}</p>
                      <p><strong>Status:</strong> {item.status}</p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {/* PAGINATION (commented out) */}
      {/* 
      <div className="p-4 flex items-center justify-between text-gray-500">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <div className="flex items-center gap-2 text-sm">
          {Array.from(
            { length: Math.ceil(filteredFoodData.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-2 rounded-full item-center ${
                  currentPage === i + 1 ? "bg-purple-300" : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredFoodData.length / itemsPerPage)}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      */}
    </div>
  );
};

export default FoodListingPage;