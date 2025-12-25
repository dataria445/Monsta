import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import AdminFilters from "./Admin/AdminFilters";
import AdminAddition from "./Admin/AdminAddition";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [adminFilter, setadminFilters] = useState(false);
  const [adminAddition, setAdminAddition] = useState(false);
  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // Fetch Admin List
  const getAdminView = () => {
    axios
      .get(`${apiBaseUrl}/dashboardAdmin/view`)
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error("Error loading Admin:", err);
        toast.error("Failed to load admins!");
      });
  };

  useEffect(() => {
    getAdminView();
  }, []);

  const getCheckedValue = (e) => {
    if (e.target.checked) {
      setAllIds([...allIds, e.target.value]);
    } else {
      setAllIds(allIds.filter((v) => v !== e.target.value));
    }
  };

  const getInputHeadingCheck = (e) => {
    if (e.target.checked) {
      setAllIds(data.map((obj) => obj._id));
    } else {
      setAllIds([]);
    }
  };

  // Delete Many
  const multiDelete = () => {
    if (allIds.length < 1) {
      toast.warn("Please check at least one checkbox");
      return;
    }

    axios
      .post(`${apiBaseUrl}/dashboardAdmin/multiDelete`, { ids: allIds })
      .then((res) => {
        const finalRes = res.data;
        if (finalRes.success) {
          toast.success(
            finalRes.message || "Selected admins deleted successfully!"
          );
          getAdminView();
          setAllIds([]);
        } else {
          toast.error(finalRes.message || "Failed to delete admins!");
        }
      })
      .catch((err) => {
        console.error("Error deleting admins:", err);
        toast.error("Error deleting admins!");
      });
  };

  // Change Status
  const changeStatus = () => {
    if (allIds.length < 1) {
      toast.warn("Please check at least one checkbox");
      return;
    }

    axios
      .post(`${apiBaseUrl}/dashboardAdmin/changeStatus`, { ids: allIds })
      .then((res) => {
        const finalRes = res.data;
        if (finalRes.success) {
          toast.success(finalRes.message || "Selected admin status changed!");
          getAdminView();
          setAllIds([]);
        } else {
          toast.error(finalRes.message || "Failed to change status!");
        }
      })
      .catch((err) => {
        console.error("Error changing status:", err);
        toast.error("Error changing status!");
      });
  };

  // Table headers
  const tableHead = [
    { label: "Name", key: "name" },
    { label: "Email Id", key: "email id" },
    { label: "Mobile Number", key: "mobile number" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Listing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard / Admin Listing
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Show</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full sm:w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={multiDelete}
              className="bg-red-500 hover:bg-red-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Delete
            </button>
            <button
              onClick={changeStatus}
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Change Status
            </button>

            <button
              className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
              onClick={() => setadminFilters((prev) => !prev)}
            >
              <FiFilter className="text-blue-600" size={18} />
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              onClick={() => setAdminAddition((prev) => !prev)}
            >
              <FiPlus className="text-white" size={18} />
            </button>
          </div>
        </div>
      </div>

      {adminFilter && <AdminFilters onClose={() => setadminFilters(false)} />}
      {adminAddition && (
        <AdminAddition
          onClose={() => setAdminAddition(false)}
          refreshList={getAdminView}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    readOnly
                    checked={data.length === allIds.length}
                    onClick={getInputHeadingCheck}
                    className="rounded"
                  />
                </th>

                {/* LOOPED HEADERS */}
                {tableHead.map((header) => (
                  <th
                    key={header.key}
                    className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r border-blue-300/50"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{header.label}</span>
                      <div className="flex flex-col text-[10px] leading-2.5">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((admin, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        value={admin._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(admin._id)}
                        type="checkbox"
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium border-r max-w-xs">
                      {admin.dashboardAdminName}
                    </td>
                    <td className="px-6 py-4 text-sm border-r max-w-md">
                      {admin.dashboardAdminEmail}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      {admin.dashboardAdminMobile}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-100">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          admin.dashboardAdminStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.dashboardAdminStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                        <FiEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
