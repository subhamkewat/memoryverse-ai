import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Users,
  Cpu,
  Database,
  HardDrive,
  FileCheck,
  Activity,
  LineChart as LineIcon,
  RefreshCw,
  Clock,
  Terminal,
  Settings,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const AdminView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock Admin Metrics
  const metrics = {
    usersRegistered: 284,
    documentsIndexed: 1450,
    storageUsed: '842 MB',
    apiCallsCount: 42801,
    avgLatency: '184ms',
    errorRate: '0.04%'
  };

  // Mock Logs List
  const [logs, setLogs] = useState([
    { id: '1', event: 'Gemini RAG Query', user: 'subham.kewat@example.com', status: '200 OK', time: 'Just now' },
    { id: '2', event: 'PDF OCR Extraction', user: 'pooja.sharma@example.com', status: '200 OK', time: '5m ago' },
    { id: '3', event: 'Vector Nodes Linking', user: 'ankit.mishra@example.com', status: '201 Created', time: '12m ago' },
    { id: '4', event: 'Supabase Sync Profile', user: 'subham.kewat@example.com', status: '200 OK', time: '20m ago' },
    { id: '5', event: 'Interview Prep Eval', user: 'pooja.sharma@example.com', status: '200 OK', time: '1h ago' }
  ]);

  // Chart data: API Consumption trend
  const apiConsumptionData = [
    { day: 'Mon', requests: 4800, tokens: 1.2 },
    { day: 'Tue', requests: 5200, tokens: 1.5 },
    { day: 'Wed', requests: 6100, tokens: 1.8 },
    { day: 'Thu', requests: 5800, tokens: 1.6 },
    { day: 'Fri', requests: 7200, tokens: 2.1 },
    { day: 'Sat', requests: 4100, tokens: 1.1 },
    { day: 'Sun', requests: 4500, tokens: 1.3 }
  ];

  // Storage Usage by Document Category
  const storageBreakdownData = [
    { name: 'Projects', value: 340, color: '#06b6d4' },
    { name: 'Internships', value: 210, color: '#34d399' },
    { name: 'Certificates', value: 180, color: '#a855f7' },
    { name: 'Resumes', value: 112, color: '#f59e0b' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshMetrics = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // Append a mock log entry
      setLogs([
        { id: `log-${Date.now()}`, event: 'Metrics Refresh Trigger', user: 'Admin Console', status: '200 OK', time: 'Just now' },
        ...logs
      ]);
    }, 800);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="h-44 rounded-3xl bg-slate-900/60 border border-slate-850" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-850" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-12 max-w-6xl mx-auto"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
              SYSTEM ROOT ACCESS
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Administrative Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor system storage, API logs, database health, RAG vectors performance, and telemetry error metrics.
          </p>
        </div>

        <button
          onClick={handleRefreshMetrics}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-805 hover:border-cyan-500/40 text-cyan-400 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer font-mono"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* CORE TELEMETRY STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
        {[
          { label: 'Total Users', val: metrics.usersRegistered, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Documents', val: metrics.documentsIndexed, icon: FileCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Storage Ingested', val: metrics.storageUsed, icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'API Calls', val: metrics.apiCallsCount, icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Avg Latency', val: metrics.avgLatency, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Error Rate', val: metrics.errorRate, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl glass-panel border border-slate-850 bg-slate-900/30">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-slate-500">Live</span>
              </div>
              <strong className="text-lg text-slate-100 block">{m.val}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">{m.label}</span>
            </div>
          );
        })}
      </div>

      {/* CHART GRAPH METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* API Consumption Area Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <LineIcon className="w-4 h-4 text-cyan-400" />
              <span>API Consumption Trend (Vite + Gemini Calls)</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Requests / Day</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apiConsumptionData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Area type="monotone" dataKey="requests" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Storage Ingestion MB</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">By Category</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storageBreakdownData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {storageBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SYSTEM LOGS & TELEMETRY PROCESS LIST */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg font-mono text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-slate-900">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>OCR Extraction & RAG Process Logs</span>
          </h3>
          <span className="text-[9px] text-slate-500">Auto-refreshing log stream</span>
        </div>

        <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center text-[11px] leading-relaxed">
              <div className="flex items-center space-x-3 text-slate-300">
                <span className="text-slate-500">[{log.time}]</span>
                <span className="text-cyan-400 font-semibold">{log.event}</span>
                <span className="text-slate-500">|</span>
                <span>User: {log.user}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                log.status.includes('OK') || log.status.includes('Created')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
