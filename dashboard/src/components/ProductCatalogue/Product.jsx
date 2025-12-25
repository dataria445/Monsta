import React, { useState, useEffect } from "react";
import { FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ProductFilters from "./FilterandAddition/Products/ProductFilters";

const Product = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const getProducts = () => {
    axios
      .get(`${apiBaseUrl}/product/view`)
      .then((res) => {
        setProducts(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        toast.error("Failed to load products!");
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getCheckedValue = (e) => {
    if (e.target.checked) {
      setAllIds([...allIds, e.target.value]);
    } else {
      setAllIds(allIds.filter((v) => v !== e.target.value));
    }
  };

  // Handle "Select All" checkbox in table header
  // Selects or deselects all visible categories
  const getInputHeadingCheck = (e) => {
    if (e.target.checked) {
      setAllIds(data.map((obj) => obj._id));
    } else {
      setAllIds([]);
    }
  };

  const multiDelete = () => {
    if (allIds.length >= 1) {
      if (confirm("Are you sure you want to delete selected items?")) {
        axios
          .post(`${apiBaseUrl}/product/multiDelete`, { ids: allIds })
          .then((res) => res.data) // Get the ApiResponse object
          .then((apiResponse) => {
            if (apiResponse.success) {
              toast.success("Products deleted successfully!");
              getProducts();
              setAllIds([]);
            } else {
              toast.error(apiResponse.message || "Failed to delete!");
            }
          })
          .catch((err) => {
            console.error("Error deleting products", err);
            toast.error("Failed to delete!");
          });
      }
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  const changeStatus = () => {
    if (allIds.length >= 1) {
      axios
        .post(`${apiBaseUrl}/product/changeStatus`, { ids: allIds })
        .then((res) => res.data) // Get the ApiResponse object
        .then((apiResponse) => {
          if (apiResponse.success) {
            toast.success("Status updated successfully!");
            getProducts();
            setAllIds([]);
          } else {
            toast.error(apiResponse.message || "Failed to update status!");
          }
        })
        .catch((err) => {
          console.error("Error updating status", err);
          toast.error("Failed to update status!");
        });
    } else {
      toast.error("Please check at least one checkbox");
    }
  };

  const handleEdit = (id) => {
    // Navigate to add page with ID for editing (future implementation)
    // navigate(`/productaddition?id=${id}`);
    // For now just navigate to list as edit is not fully spec'd
    console.log("Edit clicked for", id);
  };

  const tableHead = [
    { label: "Image", key: "imageUrl" },
    { label: "Name", key: "productName" },
    { label: "Category", key: "category" },
    { label: "Type", key: "productType" },
    { label: "Best Selling", key: "productBestSelling" },
    { label: "Top Rated", key: "productTopRated" },
    { label: "Trending", key: "productTrending" },
    { label: "Order", key: "productOrder" },
    { label: "Status", key: "productStatus" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Listing</h1>
          <p className="text-sm text-blue-600">Dashboard / Product Listing</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 md:p-6 rounded-lg shadow mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-600">Show</label>
            <select className="border rounded px-3 py-2 text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <input
            type="text"
            placeholder="Search product..."
            className="border rounded px-4 py-2 text-sm w-full sm:w-64 md:w-80"
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
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
            onClick={() => setFilterOpen((prev) => !prev)}
            className="bg-blue-100 hover:bg-blue-200 p-2.5 rounded-lg transition-all duration-200"
          >
            <FiFilter className="text-blue-600" size={20} />
          </button>
          <button
            onClick={() => navigate("/productaddition")}
            className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FiPlus className="text-white" size={20} />
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-4 relative">
          <ProductFilters />
          <button
            className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500"
            onClick={() => setFilterOpen(false)}
          ></button>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2B7FFF] text-white">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input type="checkbox" className="rounded" />
                </th>
                {tableHead.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider border-r border-blue-400"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{header.label}</span>
                      <div className="flex flex-col text-[10px]">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        value={item._id}
                        onChange={getCheckedValue}
                        checked={allIds.includes(item._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={`${apiBaseUrl.replace("/admin", "")}${item.productImage
                            }`} // Correct URL construction
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.png"; // Fallback
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.category?.categoryName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.productType === "1"
                        ? "Featured"
                        : item.productType === "2"
                          ? "New Arrivals"
                          : item.productType === "discontinued"
                            ? "Discontinued"
                            : item.productType}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.productBestSelling ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.productTopRated ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.productTrending ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {item.productOrder}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold ${item.productStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.productStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                      >
                        <FiEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHead.length + 1}
                    className="p-4 text-center text-gray-500"
                  >
                    {loading ? "Loading..." : "No Products Found"}
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

export default Product;
