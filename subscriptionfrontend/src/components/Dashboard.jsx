import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/Apiconfig";
import { PlusCircle, Edit, Trash2, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    canceled: 0,
  });
 
  const token = localStorage.getItem("token");
//   JSON.parse(token)

  // 🧠 Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/subscriptions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || [];

      setSubscriptions(data);
// console.log(data)
      // Calculate stats
      const total = data.length;
      const active = data.filter((s) => s.status === "active").length;
      const expired = data.filter((s) => s.status === "expired").length;
      const canceled = data.filter((s) => s.status === "canceled").length;

      setStats({ total, active, expired, canceled });
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    try {
      await axios.delete(`${BASE_URL}/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions((prev) => prev.filter((s) => s._id !== id));
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/update-subscription/${id}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-6 hidden md:block">
        <h2 className="text-2xl font-bold text-purple-400 mb-8">SubHub</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-purple-400">
            Dashboard
          </a>
          <Link to="/show-all-subscriptions" className="block hover:text-purple-400">
            Subscriptions
          </Link>
          <a href="/settings" className="block hover:text-purple-400">
            Settings
          </a>
         <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    localStorage.removeItem("token"); // remove token
    window.location.href = "/"; // redirect to login
  }}
  className="block text-red-400 hover:text-red-500"
>
  Logout
</a>

        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <button
            onClick={() => (window.location.href = "/add-subscription")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
          >
            <PlusCircle size={20} /> Add Subscription
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-5 rounded-lg shadow-md text-center">
            <h3 className="text-gray-400 text-sm">Total Subscriptions</h3>
            <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg shadow-md text-center">
            <h3 className="text-gray-400 text-sm">Active</h3>
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg shadow-md text-center">
            <h3 className="text-gray-400 text-sm">Expired</h3>
            <p className="text-2xl font-bold text-yellow-400">{stats.expired}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg shadow-md text-center">
            <h3 className="text-gray-400 text-sm">Canceled</h3>
            <p className="text-2xl font-bold text-red-400">{stats.canceled}</p>
          </div>
        </div>

        {/* Subscription Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Renewal Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-b border-gray-700 hover:bg-gray-750 transition"
                  >
                    <td className="py-3 px-4">{sub.name}</td>
                    <td className="py-3 px-4 capitalize">{sub.category}</td>
                    <td className="py-3 px-4">
                      {sub.currency} {sub.price}
                    </td>
                    <td className="py-3 px-4 capitalize">{sub.frequency}</td>
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
                    <td className="py-3 px-4">
                      {sub.renewaldate
                        ? new Date(sub.renewaldate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(sub._id)}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
