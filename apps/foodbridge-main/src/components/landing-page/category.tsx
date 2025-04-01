import React from 'react';
import { categories } from '../../data/data.js';

const Category = () => {
  return (
    <section className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 text-center mb-12 tracking-tight">
        Top Rated Menu Items
      </h1>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
        {categories.map((item, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl p-5 flex flex-col sm:flex-row justify-between items-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer border border-gray-100"
          >
            <h2 className="font-bold text-lg sm:text-xl text-gray-800 group-hover:text-orange-600 transition-colors duration-300 mb-3 sm:mb-0">
              {item.name}
            </h2>
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Optional Call-to-Action */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1">
          Explore All Categories
        </button>
      </div>
    </section>
  );
};

export default Category;