import React, { useState } from "react";
import { FiEdit, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import UsersFilters from "./Users/UserFilters";


const Users = () => {
  const [usersFilter, setUsersFilters] = useState(false);

  // Fixed: Proper array of users objects
  const users = [
    {
      name: "test?",
      "email id": "Yabc@yahoo.com",
      "mobile number": 1,
      status: "Active",
      action: "action",
    },
  ];

  // Table headers
  const tableHead = [
    { label: "Name", key: "name" },
    { label: "Email Id", key: "email id" },
    { label: "Mobile Number", key: "mobile number" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard / Users Listing</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Show</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
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
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full sm:w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200">
              Delete
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200">
              Change Status
            </button>

            <button
              className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
              onClick={() => setUsersFilters((prev) => !prev)}
            >
              <FiFilter className="text-blue-600" size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 mb-4">
        {usersFilter && <UsersFilters onClose={() => setUsersFilters(false)} />}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r border-blue-300/50"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{header.label}</span>
                      <div className="flex flex-col text-[10px] leading-2.5">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((users, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>

                  {/* Question */}
                  <td className="px-6 py-4 font-medium border-r max-w-xs">
                    {users.name}
                  </td>

                  {/* Answer */}
                  <td className="px-6 py-4 text-sm border-r max-w-md">
                    {users["email id"]}
                  </td>

                  {/* Order */}
                  <td className="px-6 py-4 text-center border-r">
                    {users["mobile number"]}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center border-r">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${users.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {users.status}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                      <FiEdit size={18} />
                    </button>
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

export default Users;
