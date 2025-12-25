import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

function SubSubCategoryAddition() {
  const [subSubCategoryName, setSubSubCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryOrder, setSubSubCategoryOrder] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parentCategoryDetails, setParentCategoryDetails] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]); // Store all fetched subcategories

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // --- FETCH DATA ---
  let getParentCategory = () => {
    axios
      .get(`${apiBaseUrl}/subsubcategory/parentCategory`)
      .then((res) => res.data)
      .then((finalRes) => {
        setParentCategoryDetails(finalRes.data);
      })
      .catch((err) => {
        console.error("Error fetching parentCategory:", err);
        toast.error("Failed to load parent categories");
      });
  };

  const getSubCategory = (e) => {
    const parentId = e.target.value;
    setParentCategoryId(parentId); // Update state for Parent ID
    setSubCategoryId(""); // Reset Sub Category selection

    if (!parentId) {
      setAllSubCategories([]);
      return;
    }

    axios
      .get(`${apiBaseUrl}/subsubcategory/subCategory/${parentId}`)
      .then((res) => {
        // ApiResponse structure: { statusCode, data, message, success }
        // axios response: res.data is the ApiResponse object
        if (res.data.success) {
          setAllSubCategories(res.data.data);
        } else {
          setAllSubCategories([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching subcategories:", err);
        setAllSubCategories([]);
        // toast.error("Failed to load subcategories");
      });
  };

  useEffect(() => {
    getParentCategory();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!subSubCategoryName) {
      return toast.error("Category Name is required");
    }
    if (!parentCategoryId) {
      return toast.error("Parent Category is required");
    }
    if (!subCategoryId) {
      return toast.error("Sub Category is required");
    }
    if (!image) {
      return toast.error("Sub Sub Category Image is required");
    }

    const formData = new FormData();
    formData.append("parentCategoryId", parentCategoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("subSubCategoryName", subSubCategoryName);
    formData.append("subSubCategoryOrder", subSubCategoryOrder);
    formData.append("subSubCategoryImage", image);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/subsubcategory/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Sub Sub Category created successfully!");
        setTimeout(() => {
          navigate("/subsubcategory");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating subsubcategory:", error);
      toast.error(
        error.response?.data?.message || "Failed to create subsubcategory!"
      );
    }
  };

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Sub Sub Category
          </h1>
          <p className="text-sm text-blue-600">
            Dashboard / Sub Sub Category / Add
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 ">
        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Image Upload */}
            <div className="flex flex-col gap-4 ">
            <div className="flex justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Sub Sub Category Image
              </label>
             <button >
              <MdDeleteForever onClick={()=>{setImage(image)}} size={30} className="text-red-400"/>
              </button>
              </div>
              <div
                onClick={() => document.getElementById("fileUpload").click()}
                className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition relative overflow-hidden"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">Drop image here</p>
                    <p className="text-sm mt-1">or click to browse</p>
                  </div>
                )}
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Fields */}
            <div className="space-y-6">
              {/* Parent Category Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Parent Category Name
                </label>
                <select
                  value={parentCategoryId}
                  onChange={getSubCategory}
                  //   onChange={(e) => setParentCategoryId(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition text-gray-700"
                >
                  <option value="">Select Parent Category</option>
                  {parentCategoryDetails.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* SubCategory Dropdown (Filtered) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sub Category Name
                </label>
                <select
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  disabled={!parentCategoryId}
                  className={`w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition text-gray-700 ${
                    !parentCategoryId ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select Sub Category</option>
                  {allSubCategories.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.subCategoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* SubSubCategory Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. L-Shaped Sofa"
                  value={subSubCategoryName}
                  onChange={(e) => setSubSubCategoryName(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Order
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min="0"
                  value={subSubCategoryOrder}
                  onChange={(e) => setSubSubCategoryOrder(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 mt-8 border-t">
            <button
              type="button"
              onClick={() => navigate("/subsubcategory")}
              className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition transform hover:scale-105"
            >
              Create Sub Sub Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubSubCategoryAddition;
