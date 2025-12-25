import React from "react";

function SliderAddition({ onClose }) {
  return (
  
    <div className="bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-xl shadow-md min-w-full max-h-[90vh]" >
        {/* Header */}
        <div className="flex justify-between  items-center p-6 border-b">
          <h2 className="text-2xl font-bold  text-gray-800">Create New Slider</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-light" >
            ×
          </button>
        </div>

        {/* Main Content: Image Left + Form Right */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Image Preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-60 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500">
               <p className="text-lg font-medium">Drop image here</p>
                <p className="text-sm mt-1">or click to browse</p>
              </div>
              <button className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                Choose Image
              </button>
          
            </div>

            {/* RIGHT: Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Sale 2025"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

           
              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

      
            
            </div>
          </div>

          {/* Buttons - Bottom */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg transition"
            >
              Create Slider
            </button>
          </div>
        </div>
      </div>
    </div>
  
  );
}

export default SliderAddition;