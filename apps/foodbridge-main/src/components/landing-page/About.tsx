import React from "react";

function About() {
  return (
    <section className="bg-gray-50 py-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          About <span className="text-green-500">FoodBridge</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
          FoodBridge is a non-profit initiative aimed at solving the global
          issue of food waste. We partner with restaurants, hotels, and
          grocery stores to redirect surplus food to shelters, NGOs, and
          communities who need it the most. Our goal is simple: ensure that
          no good food goes to waste while someone goes hungry.
        </p>
      </div>
    </section>
  );
}

export default About;
