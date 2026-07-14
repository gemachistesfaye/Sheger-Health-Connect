import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Terminal, 
  Database, 
  AlertCircle, 
  Server,
  RefreshCcw,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const SystemLogs = () => {
  const [logs] = useState([
    { id: 1, type: 'SUCCESS', message: 'Database optimization completed', time: '2 mins ago', node: 'Node-01' },
    { id: 2, type: 'INFO', message: 'New user registration: Abebe Balcha', time: '15 mins ago', node: 'Node-01' },
    { id: 3, type: 'WARNING', message: 'High CPU usage detected in AI Engine', time: '1 hour ago', node: 'AI-Cluster-A' },
    { id: 4, type: 'ERROR', message: 'Failed to sync medical record #8292', time: '2 hours ago', node: 'Storage-Primary' },
    { id: 5, type: 'SUCCESS', message: 'System backup pushed to CloudVault', time: '5 hours ago', node: 'System-Core' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Status</h1>
          <p className="text-gray-500 font-medium">Real-time health monitoring of Sheger Health infrastructure.</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-gray-900/10 hover:scale-105 transition-transform">
          <RefreshCcw size={20} />
          Force Sync
        </button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Server Status", value: "Operational", icon: Server, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "AI Latency", value: "124ms", icon: Cpu, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "DB Health", value: "99.9%", icon: Database, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Security", value: "Encrypted", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-4`}>
              <m.icon size={24} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{m.label}</p>
            <p className="text-xl font-black text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Logs Window */}
      <div className="bg-gray-900 rounded-[40px] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Terminal size={20} className="text-emerald-500" />
             <h3 className="text-white font-bold">System Kernel Logs</h3>
          </div>
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500 opacity-50" />
             <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50" />
             <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="p-8 space-y-4 font-mono text-sm">
           {logs.map((log) => (
             <div key={log.id} className="flex gap-6 items-start group">
                <span className="text-gray-600 whitespace-nowrap">[{log.time}]</span>
                <span className={`font-bold whitespace-nowrap ${
                  log.type === 'ERROR' ? 'text-red-500' : 
                  log.type === 'WARNING' ? 'text-yellow-500' : 
                  log.type === 'SUCCESS' ? 'text-emerald-500' : 'text-blue-400'
                }`}>
                  {log.type}
                </span>
                <span className="text-gray-400 font-bold">[{log.node}]</span>
                <p className="text-gray-300 group-hover:text-white transition-colors">{log.message}</p>
             </div>
           ))}
           <div className="pt-4 flex items-center gap-2 text-emerald-500 animate-pulse">
             <span className="w-2 h-2 rounded-full bg-emerald-500" />
             <span>Listening for system events...</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
