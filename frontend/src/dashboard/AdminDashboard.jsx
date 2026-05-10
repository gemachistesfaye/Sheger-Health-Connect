import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Mon', patients: 40, revenue: 2400 },
  { name: 'Tue', patients: 30, revenue: 1398 },
  { name: 'Wed', patients: 20, revenue: 9800 },
  { name: 'Thu', patients: 27, revenue: 3908 },
  { name: 'Fri', patients: 18, revenue: 4800 },
  { name: 'Sat', patients: 23, revenue: 3800 },
  { name: 'Sun', patients: 34, revenue: 4300 },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl tracking-wider text-primary border-b border-slate-800">
          Sheger Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-primary rounded-lg font-medium text-white shadow-sm">
            Overview
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            Users Management
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            All Appointments
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            System Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full text-left px-4 py-2 text-slate-400 hover:text-white transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Command Center</h1>
            <p className="text-muted-foreground">Welcome, Administrator {user?.full_name}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-primary">
            <h3 className="text-sm font-bold text-gray-400 mb-1">Total Patients</h3>
            <p className="text-2xl font-bold text-slate-800">1,248</p>
            <p className="text-xs text-green-500 mt-2">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
            <h3 className="text-sm font-bold text-gray-400 mb-1">Active Doctors</h3>
            <p className="text-2xl font-bold text-slate-800">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500">
            <h3 className="text-sm font-bold text-gray-400 mb-1">Pending Appointments</h3>
            <p className="text-2xl font-bold text-slate-800">16</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
            <h3 className="text-sm font-bold text-gray-400 mb-1">Weekly Revenue</h3>
            <p className="text-2xl font-bold text-slate-800">ETB 45,200</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Flow Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Patient Flow (This Week)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="patients" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Revenue Trend (ETB)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
