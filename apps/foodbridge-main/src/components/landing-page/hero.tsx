import React from 'react';

function Hero() {
  return (
    <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative max-h-[600px] overflow-hidden rounded-2xl shadow-2xl shadow-gray-200/50">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 flex flex-col justify-center items-start z-10">
          <div className="px-6 sm:px-8 md:px-12 text-white animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              Bridging <span className="text-green-500 bg-green-500/20 px-2 py-1 rounded-full">Surplus</span>
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              <span className="text-green-500 bg-green-500/20 px-2 py-1 rounded-full">Food</span> to Those in Need
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl font-medium drop-shadow-md">
              Connecting businesses with excess food to charities and communities in need
            </p>
            <button className="mt-6 px-8 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black/50 transition-all duration-300 transform hover:-translate-y-1">
              Get Involved
            </button>
          </div>
        </div>
        
        {/* Image */}
        <img
          className="w-full object-cover transition-transform duration-1000 ease-out transform hover:scale-105"
          src="./landing-image.jpg"
          alt="Volunteers distributing food"
          loading="lazy"
        />
      </div>

      {/* Custom Animation Keyframes */}
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
