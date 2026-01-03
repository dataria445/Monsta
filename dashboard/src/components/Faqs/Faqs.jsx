import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
const Faqs = () => {
  const [search, setSearch] = useState({ faqQuestion: "" });
  const [data, setData] = useState([]);
  const [allIds, setAllIds] = useState([]);

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // Fetch FAQ records
  // Supports searching via the 'search' query parameter
  const getFaqs = (searchTerm = "") => {
    const url = searchTerm
      ? `${apiBaseUrl}/faq/view?search=${searchTerm}`
      : `${apiBaseUrl}/faq/view`;

    axios
      .get(url)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log("Error loading Faq", err));
  };

  useEffect(() => {
    // Add a small delay (debounce) to avoid too many API calls
    const delayDebounceFn = setTimeout(() => {
      getFaqs(search.faqQuestion);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search.faqQuestion]);

  // Handle checkbox selection
  const getCheckedValue = (e) => {
    if (e.target.checked) {
      setAllIds([...allIds, e.target.value]);
    } else {
      setAllIds(allIds.filter((v) => v !== e.target.value));
    }
  };

  // Delete Many
  const multiDelete = () => {
    if (allIds.length < 1) {
      alert("Please check at least one checkbox");
      return;
    }

    axios
      .post(`${apiBaseUrl}/faq/multiDelete`, { ids: allIds })
      .then((res) => res.data) // Get the ApiResponse object
      .then((apiResponse) => {
        console.log("Deleted IDs:", allIds);
        if (apiResponse.success) {
          toast.success(
            apiResponse.message || "Selected FAQs deleted successfully!"
          );
          getFaqs();
          setAllIds([]);
        } else {
          toast.error(apiResponse.message || "Failed to delete FAQs!");
        }
      })
      .catch((err) => {
        console.log("Error deleting FAQs", err);
        toast.error("Error deleting FAQs!");
      });
  };

  const changeStatus = () => {
    if (allIds.length < 1) {
      return alert("Please check at least one checkbox");
    }

    axios
      .post(`${apiBaseUrl}/faq/changeStatus`, { ids: allIds })
      .then((res) => {
        const finalRes = res.data; // the actual response object
        console.log("ChangeStatus Response:", finalRes); // log full response

        if (finalRes.success) {
          // use 'success' from ApiResponse
          toast.success(
            finalRes.message || "Selected status changed successfully"
          );
          getFaqs(); // refresh the FAQ list
          setAllIds([]); // clear selected IDs
        } else {
          toast.error(finalRes.message || "Failed to change status");
        }
      })
      .catch((err) => {
        console.error("Error changing status", err);
        toast.error("Error changing status!");
      });
  };

  const getInputHeadingCheck = (e) => {
    if (e.target.checked) {
      setAllIds(data.map((obj) => obj._id));
    } else {
      setAllIds([]);
    }
  };

  // Table headers
  const tableHead = [
    { label: "Question", key: "question" },
    { label: "Answer", key: "answer" },
    { label: "Order", key: "order" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4  max-w-full">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / FAQs Listing</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-t border-gray-200 rounded-lg mb-4 mt-4 space-y-3 md:space-y-0 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show</label>
            <select className="border rounded px-2 py-2 text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <input
            type="text"
            name="faqQuestion"
            value={search.faqQuestion}
            onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}
            placeholder="Search..."
            className="border rounded px-3 py-2 text-sm w-full sm:w-64 md:w-80"
          />
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <button
            onClick={multiDelete}
            className="bg-red-500 hover:bg-red-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            Delete
          </button>
          <button
            className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 font-medium text-white text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
            onClick={changeStatus}
          >
            Change Status
          </button>

          <button className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200">
            <FiFilter className="text-blue-600" size={18} />
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            onClick={() => navigate("/faqaddition")}
          >
            <FiPlus className="text-white" size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider border-r border-blue-400"
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
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        value={item._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(item._id)}
                        className="rounded"
                      />
                    </td>

                    {/* Question */}
                    <td className="px-6 py-4 font-medium border-r max-w-xs">
                      {item.faqQuestion}
                    </td>

                    {/* Answer */}
                    <td className="px-6 py-4 text-sm border-r max-w-md">
                      {item.faqAnswer}
                    </td>

                    {/* Order */}
                    <td className="px-6 py-4 text-center border-r">
                      {item.faqOrder}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${item.faqStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.faqStatus ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
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

export default Faqs;
