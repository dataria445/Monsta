import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { AiOutlineSave } from "react-icons/ai";
import { SketchPicker } from "react-color";
import axios from "axios";
import { toast } from "react-toastify";

const ColorAddition = ({ onClose }) => {
  const [colorName, setColorName] = useState("");
  const [colorOrder, setColorOrder] = useState("");
  const [color, setColor] = useState("#000000"); // Default black
  const [showPicker, setShowPicker] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const handleCreate = async (e) => {
    e.preventDefault();

    const obj = {
      colorName,
      colorCode: color,
      colorOrder
    };

    try {
      const res = await axios.post(`${apiBaseUrl}/color/create`, obj)
      .then((res)=>res.data)
      .then((finalRes)=>{
        if (finalRes.success) {
          toast.success("Color created successfully!");
          setColorName("");
          setColorOrder("");
          setColor("#000000");
          onClose();
        } else {
          toast.error(res.data.message || "Failed to create color");
        }
      })

      
    } catch (err) {
      console.error("Error creating color:", err);
      toast.error(err.response?.data?.message || "Failed to create color");
    }
  };

  return (
    <div className=" bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-5xl h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Create New Color</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition text-3xl"
          >
            <IoIosClose />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleCreate} className="p-8 space-y-6">
          {/* Color Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Name
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="e.g. Midnight Blue"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Color Code + Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Code
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={color}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              {/* Clickable Color Box */}
              <div
                onClick={() => setShowPicker(!showPicker)}
                className="w-20 h-14 border-4 border-gray-300 rounded-xl cursor-pointer shadow-lg transition hover:scale-105"
                style={{ backgroundColor: color }}
              />
            </div>

            {/* Color Picker - Shows when clicked */}
            {showPicker && (
              <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowPicker(false)}
                />
                <SketchPicker
                  color={color}
                  onChangeComplete={(c) => setColor(c.hex)}
                />
              </div>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              placeholder="1"
              value={colorOrder}
              onChange={(e) => setColorOrder(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-md"
            >
              <AiOutlineSave size={20} />
              Create Color
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorAddition;