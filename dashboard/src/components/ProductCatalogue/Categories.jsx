import React, { useState, useEffect } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { data, Link, useNavigate } from "react-router-dom";
import CategoryFilters from "./FilterandAddition/Categories/CategoryFilters";

const Category = () => {
  const [categoryFilter, setCategoryFilter] = useState(false);

  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // Fetch all categories from the server
  // Updates the 'data' state with the response
  const getCategories = () => {
    axios
      .get(`${apiBaseUrl}/category/view`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching categories", err);
        toast.error("Failed to load category data!");
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Handle individual checkbox selection
  // Toggles the ID in the 'allIds' array
  const getCheckedValue = (e) => {
    if (e.target.checked) {
      // console.log(e.target.value);
      setAllIds([...allIds, e.target.value]);
    } else {
      setAllIds(allIds.filter((v) => v !== e.target.value));
    }
  };

  // Handle "Select All" checkbox in table header
  // Selects or deselects all visible categories
  const getInputHeadingCheck = (e) => {
    if (e.target.checked) {
      setAllIds(data.map((obj) => obj._id));
    } else {
      setAllIds([]);
    }
  };

  // Delete selected categories
  // Sends a list of IDs to the /multiDelete endpoint
  const multiDelete = () => {
    if (allIds.length >= 1) {
      if (confirm("Are you sure you want to delete selected items?")) {
        axios
          .post(`${apiBaseUrl}/category/multiDelete`, { ids: allIds })
          .then((res) => res.data) // Get the ApiResponse object
          .then((apiResponse) => {
            if (apiResponse.success) {
              toast.success("Categories deleted successfully!");
              getCategories();
              setAllIds([]);
            } else {
              toast.error(apiResponse.message || "Failed to delete!");
            }
          })
          .catch((err) => {
            console.error("Error deleting categories", err);
            toast.error("Failed to delete!");
          });
      }
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  // Toggle status (Active/Inactive) for selected categories
  const changeStatus = () => {
    if (allIds.length >= 1) {
      axios
        .post(`${apiBaseUrl}/category/changeStatus`, { ids: allIds })
        .then((res) => res.data) // Get the ApiResponse object
        .then((apiResponse) => {
          if (apiResponse.success) {
            toast.success("Status updated successfully!");
            getCategories();
            setAllIds([]);
          } else {
            toast.error(apiResponse.message || "Failed to update status!");
          }
        })
        .catch((err) => {
          console.error("Error updating status", err);
          toast.error("Failed to update status!");
        });
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  // Headers for category table
  // 'Image' column added to display category thumbnail
  const tableHead = [
    { label: "Image", key: "categoryImage" },
    { label: "Category", key: "categoryName" },
    { label: "Order", key: "categoryOrder" },
    { label: "Status", key: "categoryStatus" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / Category Listing</p>
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
            placeholder="Search category..."
            className="border rounded px-4 py-2 text-sm w-full sm:w-64 md:w-80"
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
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
            onClick={() => setCategoryFilter((prev) => !prev)}
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
          >
            <FiFilter className="text-blue-600" size={20} />
          </button>

          <button
            onClick={() => navigate("/categoryaddition")}
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FiPlus className="text-white" size={20} />
          </button>
        </div>
      </div>

      {categoryFilter && (
        <div className="mb-4 relative">
          <CategoryFilters />
          <button
            className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500"
            onClick={() => setCategoryFilter(false)}
          ></button>
        </div>
      )}



      {/* Table */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center ">
                  <input
                    onClick={getInputHeadingCheck}
                    checked={data.length === allIds.length}
                    type="checkbox"
                    className="rounded"
                    readOnly
                  />
                </th>

                {/* LOOPED HEADERS */}
                {tableHead.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-2  text-xs font-medium uppercase tracking-wider border-r border-blue-400"
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
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition ">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={allIds.includes(item._id)}
                        onChange={getCheckedValue}
                        value={item._id}
                        className="rounded"
                        readOnly
                      />
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {/* 
                          Construct full image URL using API Base URL. 
                          Removes '/admin' from base URL if present to match static file path.
                      */}
                      <img
                        src={`${apiBaseUrl.replace('/admin', '')}${item.categoryImage}`}
                        alt={item.categoryName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.categoryName}
                    </td>

                    {/* Order */}
                    <td className="px-6 py-4 text-center font-medium">
                      {item.categoryOrder}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${item.categoryStatus
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.categoryStatus ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <Link to={`/category/update/${item._id}`}>
                        <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                          <FiEdit size={20} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHead.length + 1}
                    className="p-4 text-center text-gray-500"
                  >
                    No Categories Found
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

export default Category;
