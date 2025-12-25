import React from "react";
import { useNavigate } from "react-router-dom";

const ContactFilters = ({onClose}) => {

  return (
    <div className="max-w-full mx-auto bg-white border rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Date Filter */}
        <select
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>
            Select Date
          </option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="thismonth">This Month</option>
          <option value="lastmonth">Last Month</option>
          <option value="customrange">Current Range</option>
        </select>

        {/* Status Filter */}
        <select
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Email Input */}
        <input
          type="text"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Mobile Input */}
        <input
          type="text"
          placeholder="Mobile"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filter & Clear Buttons */}
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center whitespace-nowrap">
            🔍 ContactFilter
          </button>

          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md whitespace-nowrap">
            Clear
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md whitespace-nowrap"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactFilters;
