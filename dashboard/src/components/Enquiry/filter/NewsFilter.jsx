import React, { useState } from "react";


const NewsFilter = ({onClose}) => {
 

  return (
    <div className="max-w-full mx-auto bg-white border rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center justify-start">
      {/* Select Date Range */}
      <select
        className="w-[23%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue=""
      >
        <option value="" disabled>
          Choose Date Range
        </option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last7">Last 7 Days</option>
        <option value="last30">Last 30 Days</option>
        <option value="thisMonth">This Month</option>
        <option value="lastMonth">Last Month</option>
        <option value="thisYear">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Name"
        className="w-[23%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Code Input */}
      <input
        type="text"
        placeholder="Code"
        className="w-[23%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Buttons */}
      <div className="flex gap-5">
        {/* Filter Button */}
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center whitespace-nowrap"
        >
          Filter Testimonial
        </button>

        {/* Close Button */}
        <button
          type="button"
          className="bg-green-200 hover:bg-green-500 text-gray-900 px-5 py-2 rounded-md whitespace-nowrap"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NewsFilter;
