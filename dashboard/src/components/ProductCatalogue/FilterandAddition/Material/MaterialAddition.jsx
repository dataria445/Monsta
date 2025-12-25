import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MaterialAddition() {
  const [materialName, setMaterialName] = useState("");
  const [materialOrder, setMaterialOrder] = useState("");

  const navigate=useNavigate()

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiBaseUrl}/material/create`, {
        materialName,
        materialOrder,
      });

      if (res.data.success) {
        toast.success("Material created successfully!");
        setMaterialName("");
        setMaterialOrder("");
        onClose();
      } else {
        toast.error(res.data.message || "Failed to create material");
      }
    } catch (err) {
      console.error("Error creating material:", err);
      toast.error(err.response?.data?.message || "Failed to create material");
    }
  };

  return (
    <>
      <div className=" bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-md w-full max-w-full max-h-[90vh] overflow-y-auto p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Create Material
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1"> Name </label>
              <input
                type="text"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="Name"
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Order </label>
              <input
                type="number"
                placeholder="Order"
                value={materialOrder}
                onChange={(e) => setMaterialOrder(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/material")}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Close
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Material
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default MaterialAddition;
