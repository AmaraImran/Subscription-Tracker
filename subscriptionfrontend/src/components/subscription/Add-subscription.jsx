import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../config/Apiconfig";
import { useNavigate } from "react-router-dom";

const AddSubscription = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    currency: "USD",
    frequency: "monthly",
    category: "",
    paymentmethod: "",
    status: "active",
    startdate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/subscriptions/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("✅ Subscription added successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("❌ Failed to add subscription!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#2a003f] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-[#111111] shadow-2xl rounded-2xl p-6 sm:p-10 border border-purple-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-purple-400 mb-8">
          Add New Subscription
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-gray-300 mb-2 text-sm">Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Netflix"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Price</label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 1200"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            >
              {["USD", "EUR", "GBP", "INR", "JPY", "PKR"].map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            >
              {["daily", "weekly", "monthly", "yearly"].map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            >
              <option value="">Select Category</option>
              {[
                "entertainment",
                "productivity",
                "education",
                "health",
                "technology",
                "other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Payment Method
            </label>
            <input
              type="text"
              name="paymentmethod"
              placeholder="e.g. Credit Card, Easypaisa"
              value={formData.paymentmethod}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            >
              {["active", "inactive", "canceled", "expired"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Start Date</label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscription;
