import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function CoupounAddition({ onClose, refreshCoupoun }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [order, setOrder] = useState("");

  // Price Range
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Validity Dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate=useNavigate()

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !code || !discount || !startDate || !endDate) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      coupounName: name,
      coupounCode: code,
      coupounDiscountPercent: discount,
      coupounPriceRange: {
        from: minPrice || 0,
        to: maxPrice || 0,
      },
      coupounValidBetween: {
        startDate,
        endDate,
      },
      coupounOrder: order || 0,
      coupounStatus: true
    };

    axios
      .post(`${apiBaseUrl}/coupoun/create`, payload) // JSON request (no image)
      .then((res) => {
        const apiResponse = res.data;
        if (apiResponse.success || res.status === 201) { // sometimes response structure varies, checking status too
          toast.success("Coupon created successfully!");
          if (refreshCoupoun) refreshCoupoun();
          setTimeout(() => {
           navigate("/coupoun")
            onClose();
          }, 500);
        } else {
          toast.error(apiResponse.message || "Failed to create coupon!");
        }
      })
      .catch((err) => {
        console.error("Error creating coupon:", err);
        const errorMessage = err.response?.data?.message || "Failed to create coupon!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="bg-opacity-50 flex justify-end z-50">
      <ToastContainer />
      <div className="bg-white w-full max-w-full h-full shadow-2xl overflow-y-auto transform transition-transform duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Create Coupon
          </h2>
          <button
             onClick={() => navigate("/coupoun")}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Summer Sale"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="1"
                max="100"
                placeholder="25"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range - From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range - To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Valid From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valid From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Valid To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valid To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t font-medium">
            <button
              type="button"
              onClick={() => navigate("/coupoun")}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2B7FFF] hover:bg-blue-600 text-white rounded-lg shadow-lg transition"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoupounAddition;
