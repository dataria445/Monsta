import React, { useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import NewsFilter from "./filter/NewsFilter";

const Newsletter = () => {
  const [newsletterFilter, setNewsletterFilters] = useState(false);

  // Fixed: Proper array of newsletter objects
  const newsletter = [
    {
      email: "test@gmail.com",
      date: Date.now(),
      status: "Active",
    },
  ];

  // Table headers
  const tableHead = [
    { label: "Email", key: "email" },
    { label: "Date", key: "date" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="mx-auto px-4  max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Newsletter Listing
          </h1>
          <p className="text-sm text-blue-600">
            Dashboard / Newsletter Listing
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-t border-gray-200 rounded-lg mb-4 mt-4 space-y-3 md:space-y-0 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show</label>
            <select className="border rounded px-2 py-2 text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2 text-sm w-full sm:w-64 md:w-80"
          />
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <button className="bg-red-500 hover:bg-red-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200">
            Delete
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200">
            Change Status
          </button>

          <button
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
            onClick={() => setNewsletterFilters((prev) => !prev)}
          >
            <FiFilter className="text-blue-600" size={18} />
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="mt-4 mb-4">
        {newsletterFilter && (
          <NewsFilter onClose={() => setNewsletterFilters(false)} />
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input type="checkbox" className="rounded" />
                </th>

                {/* LOOPED HEADERS */}
                {tableHead.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider border-r border-blue-400"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{header.label}</span>
                      <div className="flex flex-col text-[10px] leading-[10px]">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {newsletter.map((newsletter, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>

                  <td className="px-6 py-4 font-medium border-r w-[60%]">
                    {newsletter.email}
                  </td>
                  <td className="px-6 py-4 font-medium border-r max-w-xs">
                    {newsletter.date}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center border-r">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${newsletter.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {newsletter.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
