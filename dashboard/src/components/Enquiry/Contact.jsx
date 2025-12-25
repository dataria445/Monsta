import React, { useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ContactFilters from "./filter/ContactFilter";

const Contact = () => {
  const [contactFilter, setContactFilters] = useState(false);
  const navigate = useNavigate();

  // Fixed: Proper array of contact objects
  const contact = [
    {
      userinof: "What is your return policy?",
      subject: "You can return any item within 30 days for a full refund.",
      message: 1,
      status: "Active",
    },
  ];

  // Table headers
  const tableHead = [
    { label: "Userinfo", key: "userinof" },
    { label: "Subject", key: "subject" },
    { label: "Message", key: "message" },
    { label: "Status", key: "status" },

  ];

  return (
    <div className="mx-auto px-4  max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">contact Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / contact Listing</p>
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
            onClick={() => setContactFilters((prev) => !prev)}
          >
            <FiFilter className="text-blue-600" size={18} />
          </button>
        </div>
      </div>
      <div className="mt-4 mb-4">
        {contactFilter && <ContactFilters onClose={() => setContactFilters(false)} />}
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
              {contact.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>

                  {/* Question */}
                  <td className="px-6 py-4 font-medium border-r max-w-xs">
                    {contact.userinof}
                  </td>

                  {/* Answer */}
                  <td className="px-6 py-4 text-sm border-r max-w-md">
                    {contact.subject}
                  </td>

                  {/* Order */}
                  <td className="px-6 py-4 text-center border-r">
                    {contact.message}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center border-r">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${contact.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {contact.status}
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

export default Contact;
