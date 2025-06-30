import React from "react";

function Hero() {
  return (
    <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative max-h-[600px] overflow-hidden rounded-2xl shadow-2xl shadow-gray-200/50">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 flex flex-col justify-center items-start sm:items-start text-center sm:text-left z-10">
          <div className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 text-white animate-fade-in-up space-y-4 w-full sm:w-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-snug sm:leading-tight tracking-tight drop-shadow-lg">
              Bridging{" "}
              <span className="text-green-500 bg-green-500/20 px-2 py-1 rounded-full">
                Surplus
              </span>
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-snug sm:leading-tight tracking-tight drop-shadow-lg">
              <span className="text-green-500 bg-green-500/20 px-2 py-1 rounded-full">
                Food
              </span>{" "}
              to Those in Need
            </h1>
            <p className="mt-1 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-sm sm:max-w-md md:max-w-2xl mx-auto sm:mx-0 font-medium drop-shadow-md">
              Connecting businesses with excess food to charities and communities in need
            </p>
            <div className="flex justify-center sm:justify-start">
              <button className="mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 bg-green-500 text-white rounded-md sm:rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black/50 transition-all duration-300 transform hover:-translate-y-1">
                Get Involved
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <img
          className="w-full h-[300px] sm:h-auto object-cover object-center transition-transform duration-1000 ease-out transform hover:scale-105"
          src="./landing-image.jpg"
          alt="Volunteers distributing food"
          loading="lazy"
        />
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Hero;
