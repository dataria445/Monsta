import React from "react";

const ColorFilters = ({onClose}) => {
  return (
    <div className="max-w-full mx-auto grid md:grid-cols-4 grid-cols-1 bg-white border rounded-lg shadow-sm p-4 gap-4 items-center">
      
      {/* Name Input */}
      <input
        type="text"
        placeholder="Name"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />


      {/* Buttons at the END */}
      <div className="flex justify-end gap-4 w-full ">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center whitespace-nowrap">
          Filter Color
        </button>

        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md whitespace-nowrap">
          Clear
        </button>
        <button className="bg-green-200 hover:bg-geen-300 text-gray-800 px-5 py-2 rounded-md whitespace-nowrap" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ColorFilters;
