import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp, FaStar } from "react-icons/fa";
import TestimonialFilters from "./FilterandAddition/Testimonial/TestimonialFilters";
import TestimonialAddition from "./FilterandAddition/Testimonial/TestimonialAddition";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Testimonial = () => {
  const [testimonialFilter, setTestimonialFilter] = useState(false);
  const [testimonialAddition, setTestimonialAddition] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // Fetch Testimonials
  const getTestimonial = () => {
    axios
      .get(`${apiBaseUrl}/testimonial/view`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTestimonial();
  }, []);

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
  const deleteTestimonial = () => {
    if (allIds.length < 1) {
      return toast.error("Please check at least one checkbox");
    }
    axios
      .post(`${apiBaseUrl}/testimonial/multiDelete`, { ids: allIds })
      .then((res) => res.data) // Get the ApiResponse object
      .then((apiResponse) => {
        if (apiResponse.success) {
          toast.success(apiResponse.message || "Operation successful!");
          getTestimonial();
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
      .post(`${apiBaseUrl}/testimonial/changeStatus`, { ids: allIds })
      .then((res) => res.data) // Get the ApiResponse object
      .then((apiResponse) => {
        if (apiResponse.success) {
          toast.success(apiResponse.message || "Operation successful!");
          getTestimonial();
          setAllIds([]);
        } else {
          toast.error(apiResponse.message || "Operation failed!");
        }
      })
      .catch((err) => {
        console.error("Error changing status", err);
      });
  };

  // Correct headers for Testimonials
  const tableHead = [
    { label: "Image", key: "image" },
    { label: "Name", key: "name" },
    { label: "Designation", key: "designation" },
    { label: "Rating", key: "rating" },
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
          <h1 className="text-2xl font-bold text-gray-900">
            Testimonial Listing
          </h1>
          <p className="text-sm text-blue-600">
            Dashboard / Testimonial Listing
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
            placeholder="Search testimonials..."
            className="border rounded px-4 py-2 text-sm w-full sm:w-64 md:w-80"
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={deleteTestimonial}
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
            onClick={() => setTestimonialFilter((prev) => !prev)}
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
          >
            <FiFilter className="text-blue-600" size={20} />
          </button>

          <button
            onClick={() => navigate("/testimonialaddition")}
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FiPlus className="text-white" size={20} />
          </button>
        </div>
      </div>

      <div className="mt-4 mb-4">
        {testimonialFilter && (
          <TestimonialFilters onClose={() => setTestimonialFilter(false)} />
        )}
      </div>
      {/* <div className="mt-4 mb-4">
        {testimonialAddition && (<TestimonialAddition onClose={() => setTestimonialAddition(false)} refreshTestimonial={getTestimonial} />)}
      </div> */}

      {/* Table */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
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
              {data.map((item, index) => (
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

                  {/* Image */}
                  <td className="px-6 py-4">
                    <img
                      src={`${apiBaseUrl.replace("/admin", "")}${
                        item.testimonialImageUrl
                      }`}
                      alt={item.testimonialName}
                      className="w-12 h-12 object-cover border-2 border-gray-300 rounded"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {item.testimonialName}
                  </td>

                  {/* Designation */}
                  <td className="px-6 py-4 text-gray-600">
                    {item.testimonialDesignation}
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">{item.testimonialRating}</td>

                  {/* Order */}
                  <td className="px-6 py-4 text-center font-medium">
                    {item.testimonialOrder}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-bold ${
                        item.testimonialStatus
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.testimonialStatus ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                      <FiEdit size={20} />
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

export default Testimonial;
