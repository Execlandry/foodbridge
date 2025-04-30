"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Address {
  name: string;
  city: string;
  state: string;
  street: string;
  pincode: string;
  country: string;
}

interface RestaurantForm {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  contact_no: string;
  banner: File | string;
  opens_at: string;
  closes_at: string;
  address: Address;
}

async function Coordinates(addressObj: Address) {
  const { name, street, city, state, country, pincode } = addressObj;
  const address = encodeURIComponent(
    `${name}, ${street}, ${city}, ${state}, ${country}, ${pincode}`
  );
  const apiKey = "pk.00118eabe58a823ba3c1eddccba9eda9";
  const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${address}&format=json`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "foodbridge-main",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error("No coordinates found for the given address");
    }

    return {
      lat: data[0].lat,
      long: data[0].lon,
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("Fetch timed out.");
    } else {
      console.error("Error fetching coordinates:", error.message);
    }
    return null;
  }
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("filename", file);

  try {
    const response = await fetch("http://localhost:3008/api/v1/files", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Image upload failed! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data:", data);
    if (!data[0].url) {
      throw new Error("No URL returned from image upload");
    }

    return data[0].url;
  } catch (error: any) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
}

export default function AddRestaurant() {
  const [formData, setFormData] = useState<RestaurantForm>({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    contact_no: "",
    banner: "",
    opens_at: "",
    closes_at: "",
    address: {
      name: "",
      city: "",
      state: "",
      street: "",
      pincode: "",
      country: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, banner: file }));
    }
  };

  const sendData = async (data: RestaurantForm): Promise<any> => {
    try {
      const dataToSend = {
        ...data,
        // banner: typeof data.banner === "string" ? data.banner : "", // Ensure banner is a string
        latitude: String(data.latitude),
        longitude: String(data.longitude),
      };
      console.log("Data to send:", dataToSend);
      const res = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Get coordinates
      const coords = await Coordinates(formData.address);

      // Step 2: Upload image if a file is selected
      let bannerUrl = "";
      if (formData.banner instanceof File) {
        bannerUrl = await uploadImage(formData.banner);
      } else if (typeof formData.banner === "string") {
        bannerUrl = formData.banner;
      } else {
        throw new Error("No valid banner image provided");
      }

      // Step 3: Update form data with coordinates and banner URL
      const updatedFormData = {
        ...formData,
        latitude: coords?.lat || formData.latitude,
        longitude: coords?.long || formData.longitude,
        banner: bannerUrl,
      };
      console.log("Updated form data:", updatedFormData);
      // Step 4: Submit the form data
      await sendData(updatedFormData);

      // Reset form
      setFormData({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        contact_no: "",
        banner: "",
        opens_at: "",
        closes_at: "",
        address: {
          name: "",
          city: "",
          state: "",
          street: "",
          pincode: "",
          country: "",
        },
      });
      router.push("/dashboard/businesses?success=true");
    } catch (error: any) {
      setError(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              Add New Restaurant
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact & Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Contact & Hours
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact_no"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="tel"
                      id="contact_no"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="banner"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Banner
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="file"
                      id="banner"
                      name="banner"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="opens_at"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Opens At
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="datetime-local"
                      id="opens_at"
                      name="opens_at"
                      value={formData.opens_at}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="closes_at"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Closes At
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="datetime-local"
                      id="closes_at"
                      name="closes_at"
                      value={formData.closes_at}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {["name", "street", "city", "state", "pincode", "country"].map(
                  (field) => (
                    <div key={field}>
                      <label
                        htmlFor={`address.${field}`}
                        className="block text-sm font-medium text-gray-700 capitalize"
                      >
                        {field}
                      </label>
                      <input
                        type="text"
                        id={`address.${field}`}
                        name={`address.${field}`}
                        value={(formData.address as any)[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 rounded-md text-white font-medium transition-all duration-200 ${
                  isSubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                }`}
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                {isSubmitting ? "Submitting..." : "Add Restaurant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
