import React, { useState } from "react";
import { FiSave } from "react-icons/fi";

const Configuration = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    telegram: "https://telegram.com",
  });

  const handleChange = (e) => {
    console.log(e.target);
    
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved Social Links:", socialLinks);
    alert("Social Links updated successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Header */}
       <div className="bg-white border-b border-gray-200 px-6 py-4">
       <h1 className="text-2xl font-semibold text-gray-800 ml-4 lt-4">Configuration</h1>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
          <a href="#" className="text-blue-600 hover:underline"> Dashboard </a>
          <span>/</span>
          <span>Configuration</span>
        </div>
          </div> 

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Social Links Configuration
          </h2>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Object.entries(socialLinks).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key} Link
                </label>
                <input
                  type="url"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {/* Update Button */}
        
        </div>
          <button onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors mt-6"
          >
            <FiSave className="w-4 h-4" />
            Update Configuration
          </button>
      </div>
    </div>
  );
};

export default Configuration;
