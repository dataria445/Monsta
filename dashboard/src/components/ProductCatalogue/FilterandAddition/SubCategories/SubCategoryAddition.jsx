import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**
 * SubCategoryAddition Component
 *
 * Handles the creation of new SubCategories.
 */
function SubCategoryAddition() {
  // --- STATE MANAGEMENT ---
  const [subCategoryName, setSubCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryOrder, setSubCategoryOrder] = useState("");
  const [image, setImage] = useState(null); // File object for upload
  const [preview, setPreview] = useState(null); // URL for image preview
  const [parentCategoryDetails, setParentCategoryDetails] = useState([]);

  // --- HOOKS ---
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  // --- EFFECT: FETCH PARENT CATEGORIES ---
  // Fetches list of all categories to populate the "Parent Category" dropdown.
  let getParentCategory = () => {
    axios
      .get(`${apiBaseUrl}/subcategory/parentCategory`)
      .then((res) => res.data)
      .then((finalRes) => {
        console.log(finalRes);
        setParentCategoryDetails(finalRes.data);
      })
      .catch((err) => {
        console.error("Error fetching parentCategory:", err);
        toast.error("Failed to load parent categories");
      });
  };

  useEffect(() => {
    getParentCategory();
  }, []);

  // --- HANDLER: IMAGE SELECTION ---
  /**
   * Handles the change event for the image input.
   * Sets the selected file to state and creates a URL for preview.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- HANDLER: FORM SUBMISSION (CREATE ONLY) ---
  /**
   * Handles the form submission for creating a subcategory.
   * Performs validation, prepares form data, and sends it to the API.
   * @param {Event} e - The form submission event.
   */
  const handleCreate = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!subCategoryName || !parentCategoryId || !image) {
      return toast.error(`Sub Category Name is required`);
    }
    if (!parentCategoryId) {
      return toast.error("Parent Category is required");
    }
    // Image is required for Creation
    if (!image) {
      return toast.error("Sub Category Image is required");
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("parentCategoryId", parentCategoryId);
    formData.append("subCategoryName", subCategoryName);
    formData.append("subCategoryOrder", subCategoryOrder);
    formData.append("subCategoryImage", image);

    try {
      // Execute Request (POST only)
      const response = await axios.post(
        `${apiBaseUrl}/subcategory/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Handle Success
      if (response.data.success) {
        toast.success("Sub Category created successfully!");
        setTimeout(() => {
          navigate("/subcategory");
        }, 700);
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error(
        error.response?.data?.message || "Failed to create subcategory!"
      );
    }
  };

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Sub Category
          </h1>
          <p className="text-sm text-blue-600">
            Dashboard / Sub Category / Add
          </p>
        </div>
      </div>

      {/* --- FORM CONTAINER --- */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
            <div className="flex flex-col gap-4">
              <label className="block text-sm font-semibold text-gray-700">
                Sub Category Image
              </label>
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

            {/* --- RIGHT COLUMN: FIELDS --- */}
            <div className="space-y-6">
              {/* Parent Category Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Parent Category Name
                </label>
                <select
                  value={parentCategoryId}
                  onChange={(e) => setParentCategoryId(e.target.value)}
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

              {/* SubCategory Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sofa"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
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
                  value={subCategoryOrder}
                  onChange={(e) => setSubCategoryOrder(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex justify-end gap-4 pt-6 mt-8 border-t">
            <button
              type="button"
              onClick={() => navigate("/subcategory")}
              className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition transform hover:scale-105"
            >
              Create Sub Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubCategoryAddition;
