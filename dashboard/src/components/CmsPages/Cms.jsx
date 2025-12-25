import React from "react";
import { FiEdit, FiImage, FiFilter, FiPlus } from "react-icons/fi";
import { TbClockEdit } from "react-icons/tb";


const Cms = () => {
  const sliders = [
    { title: "Slider 2" },
    { title: "Slider 3" },
    { title: "Wscubetech" },
    { title: "Sabir 1" },
  ];

  return (
    <div className="max-w-full bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Cms Listing</h1>
          <p className="text-sm text-gray-500">
            <span className="text-blue-600 cursor-pointer hover:underline">
              Dashboard
            </span>{" "}
            / CMS
          </p>
        </div>

      
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700 border-t border-gray-200 ">
          <thead className="bg-blue-500 text-white text-sm border-2">
            <tr>
              <th className="px-4 py-2 border-r border-blue-400 w-16 text-center ">
                S.No
              </th>
              <th className="px-4 py-2 border-r border-blue-400">Title</th>
              <th className="px-4 py-2 text-center w-30">Action</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((item, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-center border-r border-gray-100">
                  {i + 1}
                </td>
                <td className="px-4 py-2 border-r border-gray-100">
                  {item.title}
                </td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100">
                    <TbClockEdit size={20} className=" bg-amber-500 rounded-full"/>
                  </button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
          <p>Showing 1 to {sliders.length} of {sliders.length} entries</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-400 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cms;
