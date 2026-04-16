import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  // Sample data
  const pieData = [
    { name: "Ayurveda", value: 400 },
    { name: "Siddha", value: 300 },
    { name: "Unani", value: 300 },
  ];
  const barData = [
    { month: "Jan", mappings: 40 },
    { month: "Feb", mappings: 80 },
    { month: "Mar", mappings: 65 },
    { month: "Apr", mappings: 120 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Healthcare Dashboard</h1>
        <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-full">
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Total Codes</h2>
          <p className="text-2xl font-bold">12,345</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">ICD Mappings</h2>
          <p className="text-2xl font-bold">8,450</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Active Users</h2>
          <p className="text-2xl font-bold">1,230</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Hospitals Linked</h2>
          <p className="text-2xl font-bold">98</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Traditional Systems Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Monthly ICD Mappings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mappings" fill="#005596" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>✅ Added 50 new Ayurveda codes</li>
          <li>✅ Mapped Siddha codes to ICD-11 successfully</li>
          <li>✅ API v2.0 launched for hospitals</li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow">
          Upload Dataset
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow">
          Generate Mapping
        </button>
        <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-full shadow">
          Download Report
        </button>
      </div>
    </div>
  );
}
