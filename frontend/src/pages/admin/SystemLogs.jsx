import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Terminal, 
  Database, 
  Server,
  RefreshCcw,
  ShieldCheck,
  Cpu,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchLogs = useCallback(async (signal) => {
    try {
      const [logsRes, metricsRes] = await Promise.all([
        api.get('/api/system/logs?limit=100', { signal }),
        api.get('/api/system/metrics', { signal })
      ]);
      if (logsRes.success) setLogs(logsRes.data);
      if (metricsRes.success) setMetrics(metricsRes.data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch system data:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(controller.signal);
    return () => controller.abort();
  }, [fetchLogs]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchLogs();
    setLastRefresh(new Date());
    toast.success('System data refreshed');
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'ERROR': return 'text-red-500';
      case 'WARNING': return 'text-yellow-500';
      case 'SUCCESS': return 'text-emerald-500';
      default: return 'text-blue-400';
    }
  };

  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Status</h1>
          <p className="text-gray-500 font-medium">Real-time health monitoring of Sheger Health infrastructure.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-gray-900/10 hover:scale-105 transition-transform disabled:opacity-50"
        >
          <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          Force Sync
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Server Status", 
            value: metrics?.server?.status === 'operational' ? 'Operational' : 'Unknown', 
            icon: Server, 
            color: metrics?.server?.status === 'operational' ? 'text-emerald-500' : 'text-gray-400', 
            bg: metrics?.server?.status === 'operational' ? 'bg-emerald-50' : 'bg-gray-50' 
          },
          { 
            label: "Uptime", 
            value: formatUptime(metrics?.server?.uptime), 
            icon: Clock, 
            color: 'text-purple-500', 
            bg: 'bg-purple-50' 
          },
          { 
            label: "DB Health", 
            value: metrics?.database?.status === 'connected' ? `${metrics.database.latency}` : 'Down', 
            icon: Database, 
            color: metrics?.database?.status === 'connected' ? 'text-blue-500' : 'text-red-500', 
            bg: metrics?.database?.status === 'connected' ? 'bg-blue-50' : 'bg-red-50' 
          },
          { 
            label: "Security", 
            value: metrics?.security?.rateLimiting === 'active' ? 'Protected' : 'Unknown', 
            icon: ShieldCheck, 
            color: metrics?.security?.rateLimiting === 'active' ? 'text-emerald-500' : 'text-gray-400', 
            bg: metrics?.security?.rateLimiting === 'active' ? 'bg-emerald-50' : 'bg-gray-50' 
          },
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

      {metrics?.memory && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">RSS Memory</p>
            <p className="text-lg font-black text-gray-900">{metrics.memory.rss}</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Heap Used</p>
            <p className="text-lg font-black text-gray-900">{metrics.memory.heapUsed}</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Node Version</p>
            <p className="text-lg font-black text-gray-900">{metrics?.server?.nodeVersion || 'N/A'}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-[40px] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Terminal size={20} className="text-emerald-500" />
             <h3 className="text-white font-bold">System Kernel Logs</h3>
             <span className="text-xs text-gray-500 font-mono">
               Last: {lastRefresh.toLocaleTimeString()}
             </span>
          </div>
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500 opacity-50" />
             <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50" />
             <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="p-8 space-y-4 font-mono text-sm max-h-[600px] overflow-y-auto">
           {isLoading ? (
             <div className="space-y-3">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />
               ))}
             </div>
           ) : logs.length === 0 ? (
             <div className="text-center py-12">
               <Activity className="mx-auto text-gray-600 mb-3" size={36} />
               <p className="text-gray-400 font-semibold">No audit logs recorded yet</p>
               <p className="text-gray-600 text-xs mt-1">System events will appear here once users interact with the platform.</p>
             </div>
           ) : (
             logs.map((log, idx) => (
               <div key={log.id || idx} className="flex gap-6 items-start group">
                  <span className="text-gray-600 whitespace-nowrap text-xs">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className={`font-bold whitespace-nowrap ${getLogColor(log.type)}`}>
                    {log.type}
                  </span>
                  <span className="text-gray-500 font-bold whitespace-nowrap text-xs">
                    [{log.action}]
                  </span>
                  <p className="text-gray-300 group-hover:text-white transition-colors text-xs">
                    {log.message}
                  </p>
               </div>
             ))
           )}
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
