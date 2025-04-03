import { useState } from "react";
import Image from "next/image";

type FoodItem = {
  id: number;
  charityName: string;
  foodName: string;
  quantity: string;
  deliveryDate: string;
  deliveryTime: string;
};

const foodData: FoodItem[] = [
  {
    id: 1,
    charityName: "Helping Hands",
    foodName: "Apple",
    quantity: "5 kg",
    deliveryDate: "2025-01-25",
    deliveryTime: "10:00 AM",
  },
  {
    id: 2,
    charityName: "Care & Share",
    foodName: "Chicken",
    quantity: "10 kg",
    deliveryDate: "2025-01-24",
    deliveryTime: "12:30 PM",
  },
  {
    id: 3,
    charityName: "Food For All",
    foodName: "Rice",
    quantity: "20 kg",
    deliveryDate: "2025-01-22",
    deliveryTime: "3:00 PM",
  },
  {
    id: 4,
    charityName: "Fresh Start",
    foodName: "Carrot",
    quantity: "15 kg",
    deliveryDate: "2025-01-21",
    deliveryTime: "9:00 AM",
  },
];

const columns = [
  { header: "ID", accessor: "id" },
  { header: "Charity Name", accessor: "charityName", className: "hidden md:table-cell" },
  { header: "Food Name", accessor: "foodName", className: "hidden md:table-cell" },
  { header: "Quantity", accessor: "quantity", className: "hidden md:table-cell" },
  { header: "Delivery Date", accessor: "deliveryDate", className: "hidden lg:table-cell" },
  { header: "Delivery Time", accessor: "deliveryTime", className: "hidden lg:table-cell" },
];

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};

const PastHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = foodData.filter(
    (item) =>
      item.charityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderRow = (item: FoodItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.charityName}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.foodName}</td>
      <td className="hidden md:table-cell">{item.quantity}</td>
      <td className="hidden lg:table-cell">{item.deliveryDate}</td>
      <td className="hidden lg:table-cell">{item.deliveryTime}</td>
    </tr>
  );

  return (
    <div className="bg-white p-4 mt-7 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">History</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <img src="/images/search.webp" alt="" width={14} height={14} />
            <input
              type="text"
              placeholder="Search..."
              className="w-[200px] p-2 bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={currentData} />
      <div className="p-4 flex items-center justify-between text-gray-500">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <div className="flex items-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-2 rounded-full ${currentPage === i + 1 ? "bg-purple-500 text-center text-gray-800" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastHistory;