"use client"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  MapIcon, // Closest alternative to MapPinIcon
  ClockIcon,
  PhoneIcon,
  CameraIcon, // PhotoIcon does not exist; use ImageIcon
  CurrencyDollarIcon,
  TruckIcon,
  ShoppingBagIcon, // Closest alternative to BuildingStorefrontIcon
  PhotographIcon
} from "@heroicons/react/solid";
import { BaseNextResponse } from 'next/dist/server/base-http';
import { send } from 'process';
import { json } from 'stream/consumers';


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
  average_price: string;
  latitude: string;
  longitude: string;
  contact_no: string;
  banner: File|string ;  
  delivery_options: string;
  pickup_options: string;
  opens_at: string;
  closes_at: string;
  address: Address;
}


function App() {
  const [formData, setFormData] = useState<RestaurantForm>({
    name: '',
    description: '',
    average_price: '',
    latitude: '',
    longitude: '',
    contact_no: '',
    banner: '',
    delivery_options: 'all',
    pickup_options: 'all',
    opens_at: '',
    closes_at: '',
    address: {
      name: '',
      city: '',
      state: '',
      street: '',
      pincode: '',
      country: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setFormData(prev => ({ ...prev, banner: file }));
      console.log("Selected file:", file);
    }
  };
  

  const sendData = async () => {
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data=await res.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    sendData(); // Call the function properly
  };
  
  const { data: session } = useSession();
    const user = session?.user;
  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Add New Restaurant</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Average Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="average_price"
                      value={formData.average_price}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact & Hours</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CameraIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
  <label className="block text-sm font-medium text-gray-700">Upload Banner</label>
  <div className="mt-1 relative rounded-md shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <CameraIcon className="h-5 w-5 text-gray-400" /> {/* Changed icon */}
    </div>
    <input
      type="file"
      name="banner"
      accept="image/*" // Accepts only image files
      onChange={handleFileChange} // Updated onChange handler
      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
      required
    />
  </div>
</div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opens At</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="opens_at"
                      value={formData.opens_at}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Closes At</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="closes_at"
                      value={formData.closes_at}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Pickup Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Service Options</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Options</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TruckIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="delivery_options"
                      value={formData.delivery_options}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="all">All</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pickup Options</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TruckIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="pickup_options"
                      value={formData.pickup_options}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="all">All</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address.name"
                      value={formData.address.name}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Add Restaurant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
// "use client";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useForm, useWatch, Control } from "react-hook-form";
// import { useRef, useState } from "react";
// import ImagePreview from "@components/common/Imagepreview";
// import CustomFileSelector from "@components/common/FileSelctor";


// function Error({ message }: { message: string }) {
//     return (
//         <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">
//             {message}
//         </div>
//     );
// }

// export default function AddBusiness() {
//   const { register, handleSubmit, watch, formState: {errors} } = useForm<any>();
//   const [images, setImages] = useState<File[]>([]);
//   const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       //convert `FileList` to `File[]`
//       const _files = Array.from(e.target.files);
//       // do the upload here to AWS S3
//       // upload these files to AWS S3 after getting signe durl for upload 
//       setImages(_files);
//     }
//   };
//   const { data: session } = useSession();
//   const user = session?.user;
//   const router = useRouter();

//   const onSubmit = (data: any) => {
//     console.log(data)
//   }

//   // list of businesses
//   return (
//     <>  <div
//     className=" h-screen w-full items-center ">
//     <form onSubmit={handleSubmit(onSubmit)} className="flex w-2/3 flex-col gap-2 rounded-lg  p-8 shadow">
//         <label htmlFor="email">Business Name</label>
//         <input
//             className="rounded border border-neutral-200  p-1"
//             type="name"
//             id="name"
//             name="name"
//             {...register("name", {
//               required: { value: true, message: 'name Required' },
//             })}
            
//         />
//          {errors.name && <Error message={errors.name.message!} />}


//         <label htmlFor="rest-desc">Business Desc</label>
//         <input
//             className="rounded border border-neutral-200  p-1"
//             type="text"
//             id="desc"
//             name="desc"
//             {...register("description", {
//               required: { value: true, message: 'desc Required' },
//             })}
//         />
//          {errors.description && <Error message={errors.description.message!} />}

//          <CustomFileSelector
//         accept="image/png, image/jpeg"
//         onChange={handleFileSelected}
//       />
//       <ImagePreview images={images} />

//         <label htmlFor="business-logo">Business Logo</label>
//         <input
//             className="rounded border border-neutral-200  p-1"
//             type="text"
//             id="logo"
//             name="logo"
//             {...register("logo", {
//               required: { value: true, message: 'logo Required' },
//             })}
//         />
//         {errors.logo && <Error message={errors.logo.message!} />}


//         <label htmlFor="Type">Business Type</label>
//         <input
//             className="rounded border border-neutral-200  p-1"
//             type="text"
//             id="type"
//             name="type"
//             placeholder="business type"
//             {...register("type", {
//               required: { value: true, message: 'type Required' },
//             })}
//         />
//          {errors.type && <Error message={errors.type.message!} />}


//         <label htmlFor="cost for two">cost For Two</label>
//         <input
//             className="rounded border border-neutral-200  p-1"
//             type="text"
//             id="costfortwo"
//             name="costfortwo"
//             {...register("cost_for_two")}
//         />
//         <button className="mt-5 rounded bg-green-500 p-2 text-neutral-50    ">
//             Submit
//         </button>
//     </form>
// </div> </>
//   );
// }

