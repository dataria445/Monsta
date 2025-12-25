import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function CategoryAddition() {
  const [categoryName, setCategoryName] = useState(""); // Stores input for category name
  const [categoryOrder, setCategoryOrder] = useState(""); // Stores input for display order
  const [categoryStatus, setCategoryStatus] = useState(true); // Toggle status (Active/Inactive)
  const [image, setImage] = useState(null); // Stores the selected file object
  const [preview, setPreview] = useState(null); // Stores URL for image preview

  // --- HOOKS ---
  const navigate = useNavigate(); // Navigation hook to redirect after action
  const apiBaseUrl = import.meta.env.VITE_APIBASE; // API Base URL from env
  const { id } = useParams(); // Get ID from URL parameters (if in Update mode)

  // --- USE EFFECT: FETCH DATA FOR EDIT MODE ---
  // If 'id' is present, this effect fetches existing category details
  // and pre-fills the form fields and image preview.
  React.useEffect(() => {
    if (id) {
      axios
        .get(`${apiBaseUrl}/category/view`)
        .then((res) => {
          // Find the specific category by ID from the fetched list
          const category = res.data.data.find((c) => c._id === id);
          if (category) {
            setCategoryName(category.categoryName);
            setCategoryOrder(category.categoryOrder);
            setCategoryStatus(category.categoryStatus);

            // Construct preview URL for existing image
            if (category.categoryImage) {
              // Check if URL is already absolute or needs base URL prepended
              const imageUrl = category.categoryImage.startsWith('http')
                ? category.categoryImage
                : `${apiBaseUrl.replace('/admin', '')}${category.categoryImage}`;
              setPreview(imageUrl);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching category:", err);
          toast.error("Failed to load category details");
        });
    }
  }, [id, apiBaseUrl]);

  // --- HANDLER: IMAGE SELECTION ---
  // Triggered when user selects a file. 
  // Updates 'image' state and generates a local preview URL.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- HANDLER: FORM SUBMISSION ---
  // Handles both Create (POST) and Update (PUT) operations.
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Use FormData to send text fields and file together
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("categoryOrder", categoryOrder);
      formData.append("categoryStatus", categoryStatus);

      // Append image only if a new file is has been selected
      if (image) {
        formData.append("categoryImage", image);
      }

      // Determine API URL and Method based on mode
      // If 'id' exists => Update Mode (PUT)
      // If 'id' is missing => Create Mode (POST)
      const url = id
        ? `${apiBaseUrl}/category/update/${id}`
        : `${apiBaseUrl}/category/create`;

      const method = id ? "put" : "post";

      // Execute API Request
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle Success
      if (response.data.success) {
        toast.success(id ? "Category updated successfully!" : "Category created successfully!");
        setTimeout(() => {
          navigate("/category"); // Redirect to list page
        }, 700);
      }
    } catch (error) {
      console.error("Error creating/updating category:", error);
      toast.error(
        error.response?.data?.message || "Failed to save category!"
      );
    }
  };

  return (
    <div className="mx-auto px-4 py-6 max-w-full">
      <ToastContainer />

      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
          {/* Dynamic Breadcrumb/Label based on Mode */}
          <p className="text-lg text-blue-600  ">{id ? "Update Category" : "Create Category"} </p>
        </div>
      </div>

      {/* --- FORM CONTAINER --- */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
            <div className="flex flex-col gap-4">
              <label className="block text-sm font-semibold text-gray-700">
                Category Image
              </label>
              {/* Clickable Area for File Upload */}
              <div onClick={() => document.getElementById("fileUpload").click()}
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

            {/* --- RIGHT COLUMN: INPUT FIELDS --- */}
            <div className="space-y-6">

              {/* Category Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Sofa Collection"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* Display Order Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min="0"
                  value={categoryOrder}
                  onChange={(e) => setCategoryOrder(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                />
              </div>

              {/* Status Toggle (Active/Inactive) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 
                        ${categoryStatus ? "bg-blue-600" : "bg-gray-300"}`}
                      onClick={() => setCategoryStatus(!categoryStatus)}
                    >
                      <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition duration-300 
                          ${categoryStatus ? "translate-x-6" : "translate-x-0"}`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {categoryStatus ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex justify-end gap-4 pt-6 mt-8 border-t">
            <button
              type="button"
              onClick={() => navigate("/category")}
              className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition transform hover:scale-105"
            >
              {id ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryAddition;