import React, { useState, useEffect } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import CategoryFilters from "./FilterandAddition/Categories/CategoryFilters";

const SubSubCategory = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [allIds, setAllIds] = useState([]);

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const getSubSubCategories = () => {
    axios
      .get(`${apiBaseUrl}/subsubcategory/view`)
      .then((res) => {
        setSubSubCategories(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching subsubcategories", err);
        toast.error("Failed to load subsubcategory data!");
      });
  };

  useEffect(() => {
    getSubSubCategories();
  }, []);

  const getCheckedValue = (e) => {
    if (e.target.checked) {
      setAllIds([...allIds, e.target.value]);
    } else {
      setAllIds(allIds.filter((v) => v !== e.target.value));
    }
  };

  const multiDelete = () => {
    if (allIds.length >= 1) {
      if (confirm("Are you sure you want to delete selected items?")) {
        axios
          .post(`${apiBaseUrl}/subsubcategory/multiDelete`, { ids: allIds })
          .then((res) => res.data) // Get the ApiResponse object
          .then((apiResponse) => {
            if (apiResponse.success) {
              toast.success("SubSubCategories deleted successfully!");
              getSubSubCategories();
              setAllIds([]);
            } else {
              toast.error(apiResponse.message || "Failed to delete!");
            }
          })
          .catch((err) => {
            console.error("Error deleting subsubcategories", err);
            toast.error("Failed to delete!");
          });
      }
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  const changeStatus = () => {
    if (allIds.length >= 1) {
      axios
        .post(`${apiBaseUrl}/subsubcategory/changeStatus`, { ids: allIds })
        .then((res) => res.data) // Get the ApiResponse object
        .then((apiResponse) => {
          if (apiResponse.success) {
            toast.success("Status updated successfully!");
            getSubSubCategories();
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

  // Headers
  const tableHead = [
    { label: "Image", key: "image" },
    { label: "Parent Category", key: "parentCategory" },
    { label: "Sub Category", key: "subCategory" },
    { label: "Sub Sub Category", key: "subSubCategoryName" },
    { label: "Order", key: "subSubCategoryOrder" },
    { label: "Status", key: "subSubCategoryStatus" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sub Sub Category Listing
          </h1>
          <p className="text-sm text-blue-600">
            Dashboard / Sub Sub Category Listing
          </p>
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
            placeholder="Search subsubcategory..."
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
            onClick={() => setFilterOpen((prev) => !prev)}
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
          >
            <FiFilter className="text-blue-600" size={20} />
          </button>

          <button
            onClick={() => navigate("/subsubcategoryaddition")}
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FiPlus className="text-white" size={20} />
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-4 relative">
          <CategoryFilters />
          <button
            className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500"
            onClick={() => setFilterOpen(false)}
          ></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input type="checkbox" className="rounded" />
                </th>
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
              {subSubCategories.length > 0 ? (
                subSubCategories.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition ">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        onClick={getCheckedValue}
                        value={item._id}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={`${apiBaseUrl.replace("/admin", "")}${item.subSubCategoryImage
                          }`}
                        alt={item.subSubCategoryName}
                        className="w-12 h-12 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {item.parentCategoryId?.categoryName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {item.subCategoryId?.subCategoryName || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.subSubCategoryName}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {item.subSubCategoryOrder}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${item.subSubCategoryStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.subSubCategoryStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                        <FiEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHead.length + 1}
                    className="p-4 text-center text-gray-500"
                  >
                    No SubSubCategories Found
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

export default SubSubCategory;
