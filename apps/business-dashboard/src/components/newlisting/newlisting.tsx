"use client";

import React, { useState } from "react";

const NewListing = () => {
  // const [foodName, setFoodName] = useState("");
  // const [foodType, setFoodType] = useState("");
  // const [quantity, setQuantity] = useState("");
  // const [preparedDate, setPreparedDate] = useState("");
  // const [expiryDate, setExpiryDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // const handleSubmit = () => {
  //   Handle form submission logic here
  //   console.log({
  //     foodName,
  //     foodType,
  //     quantity,
  //     preparedDate,
  //     expiryDate,
  //     image,
  //   });
  // };

  return (
    <>
      <main className="flex items-center justify-center p-5">
        <section className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
          <header className="text-xl font-medium text-center text-gray-800">
            Create New Listing
          </header>
          <form action="#" className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700">Food Name</label>
              <input
                type="text"
                placeholder="Enter the food name"
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Food Type</label>
              <select
                name="foodType"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select Food Type</option>
                <option value="raw-fruits">Raw Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="curry">Curry</option>
                <option value="cooked-rice">Cooked Rice</option>
                <option value="grains">Grains</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter food quantity"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Prepared Date and Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  min="1"
                  placeholder="Enter food quantity"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-gray-700">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 mt-6 text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Submit
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default NewListing;
