"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ProductAddition = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const [productType, setProductType] = useState("1");
  const [productBestSelling, setProductBestSelling] = useState("false");
  const [productUpsell, setProductUpsell] = useState("0");
  const [productPrice, setProductPrice] = useState("");
  const [productSalePrice, setProductSalePrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [productBackImage, setProductBackImage] = useState(null);
  const [productImageGallery, setProductImageGallery] = useState([]);
  const [productTopRated, setProductTopRated] = useState("0");
  const [productTrending, setProductTrending] = useState("0");
  const [productOrder, setProductOrder] = useState("");
  const [productStatus, setProductStatus] = useState("true");
  const [productImage, setProductImage] = useState(null);
  const [productName, setProductName] = useState("");

  // New State for Foreign Keys
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subsubCategoryId, setSubsubCategoryId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [colorId, setColorId] = useState("");

  // Data Lists
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  const handleClose = () => {
    navigate("/product");
  };

  const getColors = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/color/view`);
      setColors(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load colors");
    }
  };

  const getMaterial = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/material/view`);
      setMaterials(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load material");
    }
  };

  const getParent = () => {
    axios
      .get(`${apiBaseUrl}/product/parentCategory`)
      .then((res) => setCategories(res.data.data || []))
      .catch(() => toast.error("Failed to load product data!"));
  };

  const getSubCategory = () => {
    axios
      .get(`${apiBaseUrl}/product/subCategory/${parentCategoryId}`)
      .then((res) => setSubCategories(res.data.data || []))
      .catch(() => toast.error("Failed to load sub categories"));
  };

  const getSubSubCategory = () => {
    axios
      .get(`${apiBaseUrl}/product/subSubCategory/${subCategoryId}`)
      .then((res) => setSubSubCategories(res.data.data || []))
      .catch(() => toast.error("Failed to load sub sub categories"));
  };

  useEffect(() => {
    getColors();
    getMaterial();
    getParent();
  }, []);

  useEffect(() => {
    if (parentCategoryId) {
      getSubCategory();
      setSubCategoryId("");
      setSubSubCategories([]);
    }
  }, [parentCategoryId]);

  useEffect(() => {
    if (subCategoryId) {
      getSubSubCategory();
      setSubsubCategoryId("");
    }
  }, [subCategoryId]);

  const handleClear = () => {
    setProductName("");
    setProductType("1");
    setProductImage(null);
    setProductBackImage(null);
    setProductImageGallery([]);
    setProductOrder("");
    setProductBestSelling("false");
    setProductTrending("0");
    setProductTopRated("0");
    setProductUpsell("0");
    setProductStatus("true");
    setProductPrice("");
    setProductSalePrice("");
    setProductStock("");
    setProductDescription("");
    setParentCategoryId("");
    setSubCategoryId("");
    setSubsubCategoryId("");
    setMaterialId("");
    setColorId("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!productImage) {
      toast.error("Product image is required");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productType", productType);
    formData.append("productBestSelling", productBestSelling);
    formData.append("productTopRated", productTopRated);
    formData.append("productTrending", productTrending);
    formData.append("productUpsell", productUpsell);
    formData.append("productOrder", productOrder);
    formData.append("productStatus", productStatus);
    formData.append("productPrice", productPrice);
    formData.append("productSalePrice", productSalePrice);
    formData.append("productStock", productStock);
    formData.append("productDescription", productDescription);
    formData.append("parentCategoryId", parentCategoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("subsubCategoryId", subsubCategoryId);
    formData.append("materialId", materialId);
    formData.append("colorId", colorId);

    if (productImage) formData.append("productImage", productImage);
    if (productBackImage) formData.append("productBackImage", productBackImage);
    if (productImageGallery.length > 0) {
      Array.from(productImageGallery).forEach((file) => {
        formData.append("productImageGallery", file);
      });
    }

    axios
      .post(`${apiBaseUrl}/product/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const apiResponse = res.data;
        if (apiResponse.success) {
          toast.success("Choose entry created!");
          // if (refreshProduct) refreshProduct();
          setTimeout(() => {
            navigate("/product");
            // onClose();
          }, 700);
        } else {
          toast.error(apiResponse.message || "Failed to create entry!");
        }
      })
      .catch((err) => {
        console.error("Error creating choose entry:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to create entry!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="my-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Product
          </h2>
          <p className="text-sm text-gray-500">
            <span className="text-blue-600">Dashboard / </span>
            <span className="text-blue-600">Product / </span>
            Create Product
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 border border-red-500 rounded-full"
        >
          <IoIosClose className="text-3xl" />
        </button>
      </div>

      <form onSubmit={handleCreate}>
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Product Image
              </label>
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-50">
                <FiUploadCloud className="text-2xl mb-2" />
                <span className="text-xs text-center">
                  {productImage ? productImage.name : "Choose File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] && setProductImage(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
              {productImage && (
                <img
                  src={URL.createObjectURL(productImage)}
                  alt="Preview"
                  className="mt-2 h-10 w-auto object-contain rounded-md border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Back Image
              </label>
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-50">
                <FiUploadCloud className="text-2xl mb-2" />
                <span className="text-xs text-center">
                  {productBackImage ? productBackImage.name : "Choose File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] && setProductBackImage(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
              {productBackImage && (
                <img
                  src={URL.createObjectURL(productBackImage)}
                  alt="Preview"
                  className="mt-2 h-10 w-auto object-contain rounded-md border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Gallery Images
              </label>

              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-50">
                <FiUploadCloud className="text-2xl mb-2" />
                <span className="text-xs text-center">
                  {productImageGallery.length > 0
                    ? `${productImageGallery.length} files`
                    : "Choose Files"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    setProductImageGallery(Array.from(e.target.files))
                  }
                />
              </label>

              {/* Preview Images */}
              {productImageGallery.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {productImageGallery.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Product Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Sub Category
              </label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Select Sub Category</option>
                {subCategories?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.subCategoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Materials
              </label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Select Material</option>
                {materials?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.materialName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="1">Featured</option>
                <option value="2">New Arrivals</option>
                <option value="3">Discontinued</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Is Top Rated
              </label>
              <select
                value={productTopRated}
                onChange={(e) => setProductTopRated(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Is Trending Collection
              </label>
              <select
                value={productTrending}
                onChange={(e) => setProductTrending(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Parent Category
              </label>
              <select
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Select Parent Category</option>
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Sub Sub Category
              </label>
              <select
                value={subsubCategoryId}
                onChange={(e) => setSubsubCategoryId(e.target.value)}
                disabled={!subCategoryId}
                className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100"
              >
                <option value="">Select Sub Sub Category</option>
                {subSubCategories?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.subSubCategoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Colors
              </label>
              <select
                value={colorId}
                onChange={(e) => setColorId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Select Color</option>
                {colors?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.colorName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Is Best Selling
              </label>
              <select
                value={productBestSelling}
                onChange={(e) => setProductBestSelling(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Is Upsell
              </label>
              <select
                value={productUpsell}
                onChange={(e) => setProductUpsell(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Estimate Delivery Days
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="e.g. 5"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="max-w-full mt-6">
          <div className="md:flex justify-between gap-4 space-y-4 md:space-y-0">
            <div className="md:w-1/3">
              <label className="block mb-1 font-medium text-gray-700">
                Total In Stocks
              </label>
              <input
                type="number"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="md:w-1/3">
              <label className="block mb-1 font-medium text-gray-700">
                Actual Price
              </label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="md:w-1/3">
              <label className="block mb-1 font-medium text-gray-700">
                Sale Price
              </label>
              <input
                type="number"
                value={productSalePrice}
                onChange={(e) => setProductSalePrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="mt-4 md:w-1/3">
            <label className="block mb-1 font-medium text-gray-700">
              Order
            </label>
            <input
              type="number"
              value={productOrder}
              onChange={(e) => setProductOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex flex-col mt-6 mb-4">
            <label className="mb-2 font-medium text-gray-700">
              Short Description
            </label>
            <div className="bg-white rounded-lg">
              <ReactQuill
                theme="snow"
                value={productDescription}
                onChange={setProductDescription}
                className="h-60 mb-12"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-12 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-10 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAddition;
