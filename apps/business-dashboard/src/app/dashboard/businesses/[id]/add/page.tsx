"use client";

import React, { useState } from "react";
import {
  ViewGridIcon,
  DocumentTextIcon,
  TagIcon,
  CloudIcon,
  CameraIcon,
  ScaleIcon,
  CheckCircleIcon,
  CalendarIcon,
  AnnotationIcon,
} from "@heroicons/react/solid";

interface FoodItemForm {
  name: string;
  description: string;
  ingredients: string;
  food_type: string;
  quantity: number;
  quantity_unit: string;
  posted_at?: string;
  expires_at?: string;
  notes?: string;
  status: string;
  thumbnails: File | string;
}

function AddFoodItemForm({ params }: any) {
  const [formData, setFormData] = useState<FoodItemForm>({
    name: "paneer tikka masala",
    description:
      "Paneer tikka or Paneer Soola or Chhena Soola is an Indian dish made from chunks of paneer/chhena marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes. It is a popular dish that is widely available in India and countries with an Indian diaspora",
    ingredients: "ingredients",
    food_type: "vegan",
    quantity: 500,
    quantity_unit: "grams",
    posted_at: "",
    expires_at: "",
    notes: "",
    status: "available",
    thumbnails:
      "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/18301f1b90116218438a5e6a82336d15",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = params;

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("filename", file);

    try {
      const response = await fetch("http://localhost:3008/api/v1/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data[0].url) {
        throw new Error("No URL returned from image upload");
      }

      return data[0].url;
    } catch (error: any) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }

  const sendData = async (data: FoodItemForm) => {
    try {
      const dataToSend = {
        ...data,
        thumbnails: typeof data.thumbnails === "string" ? data.thumbnails : "",
        quantity: Number(data.quantity),
        posted_at: data.posted_at || undefined,
        expires_at: data.expires_at || undefined,
        notes: data.notes || undefined,
      };

      const res = await fetch(`/api/business/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Response:", responseData);
      return responseData;
    } catch (error: any) {
      throw new Error(`Error sending data: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let thumbnailUrl = "";
      if (formData.thumbnails instanceof File) {
        thumbnailUrl = await uploadImage(formData.thumbnails);
      } else if (typeof formData.thumbnails === "string") {
        thumbnailUrl = formData.thumbnails;
      } else {
        throw new Error("No valid thumbnail image provided");
      }

      const updatedFormData = {
        ...formData,
        thumbnails: thumbnailUrl,
      };

      await sendData(updatedFormData);

      setFormData({
        name: "",
        description: "",
        ingredients: "",
        food_type: "",
        quantity: 0,
        quantity_unit: "",
        posted_at: "",
        expires_at: "",
        notes: "",
        status: "available",
        thumbnails: "",
      });
    } catch (error: any) {
      setError(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnails: file,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-green-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6">
          Add Food Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Dish Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ViewGridIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dish Name"
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <DocumentTextIcon className="h-5 w-5 text-green-600" />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Ingredients
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CloudIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="text"
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Ingredients"
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="food_type"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Food Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-green-600" />
              </div>
              <select
                id="food_type"
                name="food_type"
                value={formData.food_type}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 bg-white appearance-none transition-colors duration-300"
                required
              >
                <option value="">Select Food Type</option>
                <option value="veg">Veg</option>
                <option value="non_veg">Non-Veg</option>
                <option value="vegan">Vegan</option>
                <option value="fast_food">Fast Food</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Quantity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ScaleIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="quantity_unit"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Quantity Unit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ScaleIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="text"
                id="quantity_unit"
                name="quantity_unit"
                value={formData.quantity_unit}
                onChange={handleChange}
                placeholder="Quantity Unit (e.g., grams)"
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div>

          {/* <div>
            <label htmlFor="posted_at" className="block text-sm font-medium text-green-900 mb-1">
              Posted At
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="datetime-local"
                id="posted_at"
                name="posted_at"
                value={formData.posted_at}
                onChange={handleChange}
                placeholder="Posted At"
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div> */}

          <div>
            <label
              htmlFor="expires_at"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Expires At
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="datetime-local"
                id="expires_at"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
                placeholder="Expires At"
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Notes
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <AnnotationIcon className="h-5 w-5 text-green-600" />
              </div>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes (e.g., Contains dairy and nuts)"
                rows={3}
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div>

          {/* <div>
            <label htmlFor="status" className="block text-sm font-medium text-green-900 mb-1">
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 bg-white appearance-none transition-colors duration-300"
                required
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="completed">Completed</option>
              </select>
            </div> */}
          {/* </div> */}

          <div>
            <label
              htmlFor="thumbnails"
              className="block text-sm font-medium text-green-900 mb-1"
            >
              Thumbnail Image
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CameraIcon className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="file"
                id="thumbnails"
                name="thumbnails"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-green-900 placeholder-green-400/50 transition-colors duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors duration-300 ${
              isSubmitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 inline-block text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {isSubmitting ? "Submitting..." : "Add Food Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFoodItemForm;
