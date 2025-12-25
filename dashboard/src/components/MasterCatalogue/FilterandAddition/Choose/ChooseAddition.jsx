import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ChooseAddition({ onClose, refreshChoose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !image) {
      return toast.error("Title and Image are required");
    }

    const formData = new FormData();
    formData.append("chooseTitle", title);
    formData.append("chooseOrder", order);
    formData.append("chooseImage", image);
    // status defaults to true

    axios
      .post(`${apiBaseUrl}/choose/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const apiResponse = res.data;
        if (apiResponse.success) {
          toast.success("Choose entry created!");
          if (refreshChoose) refreshChoose();
          setTimeout(() => {
            navigate("/choose");
            onClose();

          }, 500);
        } else {
          toast.error(apiResponse.message || "Failed to create entry!");
        }
      })
      .catch((err) => {
        console.error("Error creating choose entry:", err);
        const errorMessage = err.response?.data?.message || "Failed to create entry!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      {/* Toast Container needs to be inside or outside but compatible with layout. Keeping it here is fine */}
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-md w-full max-w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Create Why Choose Us
          </h2>
          <button
               onClick={() => navigate("/choose")}
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
              <label className="block text-sm font-semibold text-gray-700">Image</label>
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
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best Support"
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
              onClick={() => navigate("/choose")}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2B7FFF] hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg transition"
            >
              Create Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChooseAddition;
