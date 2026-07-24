import React, { useState } from 'react';
import { TimelineMilestone, DocumentCategory } from '../types';
import { Award, Calendar, CheckCircle2, Sparkles, Filter, FileText, ArrowUpRight, ChevronDown, ChevronUp, Flag } from 'lucide-react';

interface TimelineViewProps {
  milestones: TimelineMilestone[];
  onOpenDocModalById: (docId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ milestones, onOpenDocModalById }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const handleToggleExpand = (id: string) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(item => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const getYearFromDate = (dateStr: string) => {
    const match = dateStr.match(/\b(20\d{2})\b/);
    return match ? match[1] : 'Ongoing';
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academics':
      case 'education':
        return {
          border: 'border-blue-500/20 hover:border-blue-500/50 bg-[#0f172a]/80',
          text: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          dot: 'border-blue-400 bg-blue-400 shadow-blue-500/20'
        };
      case 'projects':
        return {
          border: 'border-sky-500/20 hover:border-sky-500/50 bg-[#0f172a]/80',
          text: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
          dot: 'border-sky-400 bg-sky-400 shadow-sky-500/20'
        };
      case 'hackathons':
        return {
          border: 'border-purple-500/20 hover:border-purple-500/50 bg-[#0f172a]/80',
          text: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          dot: 'border-purple-400 bg-purple-400 shadow-purple-500/20'
        };
      case 'internships':
        return {
          border: 'border-emerald-500/20 hover:border-emerald-500/50 bg-[#0f172a]/80',
          text: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          dot: 'border-emerald-400 bg-emerald-400 shadow-emerald-500/20'
        };
      case 'research':
        return {
          border: 'border-cyan-500/20 hover:border-cyan-500/50 bg-[#0f172a]/80',
          text: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          dot: 'border-cyan-400 bg-cyan-400 shadow-cyan-500/20'
        };
      case 'achievements':
        return {
          border: 'border-amber-500/20 hover:border-amber-500/50 bg-[#0f172a]/80',
          text: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          dot: 'border-amber-400 bg-amber-400 shadow-amber-500/20'
        };
      case 'certifications':
      case 'certificates':
        return {
          border: 'border-indigo-500/20 hover:border-indigo-500/50 bg-[#0f172a]/80',
          text: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
          dot: 'border-indigo-400 bg-indigo-400 shadow-indigo-500/20'
        };
      default:
        return {
          border: 'border-slate-800/85 hover:border-cyan-500/40 bg-[#0f172a]/85',
          text: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          dot: 'border-cyan-400 bg-cyan-400 shadow-cyan-500/20'
        };
    }
  };

  // Filter milestones based on tab selection
  const filteredMilestones = milestones.filter(
    (m) => selectedCategory === 'All' || m.category === selectedCategory
  );

  // Group milestones by Year
  const groupedByYear: { [year: string]: TimelineMilestone[] } = {};
  filteredMilestones.forEach(m => {
    const year = getYearFromDate(m.date);
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    groupedByYear[year].push(m);
  });

  // Sort years in descending order
  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

  // Progress Milestones Checklist Data (VSSUT Timeline indicators)
  const journeyMilestones = [
    { title: 'VSSUT Burla Admission', period: '2023', status: 'completed' },
    { title: 'Hindalco Industrial Internship', period: 'Dec 2025', status: 'completed' },
    { title: 'SAIL vocational Internship', period: 'Jan 2026', status: 'completed' },
    { title: 'IIT Bhilai Fluidics Research', period: 'May 2026', status: 'completed' },
    { title: 'Expected Graduation B.Tech', period: '2027', status: 'current' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              CHRONOLOGICAL CAREER MAP
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Digital Journey Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological career achievements automatically sequenced and grouped by year.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          {['All', 'Academics', 'Achievements', 'Research', 'Projects', 'Certifications', 'Internships'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC PROGRESS MILESTONES BAR */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
          <Flag className="w-4 h-4 text-cyan-400" />
          <span>Identity Journey Milestones Progress</span>
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {journeyMilestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between space-y-1.5 transition-all ${
                m.status === 'completed'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-850 text-cyan-400/80 animate-pulse'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase block">{m.period}</span>
              <span className="text-[10px] font-bold text-slate-200 block truncate">{m.title}</span>
              <span className="text-[9px] font-bold block">
                {m.status === 'completed' ? '✓ Ingested & Verified' : '◷ In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AUTO-GROUPED TIMELINE BY YEAR */}
      <div className="space-y-10">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-6">
            
            {/* Year Header Marker */}
            <div className="flex items-center space-x-3">
              <span className="text-lg font-extrabold font-outfit text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                {year}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/25 to-transparent" />
            </div>

            {/* Sub-Timeline Items */}
            <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-850">
              
              {groupedByYear[year].map((m, idx) => {
                const styles = getCategoryColor(m.category);
                const isExpanded = expandedIds.includes(m.id);

                return (
                  <div
                    key={m.id}
                    className="relative group animate-fadeIn"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    
                    {/* Node dot with matching category indicator */}
                    <div className={`absolute -left-6 sm:-left-10 top-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0b0f17] border-2 ${styles.dot} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    {/* Card container */}
                    <div
                      onClick={() => handleToggleExpand(m.id)}
                      className={`p-5 rounded-2xl border ${styles.border} transition-all cursor-pointer shadow-xl relative overflow-hidden`}
                    >
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${styles.text}`}>
                            {m.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{m.date}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400">{m.organization}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="text-base font-bold font-outfit text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {m.title}
                        </h3>
                        
                        {/* Expandable description body */}
                        {isExpanded ? (
                          <div className="mt-3 space-y-4 animate-fadeIn">
                            <p className="text-xs text-slate-300 leading-relaxed font-light">
                              {m.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                              {m.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 text-[9px] rounded bg-slate-950 text-indigo-300 border border-slate-850 font-mono"
                                >
                                  #{skill}
                                </span>
                              ))}
                            </div>

                            {m.documentId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDocModalById(m.documentId!);
                                }}
                                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[10px] font-semibold transition-all border border-slate-800 flex items-center space-x-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Inspect Associated Certificate</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {m.description}
                          </p>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
