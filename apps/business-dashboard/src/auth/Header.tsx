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
        <div className="flex-shrink-0">
          <h2
            className="text-2xl font-extrabold text-green-600 tracking-tight cursor-pointer hover:text-green-700 transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/")}
          >
            Foodbridge
          </h2>
        </div>
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
