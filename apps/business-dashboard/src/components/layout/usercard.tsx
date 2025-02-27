
const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl bg-purple-300 hover:bg-purple-500  p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <img src="/images/more.webp" alt="More icon" width={20} height={20} />

      </div>
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h2 className="capitalize text-sm font-medium text-gray-800 ">{type}</h2>
    </div>
  );
};

export default UserCard;
