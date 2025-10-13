import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../api/dashboard";
import { DashboardStats } from "../types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.data);
      } catch (err) {
        setError("Failed to load dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Items</h2>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalItems || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Pending Requests</h2>
          <p className="text-3xl font-bold text-orange-600">{stats?.pendingRequests || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Low Stock Items</h2>
          <p className="text-3xl font-bold text-red-600">{stats?.lowStockItems.length || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/items")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Inventory
          </button>
          <button
            onClick={() => navigate("/requests")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Requests
          </button>
          <button
            onClick={() => navigate("/items/add")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentActivities.map((activity) => (
                <tr key={activity.id} className="border-t">
                  <td className="px-4 py-2">{activity.action}</td>
                  <td className="px-4 py-2">{activity.itemName}</td>
                  <td className="px-4 py-2">{activity.user || "System"}</td>
                  <td className="px-4 py-2">{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {!stats?.recentActivities.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    No recent activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats?.lowStockItems.length && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Low Stock Alert</h2>
          <div className="bg-red-50 p-4 rounded-lg">
            <ul>
              {stats.lowStockItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <strong>{item.name}</strong> - Stock: {item.stock} {item.category && `(${item.category})`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
