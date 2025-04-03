"use client"
import React, { useState } from 'react';
import {  
  ViewGridIcon  ,   // Closest to UtensilsCrossed  
  DocumentTextIcon,  // Closest to Type  
  TagIcon,  
  AcademicCapIcon,   // Alternative for Coffee (symbolic)  
  LightBulbIcon,     // Closest available Battery icon         
  CloudIcon,         // Alternative to Leaf  
  CurrencyDollarIcon, // Represents currency/money  
  CameraIcon         // Alternative for Photo  
} from "@heroicons/react/solid";
import { send } from 'process';




function App({params}:any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: '',
    meal_type: '',
    category: '',
    ingredients: '',
    food_type: '',
    price: '',
    thumbnails: ''
  });

  const {id}=params;

    const sendData = async () => {
      try {
        console.log(formData);
        const res = await fetch(`/api/business/${id}`, {
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
    sendData();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">
          Add Food Item
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ViewGridIcon className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dish Name"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-purple-500" />
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={3}
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TagIcon className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="text"
              name="cuisine_type"
              value={formData.cuisine_type}
              onChange={handleChange}
              placeholder="Cuisine Type"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AcademicCapIcon className="h-5 w-5 text-purple-500" />
            </div>
            <select
              name="meal_type"
              value={formData.meal_type}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select Meal Type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LightBulbIcon className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CloudIcon className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Ingredients"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ViewGridIcon className="h-5 w-5 text-purple-500" />
            </div>
            <select
              name="food_type"
              value={formData.food_type}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select Food Type</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CameraIcon className="h-5 w-5 text-purple-500" />
            </div>
            <input
              type="url"
              name="thumbnails"
              value={formData.thumbnails}
              onChange={handleChange}
              placeholder="Thumbnail URL"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Food Item
          </button>
        </form>
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

// export default function AddBusinessMenu({ params }: any) {

//   const { data: session } = useSession();
//   const user = session?.user;
//   const router = useRouter();
//   const {id} = params;
  
//   // console.log(params);
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

