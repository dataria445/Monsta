"use client";

import { IoIosClose } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Save, ChevronRight } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FaqAddition = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqOrder, faqSetOrder] = useState("");

  const apiBaseUrl = import.meta.env.VITE_APIBASE;

  const handleCreate = (e) => {
    e.preventDefault();

    const payload = { faqQuestion: question, faqAnswer: answer, faqOrder };

    axios
      .post(`${apiBaseUrl}/faq/create`, payload)
      .then((res) => {
        const finalres = res.data;

        if (finalres.success) {
          toast.success("FAQ created successfully!");

          // ✅ Navigate back after 1 second
          setTimeout(() => {
            navigate(-1);
          }, 500);
        } else {
          toast.error("Failed to create FAQ!");
        }

        setQuestion("");
        setAnswer("");
        faqSetOrder("");
      })
      .catch((err) => {
        console.error("Error creating FAQ:", err);
        toast.error("Failed to create FAQ!");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create FAQ
            </h1>

            {/* Breadcrumb */}
            <nav className="flex items-center text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Dashboard
              </a>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

              <a href="#" className="text-blue-600 hover:text-blue-800">
                Faqs
              </a>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

              <span className="text-gray-600">Create FAQ</span>
            </nav>
          </div>

          <button className="text-gray-500 hover:text-gray-700">
            <IoIosClose className="text-3xl" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative">

          {/* Side Close */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          >
            <IoIosCloseCircleOutline className="text-3xl" />
          </button>

          <form className="space-y-6" onSubmit={handleCreate}>
            {/* Question Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Answer Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                rows="8"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter answer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            {/* Order Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={faqOrder}
                onChange={(e) => faqSetOrder(e.target.value)}
                placeholder="Enter order number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Create FAQ
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default FaqAddition;
