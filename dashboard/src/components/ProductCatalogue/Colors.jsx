import React, { useState, useEffect } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ColorFilters from "./FilterandAddition/Colors/ColorFilters";
import ColorAddition from "./FilterandAddition/Colors/ColorAddition";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Colors = () => {
  const [colorFilter, setcolorFilters] = useState(false);
  const [colorAddition, setcolorAddition] = useState(false);
  const [data, setdata] = useState([]);
  const [allIds, setAllIds] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_APIBASE;
    
  const getColors = () => {
    axios
      .get(`${apiBaseUrl}/color/view`)
      .then((res) => {
        console.log("Fetched colors:", res.data.data); // DEBUG
        setdata(res.data.data);
      })
      .catch((err) => {
        console.log("Error fetching colors", err);
        toast.error("Failed to load color data!");
      });
  };

  useEffect(() => {
    getColors();
  }, []);

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


  const multiDelete = () => {
    console.log("Deleting IDs:", allIds); // DEBUG
    if (allIds.length >= 1) {
      if (window.confirm("Are you sure you want to delete selected items?")) {
        axios
          .post(`${apiBaseUrl}/color/multiDelete`, { ids: allIds })
          .then((res) => res.data)
          .then((finalRes) => {
            if (finalRes.success) {
              toast.success("Colors deleted successfully!");
              getColors();
              setAllIds([]);
            } else {
              toast.error(finalRes.message || "Failed to delete!");
            }
          })
          .catch((err) => {
            console.log("Error deleting colors", err);
            toast.error("Failed to delete!");
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
        .post(`${apiBaseUrl}/color/changeStatus`, { ids: allIds })
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.success) {
            toast.success("Status updated successfully!");
            getColors();
            setAllIds([]);
          } else {
            toast.error(finalRes.message || "Failed to update status!");
          }
        })
        .catch((err) => {
          console.log("Error updating status", err);
          toast.error("Failed to update status!");
        });
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  const tableHead = [
    { label: "Name", key: "name" },
    { label: "Code", key: "Code" },
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
          <h1 className="text-2xl font-bold text-gray-900">Color Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / Color Listing</p>
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
            placeholder="Search coupon..."
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
            onClick={() => setcolorFilters((prev) => !prev)}
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
          >
            <FiFilter className="text-blue-600" size={20} />
          </button>
          <button
            onClick={() => setcolorAddition((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FiPlus className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* FILTER MODAL */}

      {colorFilter && (
        <div className="mb-4 relative">
          <ColorFilters />
          <button
            className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500"
            onClick={() => setcolorFilters(false)}
          ></button>
        </div>
      )}
      {colorAddition && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 md:p-4 ">
          <div className="bg-white rounded-lg relative w-full max-w-[700px] md:max-w-[900px] h-auto max-h-[85vh]  shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setcolorAddition(false)}
            >

            </button>

            {/* Modal Content */}
            <ColorAddition
              onClose={() => {
                setcolorAddition(false);
                getColors();
              }}
            />
          </div>
        </div>
      )}
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
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        value={item._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(item._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{item.colorName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: item.colorCode }}
                        />
                        {item.colorCode}
                      </div>

                    </td>
                    <td className="px-6 py-4 text-center">{item.colorOrder}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${item.colorStatus
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.colorStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100">
                        <FiEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No colors found
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

export default Colors;
