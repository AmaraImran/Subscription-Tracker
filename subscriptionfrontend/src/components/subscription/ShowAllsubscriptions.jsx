import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, XCircle } from "lucide-react";
import BASE_URL from "../../config/Apiconfig";

/* 🔹 Skeleton Loader */
const TableSkeleton = ({ rows = 5 }) => {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-gray-700 animate-pulse">
      {Array.from({ length: 9 }).map((__, j) => (
        <td key={j} className="py-3 px-4">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </td>
      ))}
    </tr>
  ));
};

export default function UserSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  /* 🔹 Read localStorage safely */
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser?._id || null);
      }

      if (storedToken) setToken(storedToken);
    } catch (err) {
      console.error("Invalid auth data in localStorage",err);
    }
  }, []);

  /* 🔹 Fetch subscriptions only when ready */
  useEffect(() => {
    if (!userId || !token) return;

    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/subscriptions/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSubscriptions(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId, token]);

  /* 🔹 Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubscriptions((prev) => prev.filter((sub) => sub._id !== id));
    } catch (err) {
      console.error("Error deleting subscription:", err);
    }
  };

  /* 🔹 Cancel */
  const handleCancel = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/subscriptions/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, status: "canceled" } : sub
        )
      );
    } catch (err) {
      console.error("Error canceling subscription:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-purple-400">
          My Subscriptions
        </h1>
        <button
          onClick={() => (window.location.href = "/add-subscription")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
        >
          <PlusCircle size={20} /> Add Subscription
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Frequency</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">Renewal Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4">{sub.name}</td>
                  <td className="py-3 px-4 capitalize">{sub.category}</td>
                  <td className="py-3 px-4">
                    {sub.currency} {sub.price}
                  </td>
                  <td className="py-3 px-4 capitalize">{sub.frequency}</td>
                  <td className="py-3 px-4">{sub.paymentmethod}</td>
                  <td className="py-3 px-4">
                    {new Date(sub.startdate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {sub.renewaldate
                      ? new Date(sub.renewaldate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : sub.status === "canceled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {sub.status === "active" && (
                      <button
                        onClick={() => handleCancel(sub._id)}
                        className="text-yellow-400 hover:text-yellow-500 mr-3"
                        title="Cancel"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="text-red-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-10 text-gray-400 italic"
                >
                  You have no subscriptions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
