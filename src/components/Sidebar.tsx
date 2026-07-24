import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FolderKanban,
  GitFork,
  Clock,
  Search,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  HelpCircle,
  Code,
  Compass,
  Award,
  Users,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  docCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  docCount
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'upload', label: 'AI Ingestion Center', icon: UploadCloud, badge: 'OCR' },
    { id: 'vault', label: 'Document Vault', icon: FolderKanban, badge: docCount.toString() },
    { id: 'graph', label: 'Knowledge Graph', icon: GitFork, badge: 'AI' },
    { id: 'timeline', label: 'Digital Journey', icon: Clock, badge: null },
    { id: 'search', label: 'AI Natural Search', icon: Search, badge: null },
    { id: 'chat', label: 'RAG Assistant', icon: MessageSquare, badge: 'RAG' },
    { id: 'analytics', label: 'Career Analytics', icon: BarChart3, badge: null },
    { id: 'ats', label: 'Resume ATS Audit', icon: Sparkles, badge: 'ATS' },
    { id: 'prediction', label: 'Placement Forecast', icon: Award, badge: 'AI' },
    { id: 'interview', label: 'AI Interview Practice', icon: HelpCircle, badge: 'PREP' },
    { id: 'skillgap', label: 'Skill Gap Analyzer', icon: Code, badge: 'GAP' },
    { id: 'roadmap', label: 'AI Career Roadmap', icon: Compass, badge: 'PLAN' },
    { id: 'profile', label: 'Digital Profile', icon: User, badge: null },
    { id: 'recruiter', label: 'Recruiter View', icon: Users, badge: 'VIEW' },
    { id: 'admin', label: 'Admin Dashboard', icon: Shield, badge: 'ROOT' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null }
  ];

  return (
    <aside
      className={`fixed left-0 top-[65px] bottom-0 z-30 transition-all duration-300 glass-panel border-r border-slate-800/80 bg-[#0b0f17]/95 backdrop-blur-xl flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Upper Section */}
      <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Bar indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-glow-cyan" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Button */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px]">Engine: MemoryVerse v2.4</span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all mx-auto"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
