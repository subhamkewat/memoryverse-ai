import React, { useState, useEffect } from 'react';
import { UserProfile, DocumentItem, AnalyticsSummary } from '../types';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  FileText,
  Brain,
  FolderKanban,
  Award,
  BookOpen,
  GitFork,
  ArrowUpRight,
  Upload,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Clock,
  Plus,
  Bell,
  Calendar,
  Activity,
  ChevronRight,
  TrendingDown,
  Compass
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  documents: DocumentItem[];
  analytics: AnalyticsSummary;
  onNavigate: (view: string) => void;
  onOpenDocModal: (doc: DocumentItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  documents,
  analytics,
  onNavigate,
  onOpenDocModal
}) => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    docs: 0,
    skills: 0,
    projects: 0,
    internships: 0,
    certs: 0,
    achievements: 0
  });

  // Today's Tasks checklist state
  const [tasks, setTasks] = useState([
    { id: 'dt-1', title: 'Complete AI-generated mock interview prep sheet', done: true },
    { id: 'dt-2', title: 'Optimize resume score above 90% threshold', done: false },
    { id: 'dt-3', title: 'Verify Google Cloud ML cert on profile', done: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Simulated Loading State & Animated Count Up
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const duration = 1000; // ms
      const steps = 30;
      const stepTime = duration / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        setCounts({
          docs: Math.round((analytics.totalDocuments / steps) * step),
          skills: Math.round((analytics.skillsExtracted / steps) * step),
          projects: Math.round((analytics.projectsCount / steps) * step),
          internships: Math.round((analytics.internshipsCount / steps) * step),
          certs: Math.round((analytics.certificationsCount / steps) * step),
          achievements: Math.round((analytics.achievementsCount / steps) * step)
        });

        if (step >= steps) {
          clearInterval(interval);
          setCounts({
            docs: analytics.totalDocuments,
            skills: analytics.skillsExtracted,
            projects: analytics.projectsCount,
            internships: analytics.internshipsCount,
            certs: analytics.certificationsCount,
            achievements: analytics.achievementsCount
          });
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [loading, analytics]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamic Placement Notifications
  const placementNotifications = (() => {
    const savedApplied = localStorage.getItem('mv_applied_companies');
    const appliedList: string[] = savedApplied ? JSON.parse(savedApplied) : [];
    
    const baseList = [
      { id: 'n-1', company: 'Google Inc.', event: 'Shortlisted for Full Stack AI role', date: 'July 24, 2026', type: 'success' },
      { id: 'n-2', company: 'Amazon', event: 'Coding Round invitation dispatched', date: 'July 28, 2026', type: 'info' },
      { id: 'n-3', company: 'System Audit', event: 'Resume ATS score matched cut-offs', date: 'July 22, 2026', type: 'success' }
    ];

    appliedList.forEach((company, idx) => {
      baseList.unshift({
        id: `applied-notify-${idx}`,
        company: company,
        event: 'Application successfully received. Credential profile under recruiter review.',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'success'
      });
    });

    return baseList;
  })();

  // Dynamic Upcoming Interviews
  const upcomingInterviews = (() => {
    const savedApplied = localStorage.getItem('mv_applied_companies');
    const appliedList: string[] = savedApplied ? JSON.parse(savedApplied) : [];

    const baseInterviews = [
      { id: 'i-1', title: 'Technical JS / React & Next.js concepts', date: 'July 25, 2026', time: '10:00 AM', status: 'Scheduled' },
      { id: 'i-2', title: 'System Design & Vector Databases', date: 'July 30, 2026', time: '02:00 PM', status: 'Pending' }
    ];

    appliedList.forEach((company, idx) => {
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + 3 + idx);
      
      baseInterviews.unshift({
        id: `applied-interview-${idx}`,
        title: `${company} SDE Round 1 Interview`,
        date: interviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: '11:00 AM',
        status: 'Scheduled'
      });
    });

    return baseInterviews;
  })();

  // Recent Activity log entries
  const recentActivities = [
    { id: 'act-1', text: 'Uploaded IIT Bhilai spreading paper to vault', time: '1 hour ago' },
    { id: 'act-2', text: 'Completed HR mock practice canvas (Scored 88%)', time: '5 hours ago' },
    { id: 'act-3', text: 'Linked GitHub live metrics integration', time: '1 day ago' },
    { id: 'act-4', text: 'Vectorized SAIL Oxygen diagnostics report', time: '2 days ago' }
  ];

  const expDuration = '5 Months Verified';
  const expHighlights = 'IIT Bhilai, SAIL, Hindalco';

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        {/* Banner Skeleton */}
        <div className="h-44 rounded-3xl bg-slate-900/60 border border-slate-850" />
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-850" />
          ))}
        </div>
        {/* Row Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-72 rounded-3xl bg-slate-900/60 border border-slate-850 col-span-2" />
          <div className="h-72 rounded-3xl bg-slate-900/60 border border-slate-850" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      
      {/* 1. WELCOME CARD & READINESS SCORE HEADER BANNER */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/40 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Welcome Card Info */}
          <div className="flex items-center space-x-5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-cyan-500/30 shadow-xl shadow-cyan-500/10"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Target Role: {user.targetRole}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified Identity
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-100 mt-2">
                {getGreeting()}, {user.name.split(' ')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl line-clamp-1">
                {user.college} | {user.degree} (CGPA: {user.cgpa})
              </p>
            </div>
          </div>

          {/* Placement Readiness Score Gauge */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-6 min-w-[270px] shadow-inner">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - user.careerScore / 100)}
                  strokeLinecap="round"
                  className="text-cyan-400 transition-all duration-1000"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xl font-extrabold font-outfit text-slate-100">
                {user.careerScore}%
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+3% this month</span>
              </div>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Readiness Score</h4>
              <p className="text-[11px] text-slate-400">High Tier Placement Tier</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS WITH HOVER SCALE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Documents", count: counts.docs, icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Skills Extracted", count: counts.skills, icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Projects Ingested", count: counts.projects, icon: FolderKanban, color: "text-sky-400", bg: "bg-sky-500/10" },
          { label: "Internships", count: counts.internships, icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Certifications", count: counts.certs, icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Achievements", count: counts.achievements, icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" }
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              whileHover={{ scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.4)' }}
              key={idx}
              className="p-4 rounded-2xl glass-panel border border-slate-805 bg-slate-900/30 transition-all shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">Sync</span>
              </div>
              <div className="text-2xl font-extrabold font-outfit text-slate-100">{s.count}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. THREE COLUMN WORKSPACE PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Daily Focus & Weekly Progress */}
        <div className="space-y-6">
          
          {/* Today's Tasks */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-905">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Today's Tasks</h3>
              <span className="text-[9px] text-slate-500 font-mono">Check complete</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`p-3 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                    t.done ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through' : 'bg-slate-950 border-slate-850 text-slate-200 hover:border-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    t.done ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-800 bg-slate-900'
                  }`}>
                    {t.done ? '✓' : ''}
                  </span>
                  <span>{t.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Progress telemetry */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg"
          >
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Weekly Progress</h3>
            
            <div className="space-y-3.5 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Week 1: Core Technologies</span>
                  <span className="text-emerald-400">100%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Week 2: Backend REST APIs</span>
                  <span className="text-cyan-400">65%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Week 3: Container Deployment</span>
                  <span className="text-slate-550">0%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-900 h-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Column 2: Placement Notifications & Upcoming Interviews */}
        <div className="space-y-6">
          
          {/* Placement Notifications */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Placement Alerts</span>
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[8px] font-mono">Live</span>
            </div>

            <div className="space-y-3">
              {placementNotifications.map(n => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <strong className="text-slate-250 font-bold">{n.company}</strong>
                    <span className="text-slate-550 font-mono">{n.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{n.event}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg"
          >
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Upcoming Interviews</span>
            </h3>

            <div className="space-y-3">
              {upcomingInterviews.map(i => (
                <div key={i.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-200 block truncate max-w-[150px]">{i.title}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">{i.date} @ {i.time}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${
                    i.status === 'Scheduled' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-slate-500 border border-slate-850'
                  }`}>
                    {i.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Column 3: Recent Activity & Quick Actions */}
        <div className="space-y-6">
          
          {/* Recent Activity */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg"
          >
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity Log</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              {recentActivities.map(act => (
                <div key={act.id} className="flex justify-between items-start space-x-2 leading-relaxed text-slate-350">
                  <div className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <p className="text-[11px]">{act.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-550 shrink-0 font-mono mt-0.5">{act.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-3xl glass-panel border border-slate-850 bg-[#0f172a]/70 space-y-4.5 shadow-lg"
          >
            <span className="text-[10px] text-slate-500 font-mono block uppercase">Quick Actions</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => onNavigate('upload')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => onNavigate('search')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              <button
                onClick={() => onNavigate('skillgap')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Gap Analyzer</span>
              </button>

              <button
                onClick={() => onNavigate('roadmap')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Roadmap</span>
              </button>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Footer Meta Timestamp info */}
      <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono pt-4 border-t border-slate-900">
        <span>System Engine: MemoryVerse v2.4</span>
        <span>Last Profile Update: Today, 3:30 PM</span>
      </div>

    </motion.div>
  );
};
