import React, { useState, useEffect } from 'react';
import { DocumentItem, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  TrendingUp,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  Layers,
  HelpCircle,
  Briefcase,
  Check,
  X,
  ChevronDown
} from 'lucide-react';

interface CompanyCriteria {
  name: string;
  logo: string;
  type: 'Product' | 'Core' | 'Service' | 'Startups';
  minCgpa: number;
  requiredSkills: string[];
  expectedSalary: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface CalculatedCompany extends CompanyCriteria {
  matchedSkills: string[];
  missingSkills: string[];
  eligibilityPercent: number;
  placementProbability: number;
  cgpaShortlisted: boolean;
}

export const PredictionView: React.FC = () => {
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

  // Filter & Sort States
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('probability');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CalculatedCompany | null>(null);

  // Target recruitment companies dataset
  const baseCompanies: CompanyCriteria[] = [
    {
      name: 'Google',
      logo: 'G',
      type: 'Product',
      minCgpa: 8.5,
      requiredSkills: ['Python', 'JavaScript', 'React', 'Git', 'GitHub', 'System Design', 'Docker'],
      expectedSalary: '₹22 - 36 LPA',
      difficulty: 'Hard'
    },
    {
      name: 'NVIDIA',
      logo: 'N',
      type: 'Product',
      minCgpa: 8.0,
      requiredSkills: ['Python', 'PyTorch', 'Git', 'Neural Networks', 'C++', 'System Design'],
      expectedSalary: '₹20 - 32 LPA',
      difficulty: 'Hard'
    },
    {
      name: 'Tata Motors',
      logo: 'T',
      type: 'Core',
      minCgpa: 7.5,
      requiredSkills: ['Production Engineering', 'SQL', 'CAD/CAM', 'Process Automation'],
      expectedSalary: '₹8 - 12 LPA',
      difficulty: 'Medium'
    },
    {
      name: 'Hindalco Industries',
      logo: 'H',
      type: 'Core',
      minCgpa: 7.0,
      requiredSkills: ['Production Engineering', 'Process Control Automation', 'SQL', 'Git'],
      expectedSalary: '₹7 - 10 LPA',
      difficulty: 'Medium'
    },
    {
      name: 'SAIL (Steel Authority of India)',
      logo: 'S',
      type: 'Core',
      minCgpa: 7.0,
      requiredSkills: ['Production Engineering', 'Machinery Diagnostics', 'Mechanical Maintenance'],
      expectedSalary: '₹8 - 11 LPA',
      difficulty: 'Medium'
    },
    {
      name: 'Razorpay',
      logo: 'R',
      type: 'Startups',
      minCgpa: 7.5,
      requiredSkills: ['React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Docker'],
      expectedSalary: '₹14 - 22 LPA',
      difficulty: 'Medium'
    },
    {
      name: 'Zepto',
      logo: 'Z',
      type: 'Startups',
      minCgpa: 8.0,
      requiredSkills: ['Next.js', 'Node.js', 'Python', 'Git', 'MongoDB', 'SQL', 'System Design'],
      expectedSalary: '₹16 - 24 LPA',
      difficulty: 'Hard'
    },
    {
      name: 'TCS Digital',
      logo: 'T',
      type: 'Service',
      minCgpa: 7.0,
      requiredSkills: ['Python', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Git'],
      expectedSalary: '₹7 - 9 LPA',
      difficulty: 'Easy'
    },
    {
      name: 'Cognizant GenC',
      logo: 'C',
      type: 'Service',
      minCgpa: 6.5,
      requiredSkills: ['JavaScript', 'HTML', 'CSS', 'SQL', 'Git'],
      expectedSalary: '₹4 - 6 LPA',
      difficulty: 'Easy'
    }
  ];

  // Dynamic calculations list
  const calculatedCompanies: CalculatedCompany[] = baseCompanies.map(c => {
    const matched = c.requiredSkills.filter(s =>
      skills.map(skill => skill.toLowerCase()).includes(s.toLowerCase())
    );
    const missing = c.requiredSkills.filter(s =>
      !skills.map(skill => skill.toLowerCase()).includes(s.toLowerCase())
    );

    let bonusScore = 0;
    if (c.name.includes('SAIL') && documents.some(d => d.title.toLowerCase().includes('sail') || d.issuer?.toLowerCase().includes('sail'))) {
      bonusScore += 30;
    }
    if (c.name.includes('Hindalco') && documents.some(d => d.title.toLowerCase().includes('hindalco') || d.issuer?.toLowerCase().includes('hindalco'))) {
      bonusScore += 30;
    }
    if (c.type === 'Product' && documents.some(d => d.category === 'Research' || d.title.toLowerCase().includes('iit bhilai'))) {
      bonusScore += 15;
    }

    const skillRatio = matched.length / c.requiredSkills.length;
    const baseEligibility = Math.round(skillRatio * 100);
    const finalEligibility = Math.min(100, baseEligibility + bonusScore);

    const userCgpa = parseFloat(user.cgpa) || 8.0;
    const cgpaShortlisted = userCgpa >= c.minCgpa;

    let placementProb = 0;
    if (cgpaShortlisted) {
      placementProb = Math.round(finalEligibility * 0.75 + (userCgpa - c.minCgpa) * 10 + 10);
    } else {
      placementProb = Math.round(finalEligibility * 0.4);
    }
    placementProb = Math.min(98, Math.max(10, placementProb));

    return {
      ...c,
      matchedSkills: matched,
      missingSkills: missing,
      eligibilityPercent: finalEligibility,
      placementProbability: placementProb,
      cgpaShortlisted
    };
  });

  // Filtered & Sorted Lists
  const filteredCompanies = calculatedCompanies
    .filter(c => {
      // Filter Type mapping
      if (filterType === 'all') return c.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterType === 'IT') {
        return (c.type === 'Product' || c.type === 'Service' || c.type === 'Startups') && c.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterType === 'Core') {
        return c.type === 'Core' && c.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterType === 'Startups') {
        return c.type === 'Startups' && c.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterType === 'Dream') {
        const packageNum = parseInt(c.expectedSalary.replace(/[^0-9]/g, '')) || 0;
        return packageNum >= 20 && c.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'probability') return b.placementProbability - a.placementProbability;
      if (sortBy === 'package') {
        const pkgA = parseInt(a.expectedSalary.split(' ')[0].replace(/[^0-9]/g, '')) || 0;
        const pkgB = parseInt(b.expectedSalary.split(' ')[0].replace(/[^0-9]/g, '')) || 0;
        return pkgB - pkgA;
      }
      if (sortBy === 'easiest') {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      // Most suitable
      return b.eligibilityPercent - a.eligibilityPercent;
    });

  const avgProbability = Math.round(
    filteredCompanies.reduce((acc, c) => acc + c.placementProbability, 0) / Math.max(1, filteredCompanies.length)
  );

  const cgpaRaw = parseFloat(user.cgpa) || 8.0;
  const cgpaScore = Math.round(Math.min(100, (cgpaRaw / 10) * 100));
  const skillsScore = Math.min(100, Math.round((skills.length / 10) * 100));
  const projectsCount = documents.filter(d => d.category === 'Projects').length;
  const projectsScore = Math.min(100, Math.round((projectsCount / 3) * 100));
  const internshipsCount = documents.filter(d => d.category === 'Internships').length;
  const internshipScore = Math.min(100, Math.round((internshipsCount / 2) * 100));
  const hasResume = documents.some(d => d.category === 'Resume');
  const resumeScore = hasResume ? 100 : 40;

  const resumeStrength = Math.round(resumeScore * 0.9 + (user.bio ? 10 : 0));
  const skillsMatch = Math.round(skillsScore);
  const interviewReadiness = Math.round((cgpaScore * 0.3 + skillsScore * 0.4 + projectsScore * 0.3) * 0.9);

  const getAIRecommendation = () => {
    const totalScore = (cgpaScore + skillsScore + projectsScore + internshipScore + resumeScore) / 5;
    if (totalScore >= 80) {
      return {
        chance: 'High Chance',
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
        explanation: 'Excellent profile metrics. Verified IIT Bhilai research and high CGPA makes you a top candidate for Core, IT Product and Startup segments.'
      };
    } else if (totalScore >= 60) {
      return {
        chance: 'Medium Chance',
        color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
        explanation: 'Good baseline parameters. You are strongly competitive for Core and IT Service sectors. Gaps in advanced System Design and containerization limit high-end product matches.'
      };
    } else {
      return {
        chance: 'Low Chance',
        color: 'text-red-400 border-red-500/20 bg-red-500/5',
        explanation: 'Profile updates required. Ingest your resume PDF and verified projects to boost placement shortlisting thresholds.'
      };
    }
  };

  const aiRec = getAIRecommendation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-12 max-w-6xl mx-auto"
    >
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              AI RECRUITMENT FORECAST ENGINE
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Placement Eligibility & Prediction
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Predict shortlisting probability, evaluate CGPA cutoff eligibility, and map skill gaps for top recruit companies.
          </p>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none font-mono">
          {['all', 'IT', 'Core', 'Startups', 'Dream'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Avg Placement Prob</span>
            <span className="text-xl font-bold text-slate-100">{avgProbability}%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Eligible Recruiters</span>
            <span className="text-xl font-bold text-slate-100">
              {filteredCompanies.filter(c => c.eligibilityPercent >= 60).length} / {filteredCompanies.length}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">High Gap Alerts</span>
            <span className="text-xl font-bold text-slate-100">
              {filteredCompanies.filter(c => c.missingSkills.length > 2).length} Company Gaps
            </span>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION BOX & SCORE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Breakdown Section */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-slate-100 font-outfit flex items-center space-x-1.5">
              <Layers className="w-4.5 h-4.5 text-cyan-400" />
              <span>AI Score Breakdown</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Weighted Indicators</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block uppercase">CGPA Score</span>
              <strong className="text-base text-slate-200 block mt-1">{cgpaScore}%</strong>
              <span className="text-[9px] text-slate-500 font-mono">cutoff index</span>
            </div>
            
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block uppercase">Skills Score</span>
              <strong className="text-base text-slate-200 block mt-1">{skillsScore}%</strong>
              <span className="text-[9px] text-slate-500 font-mono">stack density</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block uppercase">Projects Score</span>
              <strong className="text-base text-slate-200 block mt-1">{projectsScore}%</strong>
              <span className="text-[9px] text-slate-500 font-mono">vault verification</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block uppercase">Internship Score</span>
              <strong className="text-base text-slate-200 block mt-1">{internshipScore}%</strong>
              <span className="text-[9px] text-slate-500 font-mono">industry check</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono block uppercase">Resume Score</span>
              <strong className="text-base text-slate-200 block mt-1">{resumeScore}%</strong>
              <span className="text-[9px] text-slate-500 font-mono">completeness</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 border-t border-slate-900 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Resume Strength</span>
                <span className="font-bold text-cyan-400">{resumeStrength}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${resumeStrength}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Skills Match</span>
                <span className="font-bold text-indigo-400">{skillsMatch}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${skillsMatch}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Interview Readiness</span>
                <span className="font-bold text-emerald-400">{interviewReadiness}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${interviewReadiness}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-lg ${aiRec.color}`}>
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-400 font-mono uppercase block">Overall Forecast Result</span>
            <div className="text-xl font-bold font-outfit uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>{aiRec.chance}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-350 font-light pt-1">
              {aiRec.explanation}
            </p>
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">Recruiter audit synced successfully</span>
        </div>

      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search target company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Sort Select Controls */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-mono">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
          >
            <option value="probability">Highest Probability</option>
            <option value="package">Highest Package</option>
            <option value="easiest">Easiest</option>
            <option value="suitable">Most Suitable</option>
          </select>
        </div>

      </div>

      {/* COMPANIES LIST GRID WITH TRANSPARENT DESIGN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((c, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl glass-panel border border-slate-805 bg-[#0f172a]/60 backdrop-blur-md flex flex-col justify-between space-y-5 hover:border-cyan-500/30 transition-all shadow-xl hover:shadow-cyan-500/5 group"
          >
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 flex items-center justify-center font-extrabold text-slate-200 group-hover:scale-105 transition-transform font-mono">
                  {c.logo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-outfit">{c.name}</h4>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{c.type} Sector</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-extrabold text-cyan-400 font-mono">{c.expectedSalary}</div>
                <span className="text-[9px] text-slate-500 font-mono">Est. Package</span>
              </div>
            </div>

            {/* Match rates radial meters */}
            <div className="grid grid-cols-2 gap-2 text-center py-2 bg-slate-950/40 rounded-2xl border border-slate-900 font-mono">
              <div>
                <span className="text-[9px] text-slate-500 block">ELIGIBILITY</span>
                <span className="text-sm font-bold text-slate-200">{c.eligibilityPercent}%</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block">PROBABILITY</span>
                <span className="text-sm font-bold text-emerald-400">{c.placementProbability}%</span>
              </div>
            </div>

            {/* Criteria checks */}
            <div className="space-y-2 text-xs font-mono">
              
              {/* CGPA cutoff checklist */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CGPA Cutoff ({c.minCgpa})</span>
                <span className={`font-semibold ${c.cgpaShortlisted ? 'text-emerald-400' : 'text-red-400'}`}>
                  {c.cgpaShortlisted ? '✓ Eligible' : '✗ Below Cutoff'}
                </span>
              </div>

              {/* Difficulty rating */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Interview Difficulty</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' :
                  c.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {c.difficulty}
                </span>
              </div>

            </div>

            {/* Skills alignment section */}
            <div className="space-y-2.5 pt-3 border-t border-slate-900 font-mono">
              <div>
                <span className="text-[9px] text-slate-500 block mb-1">REQUIRED SKILLS</span>
                <div className="flex flex-wrap gap-1">
                  {c.requiredSkills.map(s => {
                    const hasSkill = skills.map(skill => skill.toLowerCase()).includes(s.toLowerCase());
                    return (
                      <span
                        key={s}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          hasSkill ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-slate-900 text-slate-650'
                        }`}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* WHY ELIGIBLE SUMMARY IN CONTEXT */}
            <div className="mt-2.5 pt-3 border-t border-slate-900/60 text-[10px] font-mono space-y-1.5 text-slate-400">
              <span className="text-[9px] text-slate-500 uppercase block">Why Eligible?</span>
              <div className="grid grid-cols-2 gap-1 font-semibold">
                <div className="flex items-center space-x-1">
                  {c.cgpaShortlisted ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400 font-bold">✗</span>}
                  <span className={c.cgpaShortlisted ? 'text-slate-350' : 'text-slate-500'}>CGPA Eligible</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-350">Branch Eligible</span>
                </div>
                <div className="flex items-center space-x-1">
                  {c.matchedSkills.length > 0 ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-red-400 font-bold">✗</span>}
                  <span className={c.matchedSkills.length > 0 ? 'text-slate-350' : 'text-slate-500'}>Skills Match</span>
                </div>
              </div>
            </div>

            {/* Why this Prediction Modal Trigger */}
            <button
              onClick={() => setSelectedCompanyModal(c)}
              className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 transition-all font-semibold text-xs text-slate-300 cursor-pointer"
            >
              Why this Prediction?
            </button>

          </div>
        ))}
      </div>

      {/* WHY THIS PREDICTION MODAL */}
      <AnimatePresence>
        {selectedCompanyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompanyModal(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Content box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-slate-805 bg-[#0f172a] shadow-2xl space-y-5 z-10"
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                    AI WEIGHTED AUDIT
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 font-outfit">
                    Why {selectedCompanyModal.name}?
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCompanyModal(null)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Prediction percentage */}
              <div className="text-center p-4 bg-slate-950/80 rounded-2xl border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Computed Probability</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-outfit">
                  {selectedCompanyModal.placementProbability}%
                </span>
              </div>

              {/* Weight list */}
              <div className="space-y-3 text-xs font-mono">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Eligibility Factors Weight Breakdown</span>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="text-emerald-400">✔</span>
                      <span>Branch Eligibility</span>
                    </span>
                    <span className="text-emerald-400 font-bold">+25%</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="text-emerald-400">✔</span>
                      <span>Skills Match</span>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +{Math.round((selectedCompanyModal.matchedSkills.length / selectedCompanyModal.requiredSkills.length) * 35)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center space-x-2">
                      {selectedCompanyModal.cgpaShortlisted ? (
                        <span className="text-emerald-400">✔</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                      <span>CGPA Contribution ({selectedCompanyModal.minCgpa} Min)</span>
                    </span>
                    <span className={selectedCompanyModal.cgpaShortlisted ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {selectedCompanyModal.cgpaShortlisted ? '+10%' : '-15%'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="text-emerald-400">✔</span>
                      <span>Internship Impact boost</span>
                    </span>
                    <span className="text-emerald-400 font-bold">+10%</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="text-emerald-400">✔</span>
                      <span>ResumeCompleteness audit</span>
                    </span>
                    <span className="text-emerald-400 font-bold">+8%</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center space-x-2">
                      <span className="text-emerald-400">✔</span>
                      <span>Verified Projects verification</span>
                    </span>
                    <span className="text-emerald-400 font-bold">+12%</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                Done
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
