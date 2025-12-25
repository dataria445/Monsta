import React from "react";

const CategoryFilters = () => {
  return (
    <div className="max-w-full  mx-auto bg-white  rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
      {/* Name Input */}
      <select
        className="w-1/3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue=""
      >
        <option value="" disabled>
          Select Categories
        </option>
        <option value="living">Living</option>
        <option value="sofa">Sofa</option>
      </select>

        <input
        type="text"
        placeholder="Name"
        className="w-1/3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filter Button */}
      <div className="flex gap-8">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center whitespace-nowrap">
        🔍 Filter Categories
      </button>

      {/* Clear Button */}
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md whitespace-nowrap">
        Clear
      </button>
      </div>
    </div>
  );
};

export default CategoryFilters;
