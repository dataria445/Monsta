"use client";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function AdminAddition({ onClose }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const clearForm = () => {
    setName("");
    setEmail("");
    setMobile("");
  };

  const handleCreate = (e) => {
    e.preventDefault();

    // 🔥 Close modal immediately when button is clicked
    onClose();

    const payload = {
      dashboardAdminName: name,
      dashboardAdminEmail: email,
      dashboardAdminMobile: mobile,
      dashboardAdminStatus: true,
    };

    axios
      .post(`${apiBaseUrl}/dashboardadmin/create`, payload)
      .then((res) => {
        const finalRes = res.data;

        if (finalRes.success) {
          toast.success("Admin created successfully!");
          clearForm();

          setTimeout(() => {
            navigate(-1);
          }, 500);
        } else {
          toast.error(finalRes.message || "Failed to create Admin!");
        }
      })
      .catch((err) => {
        console.error("Error creating Admin:", err);
        toast.error("Failed to create Admin!");
      });
  };


  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Create Admin
          </h2>

          <form className="space-y-4" onSubmit={handleCreate}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mobile Number
              </label>
              <input
                type="number"
                placeholder="Mobile Number"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
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
                Create Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminAddition;
