import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function TestimonialAddition({ onClose, refreshTestimonial }) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [rating, setRating] = useState(5);
  const [order, setOrder] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_APIBASE;
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image || !designation) {
      return toast.error("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("testimonialName", name);
    formData.append("testimonialDesignation", designation);
    formData.append("testimonialRating", rating);
    formData.append("testimonialOrder", order);
    formData.append("testimonialImageUrl", image);
    // status defaults to true on backend

    axios
      .post(`${apiBaseUrl}/testimonial/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const apiResponse = res.data;
        if (apiResponse.success) {
          toast.success("Testimonial created successfully!");
          if (refreshTestimonial) refreshTestimonial();
          setTimeout(() => {
            navigate("/testimonial");
            onClose();
          }, 500);
        } else {
          toast.error(apiResponse.message || "Failed to create testimonial!");
        }
      })
      .catch((err) => {
        console.error("Error creating testimonial:", err);
        const errorMessage = err.response?.data?.message || "Failed to create testimonial!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-md w-full max-w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Create Testimonial
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT: Image Preview */}
            <div className="flex flex-col gap-4">
              <label className="block text-sm font-semibold text-gray-700">Testimonial Image</label>
              <div
                onClick={() => document.getElementById("fileUpload").click()}
                className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition relative overflow-hidden"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">Drop image here</p>
                    <p className="text-sm mt-1">or click to browse</p>
                  </div>
                )}
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* RIGHT: Text Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. CEO, TechCorp"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
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
                  placeholder="e.g. 1"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2B7FFF] hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg transition"
            >
              Create Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestimonialAddition;
