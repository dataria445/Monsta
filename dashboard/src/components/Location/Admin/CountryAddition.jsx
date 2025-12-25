import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CountryAddition({ onClose }) {
  const [countryName, setCountryName] = useState("");
  const [countryOrder, setCountryOrder] = useState("");

  const apiBaseUrl = import.meta.env.VITE_APIBASE;
  const navigate = useNavigate();

  const handleCreate = async(e) => {
    e.preventDefault();

    const obj = {
      countryName,
      countryOrder
    };
    
    try {
      const res= await axios.post(`${apiBaseUrl}/country/create`,obj)
      .then((res)=>res.data)
      .then((finalRes)=>{
        if (finalRes.success){
          toast.success("country Created Successfully")
          setCountryName("")
          setCountryOrder("")
          setTimeout(()=>{
            onClose()
            navigate("/countries")
          },700)

        }else{
          toast.error(res.data.message || "Failed to create country");
        }
      })
      
    } catch (error) {
      console.error("Error creating Country:", error);
      toast.error(err.response?.data?.message || "Failed to create Country");
    }
    }
  

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Create Country
          </h2>

          <form className="space-y-4" onSubmit={handleCreate}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                placeholder="Enter country name"
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Order Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Order
              </label>
              <input
                type="number"
                value={countryOrder}
                onChange={(e) => setCountryOrder(e.target.value)}
                placeholder="Enter display order"
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Close
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Country
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CountryAddition;
