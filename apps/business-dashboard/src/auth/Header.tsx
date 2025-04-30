"use client";

export default function Header({
  heading,
  paragraph,
  linkName,
  user,
  linkUrl = "#",
}: any) {
  return (
    <div className="px-6 sm:px-8">
      <div className="flex justify-center">
        <svg
          className="h-16 w-48 sm:h-20 sm:w-56 transition-transform duration-300 hover:scale-105"
          viewBox="0 0 200 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="100"
            y="50"
            textAnchor="middle"
            fontSize="36"
            fontWeight="700"
            fill="#166534"
            fontFamily="'Inter', sans-serif"
            letterSpacing="-0.5"
          >
            FoodBridge
          </text>
          <path
            d="M60 60 C80 50, 120 50, 140 60"
            stroke="#22C55E"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="60" cy="60" r="4" fill="#22C55E" />
          <circle cx="140" cy="60" r="4" fill="#22C55E" />
        </svg>
      </div>

      <h2 className="mt-6 text-center text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 tracking-tight">
        {heading}
      </h2>

      <p className="mt-4 text-center text-base sm:text-lg md:text-xl text-green-700/80 max-w-2xl mx-auto leading-relaxed">
        {paragraph}{" "}
        <a
          href={linkUrl}
          className="font-medium text-green-800 hover:text-green-600 underline underline-offset-8 transition-colors duration-300"
        >
          {linkName}
        </a>
      </p>
    </div>
  );
}
