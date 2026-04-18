import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { 
  HiOutlineDatabase, 
  HiOutlineGlobeAlt, 
  HiOutlineUsers, 
  HiOutlineOfficeBuilding,
  HiOutlineCloudUpload,
  HiOutlineSparkles,
  HiOutlineDocumentDownload,
  HiOutlineLogout
} from "react-icons/hi";

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
    { month: "May", mappings: 150 },
    { month: "Jun", mappings: 210 },
  ];

  // Colors matching the platform's theme: Ayurveda (Emerald), Siddha (Teal), Unani (Cyan)
  const COLORS = ["#10b981", "#14b8a6", "#06b6d4"];

  const stats = [
    { title: "Total Codes", value: "12,345", icon: HiOutlineDatabase, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "ICD Mappings", value: "8,450", icon: HiOutlineGlobeAlt, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Active Users", value: "1,230", icon: HiOutlineUsers, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    { title: "Hospitals Linked", value: "98", icon: HiOutlineOfficeBuilding, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  // Custom Tooltip style for dark mode Recharts
  const customTooltipStyle = {
    backgroundColor: 'rgba(4, 19, 13, 0.9)',
    backdropFilter: 'blur(10px)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div className="relative min-h-screen bg-[#04130d] text-white font-sans p-6 sm:p-8 lg:p-10 overflow-hidden selection:bg-emerald-500/30 z-0">
      
      {/* ── Global Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-400/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">Admin Panel</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tighter text-white">
              System <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Dashboard</span>
            </h1>
          </div>
          <button className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium tracking-wide text-red-400 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 transition-all duration-300">
            <HiOutlineLogout className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Logout
          </button>
        </div> */}

        {/* Stats Cards */}
        <div className=" pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.05)] overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">{stat.title}</h2>
                  <p className="text-3xl font-light text-white tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          
          {/* Pie Chart */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-semibold mb-1 text-white tracking-tight">System Distribution</h2>
            <p className="text-sm text-white/40 font-light mb-6">Proportion of codes by traditional system</p>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-semibold text-white">1,000</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Total</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-semibold mb-1 text-white tracking-tight">Mapping Activity</h2>
            <p className="text-sm text-white/40 font-light mb-6">Monthly ICD-11 cross-references completed</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={customTooltipStyle} 
                  />
                  <Bar dataKey="mappings" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorGradient)`} />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Activity & Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-6 text-white tracking-tight">Recent System Activity</h2>
            <div className="space-y-6">
              {[
                { time: "2 hours ago", text: "Added 50 new Ayurveda codes from NAMASTE registry.", type: "add" },
                { time: "5 hours ago", text: "Mapped 12 Siddha symptom codes to ICD-11 chapters.", type: "map" },
                { time: "1 day ago", text: "Global API v2.0 launched for registered hospital partners.", type: "launch" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="relative flex flex-col items-center mt-1">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 border-[#04130d] ring-1 ${
                      item.type === 'add' ? 'bg-emerald-400 ring-emerald-500/50' : 
                      item.type === 'map' ? 'bg-blue-400 ring-blue-500/50' : 
                      'bg-purple-400 ring-purple-500/50'
                    }`} />
                    {i !== 2 && <div className="w-px h-full bg-white/10 mt-2" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">{item.text}</p>
                    <p className="text-xs text-white/40 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-center gap-4">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">Quick Actions</h2>
            
            <button className="group flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <HiOutlineCloudUpload className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white">Upload Dataset</span>
              </div>
            </button>

            <button className="group flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                  <HiOutlineSparkles className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white">Generate AI Mapping</span>
              </div>
            </button>

            <button className="group flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <HiOutlineDocumentDownload className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white">Export Report</span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}