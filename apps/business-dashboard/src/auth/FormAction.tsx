"use client";

export default function FormAction({
  handleSubmit,
  type = "Button",
  action = "submit",
  text,
  customClass = "",
}: any) {
  return (
    <>
      {type === "Button" ? (
        <button
          type={action}
          className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-200 transition-colors duration-300 mt-8 ${customClass}`}
          onSubmit={handleSubmit}
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
