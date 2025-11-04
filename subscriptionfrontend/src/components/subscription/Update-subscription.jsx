import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config/Apiconfig"; // your backend base URL
import { useNavigate, useParams } from "react-router-dom";

const UpdateSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // subscription id from route /update/:id

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    currency: "USD",
    frequency: "monthly",
    category: "",
    paymentmethod: "",
    status: "active",
    startdate: "",
    renewaldate: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing subscription details
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/subscriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const sub = res.data.data;
          console.log(sub)
          setFormData({
            name: sub.name || "",
            price: sub.price || "",
            currency: sub.currency || "USD",
            frequency: sub.frequency || "monthly",
            category: sub.category || "",
            paymentmethod: sub.paymentmethod || "",
            status: sub.status || "active",
            startdate: sub.startdate
              ? sub.startdate.split("T")[0]
              : "",
            renewaldate: sub.renewaldate
              ? sub.renewaldate.split("T")[0]
              : "",
          });
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        alert("Failed to load subscription details!");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${BASE_URL}/subscriptions/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("Subscription updated successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-purple-400">
        Loading subscription details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#2a003f] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#111111] shadow-2xl rounded-2xl p-8 border border-purple-800">
        <h2 className="text-3xl font-semibold text-center text-purple-400 mb-6">
          Update Subscription
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-gray-300 mb-2 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
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
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
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
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
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
              value={formData.paymentmethod}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
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
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Renewal Date */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Renewal Date</label>
            <input
              type="date"
              name="renewaldate"
              value={formData.renewaldate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Update Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubscription;
