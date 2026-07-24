import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Search, Bell, Moon, Sun, Shield, LayoutDashboard, Globe, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onNavigate,
  darkMode,
  onToggleTheme,
  onOpenSearch
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic notifications state with priority and read flags
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Shortlisted for Interview',
      desc: 'Google selected your verified profile for full-stack role coding stage.',
      time: '10m ago',
      unread: true,
      priority: 'success' as 'success' | 'warning' | 'critical' | 'recommendation'
    },
    {
      id: 'n-2',
      title: 'CGPA Below Cutoff Alert',
      desc: 'NVIDIA cutoff is 8.0. Your current profile CGPA is 8.92 (Shortlisted). SAIL requires 7.0.',
      time: '2h ago',
      unread: true,
      priority: 'warning' as 'success' | 'warning' | 'critical' | 'recommendation'
    },
    {
      id: 'n-3',
      title: 'Action Item Required',
      desc: 'Resume ATS Score is currently under 80% threshold. Optimize details immediately.',
      time: '1d ago',
      unread: true,
      priority: 'critical' as 'success' | 'warning' | 'critical' | 'recommendation'
    },
    {
      id: 'n-4',
      title: 'Recommended project',
      desc: 'Add 1 project containing Docker container configuration to increase match probability.',
      time: '2d ago',
      unread: false,
      priority: 'recommendation' as 'success' | 'warning' | 'critical' | 'recommendation'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getPriorityStyle = (p: 'success' | 'warning' | 'critical' | 'recommendation') => {
    switch (p) {
      case 'success':
        return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/5 text-amber-400';
      case 'critical':
        return 'border-red-500/20 bg-red-500/5 text-red-400';
      case 'recommendation':
        return 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400';
      default:
        return 'border-slate-800 bg-slate-900/60 text-slate-300';
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-xl px-4 lg:px-8 py-3 flex items-center justify-between">
      
      {/* Brand Logo & View Selector */}
      <div className="flex items-center space-x-6">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0b0f17] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-outfit font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                MemoryVerse
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest font-mono">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Digital Identity System</p>
          </div>
        </div>

        {/* View Switching Pills: Landing Page vs Dashboard */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => onNavigate('landing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView !== 'landing'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>App Platform</span>
          </button>
        </div>
      </div>

      {/* Global Natural Language Quick Search trigger */}
      <div className="flex-1 max-w-md mx-6 hidden lg:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 text-xs transition-all shadow-inner group cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span>Search documents, skills, projects with AI...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Action Controls & User Profile Badge */}
      <div className="flex items-center space-x-3">

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
          title="Toggle Theme Mode"
          aria-label="Toggle Theme Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative font-mono">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
            aria-label="Toggle Activity Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
              </>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/95 shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Activity Alerts</span>
                
                <div className="flex items-center space-x-2 text-[10px]">
                  {unreadCount > 0 && (
                    <span className="font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {unreadCount} New
                    </span>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-red-400 hover:text-red-300 flex items-center space-x-1 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${getPriorityStyle(n.priority)} ${
                      n.unread ? 'opacity-100 font-bold' : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="uppercase text-[9px] font-bold tracking-wider">{n.title}</span>
                      <span className="text-[9px] font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed mt-1 font-sans font-light">{n.desc}</p>
                    
                    {/* Unread circle badge */}
                    {n.unread && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-405" />
                    )}
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    All notifications cleared.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div 
          onClick={() => onNavigate('profile')}
          className="flex items-center space-x-3 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition-all"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-cyan-300 transition-colors">{user.name}</div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">{user.careerScore}% Readiness</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
