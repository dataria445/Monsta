import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

function SliderAddition({ onClose }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [sliderImage, setSliderImage] = useState("");
  const [sliderTitle, setSliderTitle] = useState("");
  const [sliderOrder, setSliderOrder] = useState("");

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSliderImage(file);
    setImage(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setImage(null);
    setSliderImage("");
    setSliderTitle("");
    setSliderOrder("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // onClose()

    const formData = new FormData();
    formData.append("sliderImage", sliderImage);
    formData.append("sliderTitle", sliderTitle);
    formData.append("sliderOrder", sliderOrder);

    try {
      const res = await axios.post(`${apiBaseUrl}/slider/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const apiResponse = res.data;

      if (apiResponse.success) {
        toast.success("Slider created successfully!");
        handleClear();
        navigate("/slider");
      } else {
        toast.error(apiResponse.message || "Failed to create slider!");
      }
    } catch (err) {
      console.error("Error creating slider:", err);
      toast.error("Failed to create slider!");
    }
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md min-w-full max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create New Slider</h2>
          <button
            onClick={() => navigate("/slider")}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleCreate} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT: Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Choose Image
              </label>

              <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 h-56 cursor-pointer hover:border-blue-400 transition"
                onClick={() => document.getElementById("fileUpload").click()}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <AiOutlineCloudUpload className="text-4xl mb-2" />
                    <p className="text-sm">Drag & drop or click to upload</p>
                  </div>
                )}

                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* RIGHT: Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={sliderTitle}
                  onChange={(e) => setSliderTitle(e.target.value)}
                  placeholder="Enter slider title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={sliderOrder}
                  onChange={(e) => setSliderOrder(e.target.value)}
                  placeholder="Enter order number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/slider")}
              className="inline-flex items-center gap-2 bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg transition"
            >
              Create Slider
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default SliderAddition;
