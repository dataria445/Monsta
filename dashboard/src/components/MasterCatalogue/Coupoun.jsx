import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import CoupounFilters from "./FilterandAddition/Coupouns/CoupounFilters";
import CoupounAddition from "./FilterandAddition/Coupouns/CoupounsAddition";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Coupoun = () => {
  const [coupounFilter, setCoupounFilters] = useState(false);
  const [coupounAddition, setCoupounAddition] = useState(false);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // Fetch Coupons
  // Supports searching via the 'search' query parameter
  const getCoupoun = (searchTerm = "") => {
    const url = searchTerm
      ? `${apiBaseUrl}/coupoun/view?search=${searchTerm}`
      : `${apiBaseUrl}/coupoun/view`;

    axios
      .get(url)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // Add a small delay (debounce) to avoid too many API calls
    const delayDebounceFn = setTimeout(() => {
      getCoupoun(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Handle checkbox
  const getCheckedValue = (e) => {
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


  // Delete
  const deleteCoupoun = () => {
    if (allIds.length < 1) {
      return toast.error("Please check at least one checkbox");
    }
    axios
      .post(`${apiBaseUrl}/coupoun/multiDelete`, { ids: allIds })
      .then((res) => res.data) // Get the ApiResponse object
      .then((apiResponse) => {
        if (apiResponse.success) {
          toast.success(apiResponse.message || "Operation successful!");
          getCoupoun();
          setAllIds([]);
        } else {
          toast.error(apiResponse.message || "Operation failed!");
        }
      })
      .catch((err) => {
        console.error("Error deleting", err);
      });
  };

  // Status Change
  const changeStatus = () => {
    if (allIds.length < 1) {
      return toast.error("Please check at least one checkbox");
    }
    axios
      .post(`${apiBaseUrl}/coupoun/changeStatus`, { ids: allIds })
      .then((res) => res.data) // Get the ApiResponse object
      .then((apiResponse) => {
        if (apiResponse.success) {
          toast.success(apiResponse.message || "Operation successful!");
          getCoupoun();
          setAllIds([]);
        } else {
          toast.error(apiResponse.message || "Operation failed!");
        }
      })
      .catch((err) => {
        console.error("Error changing status", err);
      });
  };

  // Fixed headers (typo fixed: lable → label)
  const tableHead = [
    { label: "Name", key: "name" },
    { label: "Coupoun Code", key: "Coupoun Code" },
    { label: "Discount (%)", key: "discount" }, // ← Fixed typo
    { label: "Price Range", key: "price range" },
    { label: "Valid Between", key: "valid between" },
    { label: "Order", key: "order" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / Coupon Listing</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 md:p-6 rounded-lg shadow mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-600">Show</label>
            <select className="border rounded px-3 py-2 text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon..."
            className="border rounded px-4 py-2 text-sm w-full sm:w-64 md:w-80"
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={deleteCoupoun}
            className="bg-red-500 hover:bg-red-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200">
            Delete
          </button>
          <button
            onClick={changeStatus}
            className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200">
            Change Status
          </button>
          <button
            onClick={() => setCoupounFilters((prev) => !prev)}
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
          >
            <FiFilter className="text-blue-600" size={20} />
          </button>
          <button
            onClick={() => navigate("/coupounaddition")}
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FiPlus className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* FILTER MODAL */}

      <div className="mt-4 mb-4">
        {coupounFilter && (
          <CoupounFilters onClose={() => setCoupounFilters(false)} />
        )}
      </div>
      {/* ADD COUPON MODAL — This is what was missing! */}

      <div className="mt-4 mb-4">
        {coupounAddition && (
          <CoupounAddition onClose={() => setCoupounAddition(false)} refreshCoupoun={getCoupoun} />
        )}
      </div>
      {coupounAddition}
      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input
                    readOnly
                    checked={data.length === allIds.length}
                    onClick={getInputHeadingCheck}
                    type="checkbox" className="rounded" />
                </th>

                {/* LOOPED HEADERS */}
                {tableHead.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider border-r border-blue-400"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{header.label}</span>
                      <div className="flex flex-col text-[10px]">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {data.map((item, index) => {
                const startDate = new Date(item.coupounValidBetween?.startDate).toLocaleDateString();
                const endDate = new Date(item.coupounValidBetween?.endDate).toLocaleDateString();

                return (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        value={item._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(item._id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{item.coupounName}</td>
                    <td className="px-6 py-4">{item.coupounCode}</td>
                    <td className="px-6 py-4 text-green-600 font-bold text-lg">
                      {item.coupounDiscountPercent}%
                    </td>
                    <td className="px-6 py-4">
                      {item.coupounPriceRange?.from} - {item.coupounPriceRange?.to}
                    </td>
                    <td className="px-6 py-4">
                      {startDate} - {endDate}
                    </td>
                    <td className="px-6 py-4 text-center">{item.coupounOrder}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${item.coupounStatus
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.coupounStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100">
                        <FiEdit size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Coupoun;
