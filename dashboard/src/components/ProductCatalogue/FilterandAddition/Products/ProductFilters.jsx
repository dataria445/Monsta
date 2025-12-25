import React from "react";

const ProductFilters = () => {
  return (
    <div className="max-w-full mx-auto bg-white  rounded-lg  p-4 grid md:grid-cols-4 grid-cols-1 gap-4 items-center justify-start">
      {/* Name Input */}
      <input type="text" placeholder="Name" className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input type="text" placeholder="Code" className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />


      <select className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue=""  >
        <option value="" disabled selected > Choose a Product Type</option>
        <option value="1">Featured</option>
        <option value="2">New Arrivals</option>
        <option value="discontinued">Discontinued</option>
      </select>




      <select className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue=""  >
        <option value="" disabled selected> Is Best Selling  </option>
        <option>Yes</option>
        <option>No</option>
      </select>



      <select className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue=""  >
        <option value="" disabled selected>Is Top Rated </option>
        <option>Yes</option>
        <option>No</option>
      </select>

      <select className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue=""  >
        <option value="" disabled selected>Is Trending Collection </option>
        <option>Yes</option>
        <option>No</option>
      </select>


      {/* Filter Button */}
      <div className="flex gap-5 ">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center whitespace-nowrap">
          🔍 Filter Testimonial
        </button>

        {/* Clear Button */}
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md whitespace-nowrap">
          Clear
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
