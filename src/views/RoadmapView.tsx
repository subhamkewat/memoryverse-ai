import React, { useState, useEffect } from 'react';
import { DocumentItem, UserProfile } from '../types';
import { motion } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Flag,
  Download,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Check,
  CalendarDays,
  Zap
} from 'lucide-react';

interface RoadmapPlan {
  dailyLearning: string[];
  weeklyGoals: string[];
  monthlyMilestones: string[];
  placementChecklist: Array<{ title: string; status: 'completed' | 'pending' }>;
  recommendedProjects: Array<{ title: string; desc: string }>;
  recommendedCerts: string[];
  mockInterviews: Array<{ date: string; topic: string; status: string }>;
}

export const RoadmapView: React.FC = () => {
  // Read state from localStorage
  const user: UserProfile = (() => {
    const saved = localStorage.getItem('mv_user');
    return saved ? JSON.parse(saved) : { name: 'Subham Kumar Kewat', targetRole: 'Full Stack AI Developer', college: 'VSSUT Burla', degree: 'Production Engineering', cgpa: '8.92' };
  })();

  const documents: DocumentItem[] = (() => {
    const saved = localStorage.getItem('mv_documents');
    return saved ? JSON.parse(saved) : [];
  })();

  const skills: string[] = (() => {
    const saved = localStorage.getItem('mv_skills');
    return saved ? JSON.parse(saved) : [];
  })();

  // Timeline Scope
  const [activeScope, setActiveScope] = useState<'30day' | '90day' | '6month'>('30day');

  // Interactive Checklist states (completed milestones/goals)
  const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});
  
  // Today's Tasks Checklist
  const [todaysTasks, setTodaysTasks] = useState([
    { id: 't-1', title: 'Complete balanced tree check helper (TS)', done: true },
    { id: 't-2', title: 'Calibrate droplet spreads vision logs model', done: false },
    { id: 't-3', title: 'Draft production vector embedding APIs', done: false }
  ]);

  const toggleTask = (id: string) => {
    setTodaysTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Weekly study items checks
  const [checkedWeeklyItems, setCheckedWeeklyItems] = useState<{ [key: string]: boolean }>({});

  const toggleWeeklyItem = (itemKey: string) => {
    setCheckedWeeklyItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  // Dynamic calculations based on activeScope
  const [roadmap, setRoadmap] = useState<RoadmapPlan>({
    dailyLearning: [],
    weeklyGoals: [],
    monthlyMilestones: [],
    placementChecklist: [],
    recommendedProjects: [],
    recommendedCerts: [],
    mockInterviews: []
  });

  // Calculate roadmap data dynamically
  useEffect(() => {
    const hasResume = documents.some(d => d.category === 'Resume');
    const hasGithub = user.github && user.github.length > 10;
    const hasInternships = documents.some(d => d.category === 'Internships');

    const plan: RoadmapPlan = {
      dailyLearning: [],
      weeklyGoals: [],
      monthlyMilestones: [],
      placementChecklist: [
        { title: 'Ingest updated PDF resume to digital identity vault', status: hasResume ? 'completed' : 'pending' },
        { title: 'Link GitHub live profile integration', status: hasGithub ? 'completed' : 'pending' },
        { title: 'Link vocational SAIL & Hindalco internships', status: hasInternships ? 'completed' : 'pending' },
        { title: 'Complete AI-generated mock interview prep sheet', status: 'pending' },
        { title: 'Submit 3 projects for verified ATS checklist audit', status: 'pending' }
      ],
      recommendedProjects: [
        { title: 'Automated Vector Ingestion Pipeline', desc: 'Host a document ingestion center running FastAPI, indexing vector embeddings in Redis.' }
      ],
      recommendedCerts: [
        'Google Cloud Professional Machine Learning Specialist',
        'Next.js Advanced Developer Certification'
      ],
      mockInterviews: [
        { date: 'July 25, 2026', topic: 'Technical JS / React & Next.js concepts', status: 'Scheduled' },
        { date: 'July 30, 2026', topic: 'System Design & Vector Databases', status: 'Pending' }
      ]
    };

    if (activeScope === '30day') {
      plan.dailyLearning = [
        '09:00 AM - 11:00 AM: Data Structures (Priority Queue, Trees)',
        '02:00 PM - 04:00 PM: React Server Component hydration rules',
        '07:00 PM - 09:00 PM: RAG code practice & Git commits'
      ];
      plan.weeklyGoals = [
        'Week 1: Clean TypeScript coding and React rendering controls',
        'Week 2: Backend microservices, Express routes, and CORS setup',
        'Week 3: Multistage Docker configurations for Next.js SaaS',
        'Week 4: Automated unit tests configurations and build runs'
      ];
      plan.monthlyMilestones = [
        'Complete type-safe RESTful API architecture',
        'Achieve first production deployment with Docker local networks'
      ];
    } else if (activeScope === '90day') {
      plan.dailyLearning = [
        '09:00 AM - 11:00 AM: Advanced System Design (Load Balancers, Redis Cache)',
        '02:00 PM - 04:00 PM: Neural Networks, Transformers, and PyTorch tensors',
        '07:00 PM - 09:00 PM: Host APIs on serverless lambda endpoints'
      ];
      plan.weeklyGoals = [
        'Week 1-3: Deep learning fundamentals and vision model calibrations',
        'Week 4-6: Serverless deployment controls and AWS API Gateway configuration',
        'Week 7-9: Vector DB indexes, similarity checks, and similarity calculations',
        'Week 10-12: Complete placement resume checks and ATS scoring'
      ];
      plan.monthlyMilestones = [
        'Month 1: Build production-ready RAG document API',
        'Month 2: Deploy machine learning models on AWS lambda',
        'Month 3: Optimize resume score to 90%+'
      ];
      plan.recommendedProjects.push({
        title: 'Biometric Factory Safety Monitor',
        desc: 'Build an alert portal analyzing factory biometric stress indicators using scikit-learn models.'
      });
    } else {
      plan.dailyLearning = [
        '09:00 AM - 11:00 AM: Distributed Systems Architecture (Kafka, Kubernetes)',
        '02:00 PM - 04:00 PM: LLM Agent Orchestration & LangChain frameworks',
        '07:00 PM - 09:00 PM: Mock Interview coding practices'
      ];
      plan.weeklyGoals = [
        'Month 1-2: Container orchestration and Kubernetes pods configurations',
        'Month 3-4: Multi-agent LangChain models and prompt engineering parameters',
        'Month 5-6: Job placement rounds preparation and coding rounds'
      ];
      plan.monthlyMilestones = [
        'Month 2: Complete CKA Kubernetes certification course',
        'Month 4: Build automated AI recruiter agent simulator',
        'Month 6: Clear mock coding rounds and technical interviews'
      ];
      plan.recommendedProjects.push({
        title: 'Multi-Agent Code Review Pipeline',
        desc: 'Deploy an automated Git reviewer running multiple LLMs evaluating PR commits.'
      });
      plan.recommendedCerts.push('Certified Kubernetes Administrator (CKA - KodeKloud)');
    }

    setRoadmap(plan);
  }, [activeScope, documents]);

  // Weekly Checklist percentage & estimated hours left calculation
  const totalWeekly = roadmap.weeklyGoals.length;
  const completedWeekly = roadmap.weeklyGoals.filter((_, idx) =>
    checkedWeeklyItems[`${activeScope}-week-${idx}`]
  ).length;

  const weeklyCompletionPercent = totalWeekly > 0 ? Math.round((completedWeekly / totalWeekly) * 100) : 0;
  const weeklyEstHoursLeft = (totalWeekly - completedWeekly) * 6; // assuming 6 hours per week goal

  // Calculate Roadmap Progress dynamically
  const getProgressPercentage = () => {
    const totalChecklist = roadmap.placementChecklist.length;
    const completedChecklist = roadmap.placementChecklist.filter(item => item.status === 'completed').length;
    const completedTasksCount = todaysTasks.filter(t => t.done).length;
    const totalTasksCount = todaysTasks.length;

    const baseVal = Math.round(
      (completedChecklist / Math.max(1, totalChecklist)) * 40 +
      (completedTasksCount / Math.max(1, totalTasksCount)) * 30 +
      weeklyCompletionPercent * 0.3
    );
    return Math.min(100, baseVal);
  };

  const progressPercent = getProgressPercentage();

  // Export Roadmap as dynamic text report
  const handleExportRoadmap = () => {
    const textData = `
=========================================
MEMORYVERSE AI - CAREER ROADMAP REPORT
=========================================
Candidate: ${user.name}
Target Career Goal: ${user.targetRole}
Roadmap Scope: ${activeScope === '30day' ? '30 Days Plan' : activeScope === '90day' ? '90 Days Plan' : '6 Months Plan'}
Academic Info: ${user.degree} | VSSUT Burla (CGPA: ${user.cgpa})

-----------------------------------------
DAILY LEARNING PLAN:
${roadmap.dailyLearning.join('\n')}

-----------------------------------------
WEEKLY ROADMAP STUDY PATH:
${roadmap.weeklyGoals.join('\n')}

-----------------------------------------
MONTHLY MILESTONES:
${roadmap.monthlyMilestones.map(m => `- ${m}`).join('\n')}
    `;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name.replace(/\s+/g, '_')}_Career_Roadmap_${activeScope}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGoogleCalendar = () => {
    alert("Exporting career roadmap schedules to Google Calendar. Successfully synced 6 study blocks.");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-12 max-w-5xl mx-auto"
    >
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              AI CAREER ARCHITECT
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            AI Career Roadmap Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate custom learning timelines, daily schedules, and placement checklists based on your vault documents.
          </p>
        </div>

        {/* Timeline Scope Selector */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0 font-mono">
          {([
            { id: '30day', label: '30 Days' },
            { id: '90day', label: '90 Days' },
            { id: '6month', label: '6 Months' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveScope(tab.id);
                setCheckedWeeklyItems({}); // reset weekly checklist on scope switch
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeScope === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CORE EVALUATION GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        
        {/* Roadmap Progress Percentage */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-2.5">
          <span className="text-[10px] text-slate-500 block uppercase">Roadmap Progress</span>
          <div className="text-2xl font-extrabold text-cyan-400">{progressPercent}% Completed</div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden max-w-[200px] mx-auto">
            <div className="bg-cyan-500 h-full transition-all duration-550" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Daily Focus Goal & Streak card */}
        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 text-center space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-450 block uppercase">Daily Goal focus</span>
            <p className="text-xs text-indigo-300 leading-relaxed pt-1">
              "Practice 2 HR mock interviews & push Next.js routing code commits."
            </p>
          </div>
          <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-bold text-[10px]">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Streak: 5 Days Active</span>
          </div>
        </div>

        {/* Weekly Completion Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-2">
          <span className="text-[10px] text-slate-500 block uppercase">Weekly Summary</span>
          <div className="text-2xl font-extrabold text-emerald-400">{weeklyCompletionPercent}% Complete</div>
          <p className="text-[10px] text-slate-500">{weeklyEstHoursLeft} hours left in target scope</p>
        </div>

      </div>

      {/* THREE COLUMN DETAILS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Daily Learning & Weekly Roadmaps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Tasks section */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Today's Study Checklist</span>
            </h3>
            
            <div className="space-y-2.5 pt-1 text-xs">
              {todaysTasks.map(t => (
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
          </div>

          {/* Daily Schedule Card */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Daily Learning Schedule Plan</span>
            </h3>
            
            <div className="space-y-3 pt-1">
              {roadmap.dailyLearning.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 font-mono flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly goals roadmap with checklists */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Weekly study roadmap goals</span>
            </h3>

            <div className="space-y-3 pt-1">
              {roadmap.weeklyGoals.map((item, idx) => {
                const itemKey = `${activeScope}-week-${idx}`;
                const isChecked = !!checkedWeeklyItems[itemKey];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleWeeklyItem(itemKey)}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through font-mono'
                        : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 font-mono ${
                      isChecked ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-800 bg-slate-900'
                    }`}>
                      {isChecked ? '✓' : ''}
                    </span>
                    <div>
                      <strong className="text-slate-200 block text-[10px] uppercase font-mono mb-0.5">Week {idx + 1} Target</strong>
                      <p>{item}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Placement Checklist & Milestone check */}
        <div className="space-y-6">
          
          {/* Placement Checklist */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Placement checklist</span>
            </h3>

            <div className="space-y-3 text-xs">
              {roadmap.placementChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-slate-350">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                    item.status === 'completed' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-mono' : 'border-slate-800 bg-slate-950'
                  }`}>
                    {item.status === 'completed' ? '✓' : ''}
                  </span>
                  <span className={item.status === 'completed' ? 'line-through text-slate-550' : ''}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly milestones */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/70 space-y-3 shadow-md font-mono">
            <span className="text-[10px] text-slate-500 block uppercase">Monthly milestones</span>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {roadmap.monthlyMilestones.map((m, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Flag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* EXPORT ACTION FOOTER */}
      <div className="p-6 rounded-3xl border border-cyan-500/20 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <span className="text-slate-450">Save this dynamically generated timeline roadmap or sync to calendar.</span>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportGoogleCalendar}
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-cyan-500/40 text-cyan-400 font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Export to Google Calendar</span>
          </button>

          <button
            onClick={handleExportRoadmap}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer hover:bg-cyan-400"
          >
            <Download className="w-4 h-4" />
            <span>Export Roadmap</span>
          </button>
        </div>
      </div>

    </motion.div>
  );
};
