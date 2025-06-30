import React from "react";
import { FaUtensils, FaHandsHelping, FaSmile } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      icon: <FaUtensils size={40} className="text-green-500" />,
      title: "Food Donated",
      description:
        "Businesses donate their excess food through our platform.",
    },
    {
      icon: <FaHandsHelping size={40} className="text-green-500" />,
      title: "Collected & Matched",
      description:
        "We connect the donated food to local NGOs and distribution centers.",
    },
    {
      icon: <FaSmile size={40} className="text-green-500" />,
      title: "Delivered to People",
      description:
        "The food reaches the people who need it the most—on time and fresh.",
    },
  ];

  return (
    <section className="bg-white py-16 px-6 sm:px-8 lg:px-16 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800">
        How <span className="text-green-500">FoodBridge</span> Works
      </h2>
      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-gray-700 hover:shadow-lg transition-all p-6 rounded-xl border border-gray-100"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
