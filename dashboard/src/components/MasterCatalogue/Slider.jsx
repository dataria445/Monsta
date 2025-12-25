import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import SliderFilters from "./FilterandAddition/Sliders/SliderFilters";
import SliderAddition from "./FilterandAddition/Sliders/SliderAddition";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Slider = () => {
  const [sliderFilter, setSliderFilters] = useState(false);
  const [showSliderAddition, setShowSliderAddition] = useState(false); // modal toggle
  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const navigate = useNavigate()

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const getSlider = () => {
    axios
      .get(`${apiBaseUrl}/slider/view`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching sliders", err);
        toast.error("Failed to load slider data!");
      });
  };

  useEffect(() => {
    getSlider();
  }, []);

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


  const multiDelete = () => {
    if (allIds.length >= 1) {
      axios
        .post(`${apiBaseUrl}/slider/multiDelete`, { ids: allIds })
        .then((res) => res.data) // Get the ApiResponse object
        .then((apiResponse) => {
          if (apiResponse.success) {
            toast.success("Deleted successfully!");
            getSlider();
            setAllIds([]);
          } else {
            toast.error(apiResponse.message || "Failed to delete!");
          }
        })
        .catch((err) => {
          console.error("Error deleting sliders", err);
          toast.error("Failed to delete!");
        });
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  const changeStatus = () => {
    if (allIds.length >= 1) {
      axios
        .post(`${apiBaseUrl}/slider/changeStatus`, { ids: allIds })
        .then((res) => res.data) // Get the ApiResponse object
        .then((apiResponse) => {
          if (apiResponse.success) {
            toast.success("Status updated!");
            getSlider();
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

  const tableHead = [
    { label: "Image", key: "image" }, // new column
    { label: "Title", key: "title" },
    { label: "Order", key: "order" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 max-w-full">
      <ToastContainer />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slider Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / Slider Listing</p>
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
            onClick={() => setSliderFilters((prev) => !prev)}
          >
            <FiFilter className="text-blue-600" size={18} />
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            onClick={() => navigate("/sliderAddition")}
          >
            <FiPlus className="text-white" size={18} />
          </button>
        </div>
      </div>

      {sliderFilter && (
        <div className="mb-4 relative">
          <SliderFilters />
          <button
            className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500"
            onClick={() => setSliderFilters(false)}
          ></button>
        </div>
      )}

      {/* {showSliderAddition && (
        <SliderAddition
          onClose={() => {
            setShowSliderAddition(false);
            getSlider(); // refresh after close
          }}
        />
      )} */}

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white ">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input type="checkbox"
                  readOnly
                  checked={data.length === allIds.length}
                  onClick={getInputHeadingCheck}
                  className="rounded " />
                </th>
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
              {data.length > 0 ? (
                data.map((slider) => (
                  <tr key={slider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-2 ">
                      <input
                        type="checkbox"
                        value={slider._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(slider._id)}
                        className="rounded"
                      />
                    </td>

                    {/* Image */}
                    <td className="px-6 py-2 border-r">
                      <img
                        src={`${apiBaseUrl.replace('/admin', '')}${slider.sliderImageUrl}`} // assuming your API returns the full URL
                        alt={slider.sliderTitle}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 font-medium border-r">
                      {slider.sliderTitle}
                    </td>

                    {/* Order */}
                    <td className="px-6 py-4 text-sm border-r">{slider.sliderOrder}</td>

                    {/* Status */}
                    <td className="px-4 py-2 border-r border-gray-100">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${slider.sliderStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {slider.sliderStatus ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                        <FiEdit size={18} />
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

export default Slider;
