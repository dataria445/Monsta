import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaEdit, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { toast } from "react-toastify";
import CountryFilters from "./Admin/CountryFilters";
import CountryAddition from "./Admin/CountryAddition";
import axios from "axios";

const Countries = () => {
  const [countryFilter, setCountryFilters] = useState(false);
  const [countryAddition, setCountryAddition] = useState(false);

  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);

  let apiBaseUrl = import.meta.env.VITE_APIBASE;

  // Load country list
  let getLocation = () => {
    axios
      .get(`${apiBaseUrl}/country/view`)
      .then((res) => {
        console.log("API Response:", res.data);
        setData(res.data.data);
      })
      .catch((err) => console.log("Error loading countries:", err));
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Checkbox Value Collection
  const getCheckedValue = (e) => {
    console.log("Checkbox Value:", e.target.value); // DEBUG
    if (e.target.checked) {
      setAllIds([...allIds, e.target.value]);
    } else {
      setAllIds(allIds.filter((v) => v !== e.target.value));
    }
  };


  const getInputHeadingCheck = (e) => {
    if (e.target.checked) {
      setAllIds(data.map((obj) => obj._id));
    } else {
      setAllIds([]);
    }
  };

  // Delete Many
  let multiDelete = () => {
    if (allIds.length >= 1) {
      if (window.confirm("Are you sure you want to delete selected items?")) {
        axios
          .post(`${apiBaseUrl}/country/multiDelete`, { ids: allIds })
          .then((res) => res.data) // Get the ApiResponse object
          .then((apiResponse) => {
            if (apiResponse.success) {
              toast.success(apiResponse.message || "Countries deleted successfully!");
              getLocation();
              setAllIds([]);
            } else {
              toast.error(apiResponse.message || "Failed to delete!");
            }
          })
          .catch((err) => {
            console.log("Error deleting countries", err);
            toast.error("Error deleting countries!");
          });
      }
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  const changeStatus = () => {
    console.log("Changing Status for IDs:", allIds); // DEBUG
    if (allIds.length >= 1) {
      axios
        .post(`${apiBaseUrl}/country/changeStatus`, { ids: allIds })
        .then((res) => res.data) // Get the ApiResponse object
        .then((apiResponse) => {
          if (apiResponse.success) {
            toast.success(apiResponse.message || "Status updated successfully!");
            getLocation();
            setAllIds([]);
          } else {
            toast.error(apiResponse.message || "Failed to update status!");
          }
        })
        .catch((err) => {
          console.error("Error updating status", err);
          toast.error("Error updating status!");
        });
    } else {
      toast.error("Please check at least one checkbox");
    }
  };


  // Table headers
  const tableHead = [
    { label: "Name", key: "name" },
    { label: "Order", key: "order" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Country Listing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard / Country Listing
          </p>
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
            <button
              onClick={multiDelete}
              className="bg-red-500 hover:bg-red-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Delete
            </button>
            <button
              onClick={changeStatus}
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Change Status
            </button>

            <button
              className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
              onClick={() => setCountryFilters((prev) => !prev)}
            >
              <FiFilter className="text-blue-600" size={18} />
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              onClick={() => setCountryAddition((prev) => !prev)}
            >
              <FiPlus className="text-white" size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 mb-4">
        {countryFilter && (
          <CountryFilters onClose={() => setCountryFilters(false)} />
        )}
      </div>
      <div className="mt-4 mb-4">
        {countryAddition && (
          <CountryAddition onClose={() => setCountryAddition(false)} />
        )}
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    readOnly
                    checked={data.length === allIds.length}
                    onClick={getInputHeadingCheck}
                    className="rounded"
                  />
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
              {data.length >= 1 ? (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        value={item._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(item._id)}
                      />
                    </td>
                    <td className="p-3 border-r border-gray-300 w-150">
                      {item.countryName}
                    </td>
                    <td className="p-3 w-30 border-r border-gray-300">
                      <input
                        type="number"
                        readOnly
                        value={item.countryOrder}
                        className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </td>

                    <td className="p-3 border-r w-50 border-gray-300">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${item.countryStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.countryStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                        <FaEdit size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Countries;
