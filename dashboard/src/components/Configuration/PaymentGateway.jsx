import React from "react";
import { FiEdit } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const PaymentGateway = () => {
  const gateways = [
    {
      name: "Razorpay",
      details: {
        key_id: "123456",
        key_secret: "1234567890",
        key_poin: "1234",
      },
      status: "Active",
    },
    // Add more gateways here...
  ];

  // Define table headers in a loop
  const headers = [
    { label: "Name", key: "name" },
    { label: "Details", key: "details" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 py-6 max-w-full ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Gateway Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / Payment Gateway Listing</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Show</label>
          <select className="entries border rounded px-2 py-1 text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span className="text-sm text-gray-600">entries</span>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1 text-sm ml-4 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>

                {/* LOOP FOR ALL HEADERS */}
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-blue-400"
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
              {gateways.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>

                  <td className="px-6 py-4 font-medium border-r">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-sm border-r">
                    <div><strong>KEY_ID:</strong> {item.details.key_id}</div>
                    <div> <strong>KEY_SECRET:</strong> {item.details.key_secret}</div>
                    <div><strong>KEY_POIN:</strong> {item.details.key_poin}</div>
                  </td>

                  <td className="px-6 py-4 border-r">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100">
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

export default PaymentGateway;