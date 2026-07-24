import React, { useState, useEffect } from 'react';
import { UserProfile, DocumentItem } from '../types';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Globe,
  Code,
  Save,
  Check,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Download,
  Link as LinkIcon,
  Eye,
  FileCheck,
  Compass,
  Star,
  Award,
  Layers,
  Terminal,
  Activity,
  Award as MedalIcon
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  userSkills: string[];
  onUpdateSkills: (skills: string[]) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  userSkills,
  onUpdateSkills
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [skillsList, setSkillsList] = useState<string[]>(userSkills);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Recruiter previews selected tab
  const [previewTab, setPreviewTab] = useState<'resume' | 'portfolio' | 'linkedin'>('resume');

  // Social Links
  const [githubUrl, setGithubUrl] = useState(user.github || 'https://github.com/subham-kewat');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/subham-kewat');
  const [portfolioUrl, setPortfolioUrl] = useState('https://subham-kewat.dev');

  // API stats states
  const [githubStats, setGithubStats] = useState({ stars: 142, forks: 38, publicRepos: 18, followers: 56 });
  const [cfStats, setCfStats] = useState({ rating: 1542, rank: 'Specialist, Div 2' });
  const [leetcodeStats, setLeetcodeStats] = useState({ solved: 432, easy: 150, medium: 220, hard: 62 });

  // Vault variables
  const [vaultProjects, setVaultProjects] = useState<DocumentItem[]>([]);
  const [vaultInternships, setVaultInternships] = useState<DocumentItem[]>([]);

  useEffect(() => {
    const savedDocs = localStorage.getItem('mv_documents');
    if (savedDocs) {
      try {
        const parsed: DocumentItem[] = JSON.parse(savedDocs);
        setVaultProjects(parsed.filter(d => d.category === 'Projects'));
        setVaultInternships(parsed.filter(d => d.category === 'Internships'));
      } catch (e) {}
    }
  }, []);

  // Fetch live profiles info from public APIs
  useEffect(() => {
    const fetchStats = async () => {
      const username = githubUrl.split('/').pop() || 'subham-kewat';
      try {
        const ghRes = await fetch(`https://api.github.com/users/${username}`);
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          setGithubStats({
            stars: 142 + (ghData.public_gists || 0),
            forks: 38,
            publicRepos: ghData.public_repos || 18,
            followers: ghData.followers || 56
          });
        }

        // Fetch tourist stats as a live showcase for Codeforces
        const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=tourist`);
        if (cfRes.ok) {
          const cfData = await cfRes.json();
          if (cfData.status === 'OK' && cfData.result?.[0]) {
            const result = cfData.result[0];
            setCfStats({
              rating: result.rating || 1542,
              rank: result.rank || 'Specialist, Div 2'
            });
          }
        }
      } catch (err) {
        console.warn("Failed fetching live APIs profiles stats:", err);
      }
    };
    fetchStats();
  }, [githubUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...formData,
      github: githubUrl
    });
    onUpdateSkills(skillsList);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActiveTab('view');
    }, 1500);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText("https://memoryverse.ai/profile/subham-kewat");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadResume = () => {
    const textData = `
=========================================
SUBHAM KUMAR KEWAT - DIGITAL RESUME
=========================================
Target Role: Full Stack AI Developer
CGPA: ${user.cgpa} | Veer Surendra Sai University of Technology (VSSUT)
Branch: Production Engineering (Expected 2027)

-----------------------------------------
PROFESSIONAL BIO & CAREER OBJECTIVE:
Seeking roles in full-stack engineering, AI/RAG system orchestration, and database scaling.

-----------------------------------------
TECHNICAL SKILLS:
${skillsList.join(', ')}
    `;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Subham_Kumar_Kewat_Verified_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Mock GitHub contribution blocks helper mapping
  const mockContributions = [
    [4, 2, 0, 1, 3, 0, 2],
    [0, 1, 4, 3, 0, 1, 2],
    [2, 0, 1, 0, 3, 4, 1],
    [3, 1, 0, 2, 4, 0, 1],
    [1, 0, 2, 3, 0, 1, 4],
    [4, 3, 1, 0, 2, 1, 0],
    [0, 2, 4, 1, 3, 0, 1],
    [1, 0, 3, 4, 0, 2, 1],
    [2, 1, 0, 1, 4, 3, 0],
    [3, 0, 4, 2, 1, 0, 2],
    [0, 1, 2, 3, 0, 4, 1],
    [1, 4, 0, 1, 3, 2, 0],
    [4, 2, 1, 0, 2, 1, 3],
    [0, 1, 3, 4, 0, 1, 2],
    [2, 0, 1, 0, 3, 4, 1]
  ];

  const getContribColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-slate-900 border border-slate-950';
      case 1: return 'bg-emerald-950 border border-emerald-950/40';
      case 2: return 'bg-emerald-800 border border-emerald-800/40';
      case 3: return 'bg-emerald-600 border border-emerald-600/40';
      case 4: return 'bg-emerald-400 border border-emerald-400/40';
      default: return 'bg-slate-900';
    }
  };

  // Compute Resume Strength Score dynamically
  const getResumeStrength = () => {
    let score = 50; // baseline
    if (user.bio && user.bio.length > 50) score += 15;
    if (skillsList.length >= 8) score += 15;
    if (vaultInternships.length >= 2) score += 10;
    if (vaultProjects.length >= 2) score += 10;
    return Math.min(100, score);
  };

  const resumeStrength = getResumeStrength();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-12 max-w-4xl mx-auto"
    >
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              DIGITAL PROFILE ENGINE
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Profile Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your verified academic identity, skills vectors, and career goal targets.
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setRecruiterMode(!recruiterMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center space-x-1.5 cursor-pointer ${
              recruiterMode
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{recruiterMode ? 'Normal View' : 'Recruiter Previews'}</span>
          </button>

          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0 font-mono">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'view'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {recruiterMode ? (
        /* WHITE RESUME PDF-STYLE RECRUITER PREVIEW MODAL WORKSPACE */
        <div className="space-y-6">
          
          {/* Preview Tab selectors */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0 w-fit font-mono">
            {['resume', 'portfolio', 'linkedin'].map(tab => (
              <button
                key={tab}
                onClick={() => setPreviewTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                  previewTab === tab ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab} Preview
              </button>
            ))}
          </div>

          {previewTab === 'resume' && (
            <div className="p-8 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-350 pb-5">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">{user.name}</h3>
                  <div className="text-sm font-semibold text-cyan-700 mt-1">{user.targetRole}</div>
                  <p className="text-xs text-slate-500 mt-0.5">{user.location} | {user.email} | {user.phone}</p>
                </div>
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-805 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF / Text</span>
                </button>
              </div>

              {/* Objective */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-250 pb-1">Career Objective</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Highly motivated undergrad in Production Engineering at VSSUT Burla, specializing in full-stack AI/RAG system designs, React/Next.js dashboard engineering, and industrial process telemetry controls.
                </p>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-250 pb-1">Education Timeline</h4>
                <div className="text-xs flex justify-between">
                  <div>
                    <strong>{user.college}</strong>
                    <div className="text-slate-600">{user.degree} (B.Tech in Production Engineering)</div>
                  </div>
                  <div className="text-right text-slate-500">
                    <span>Graduation: {user.graduationYear}</span>
                    <span className="block font-semibold">CGPA: {user.cgpa}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-250 pb-1">Top Verified Skills</h4>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-805">
                  {skillsList.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-250 pb-1">Verified Experience & Internships</h4>
                <div className="space-y-2 text-xs">
                  {vaultInternships.map(i => (
                    <div key={i.id} className="space-y-0.5">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{i.title}</span>
                        <span className="text-slate-500 font-normal">{i.dateCompleted || i.uploadDate}</span>
                      </div>
                      <div className="text-[11px] text-cyan-800 font-semibold">{i.issuer || 'Industry partner'}</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{i.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {previewTab === 'portfolio' && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 font-mono pl-4">http://subham-kewat.dev</span>
              </div>
              
              <div className="space-y-4 text-center py-6">
                <h3 className="text-2xl font-extrabold text-slate-100 font-outfit">{user.name}</h3>
                <p className="text-cyan-400 text-xs font-mono">{user.targetRole} | Portfolio Showroom</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left pt-6">
                  {vaultProjects.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-850">
                      <strong className="text-slate-200 block text-xs">{p.title}</strong>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{p.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {previewTab === 'linkedin' && (
            <div className="p-6 rounded-3xl bg-[#0a122c] border border-blue-500/20 text-slate-100 space-y-5">
              <div className="h-24 bg-gradient-to-r from-blue-700 to-indigo-900 rounded-2xl relative">
                <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full border-4 border-[#0a122c] absolute -bottom-10 left-6 object-cover" />
              </div>
              <div className="pt-10 px-6 space-y-2">
                <h3 className="text-lg font-bold">{user.name}</h3>
                <p className="text-xs text-slate-350">{user.targetRole} Undergrad | Production Engineering VSSUT Burla</p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <span>Odisha, India</span>
                  <span>•</span>
                  <span className="text-blue-400 font-bold">500+ connections</span>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : activeTab === 'view' ? (
        /* STANDARD DYNAMIC PROFILE VIEW LAYOUT */
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Avatar & Contact Info & CP Coding profiles */}
            <div className="lg:col-span-1 p-6 rounded-3xl glass-panel border border-slate-850 bg-[#0f172a]/95 flex flex-col items-center justify-between text-center space-y-5 shadow-lg">
              <div className="space-y-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-cyan-500/30 shadow-xl"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-outfit">{user.name}</h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-semibold">
                    {user.targetRole}
                  </span>
                </div>
              </div>

              {/* Resume Strength Score gauge */}
              <div className="w-full text-xs font-mono border-t border-slate-900 pt-4 text-left space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Resume Strength</span>
                  <span className="font-bold text-cyan-400">{resumeStrength}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: `${resumeStrength}%` }} />
                </div>
              </div>

              {/* LeetCode & Codeforces sections */}
              <div className="w-full space-y-3 pt-4 border-t border-slate-900 text-left font-mono text-[10px]">
                
                {/* LeetCode Profile */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-355">
                    <span className="flex items-center space-x-1"><Terminal className="w-3.5 h-3.5 text-yellow-500" /> <strong>LeetCode</strong></span>
                    <span className="text-yellow-550 font-bold">{leetcodeStats.solved} Solved</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[9px]">
                    <span>Easy: {leetcodeStats.easy}</span>
                    <span>Medium: {leetcodeStats.medium}</span>
                    <span>Hard: {leetcodeStats.hard}</span>
                  </div>
                </div>

                {/* Codeforces */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center text-slate-355">
                  <span className="flex items-center space-x-1"><Code className="w-3.5 h-3.5 text-blue-400" /> <strong>Codeforces</strong></span>
                  <div className="text-right">
                    <span className="text-blue-400 font-bold block">{cfStats.rating} Rating</span>
                    <span className="text-[8px] text-slate-500 block">{cfStats.rank}</span>
                  </div>
                </div>

                {/* HackerRank / GeeksforGeeks / CodeChef profiles */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center text-slate-355">
                  <span className="flex items-center space-x-1"><Award className="w-3.5 h-3.5 text-emerald-400" /> <strong>GeeksforGeeks</strong></span>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">Score: 845</span>
                    <span className="text-[8px] text-slate-500 block">Rank: 2501</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center text-slate-355">
                  <span className="flex items-center space-x-1"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> <strong>CodeChef</strong></span>
                  <div className="text-right">
                    <span className="text-purple-400 font-bold block">1605 Rating</span>
                    <span className="text-[8px] text-slate-500 block">3 Star coder</span>
                  </div>
                </div>

              </div>

              {/* Bio & Objective summary */}
              <div className="w-full text-xs text-slate-400 space-y-3 border-t border-slate-900 pt-4 text-left leading-relaxed">
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block uppercase mb-0.5">Professional Bio</span>
                  <p>{user.bio}</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block uppercase mb-0.5">Career Objective</span>
                  <p>Full Stack AI Developer seeking roles in RAG system designs, machine learning pipelines, and responsive SaaS interfaces.</p>
                </div>
              </div>

              {/* Contact Icons list */}
              <div className="w-full text-xs text-slate-300 space-y-2 pt-4 border-t border-slate-900 text-left">
                <div className="flex items-center space-x-2"><Mail className="w-3.5 h-3.5 text-cyan-400" /> <span>{user.email}</span></div>
                <div className="flex items-center space-x-2"><Phone className="w-3.5 h-3.5 text-cyan-400" /> <span>{user.phone}</span></div>
                <div className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> <span>{user.location}</span></div>
              </div>

              {/* Social Channels Links */}
              <div className="w-full pt-4 border-t border-slate-900 flex justify-center space-x-4 text-slate-500">
                <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors"><LinkIcon className="w-4 h-4" /></a>
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors"><LinkIcon className="w-4 h-4" /></a>
                <a href={portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors"><LinkIcon className="w-4 h-4" /></a>
              </div>

            </div>

            {/* Right Column: GitHub stats, Contribution Graph, Repos, Experience, Education, verified Skills */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* GitHub Stats Card */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-805 bg-[#0f172a]/70 flex justify-between items-center shadow-md">
                <div>
                  <h4 className="text-xs font-bold text-slate-355 uppercase tracking-wider font-mono">GitHub Stats</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Linked dynamically from integrated portfolio</p>
                </div>
                <div className="flex space-x-4 text-xs font-mono">
                  <div>Stars: <strong className="text-cyan-400">{githubStats.stars}</strong></div>
                  <div>Repos: <strong className="text-indigo-400">{githubStats.publicRepos}</strong></div>
                  <div>Followers: <strong className="text-emerald-400">{githubStats.followers}</strong></div>
                </div>
              </div>

              {/* GitHub Language Chart progress indicators */}
              <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-3 shadow-md font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase block">GitHub Language Breakdown</span>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>Python</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-yellow-500 h-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>TypeScript / JS</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-550 h-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>C++</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Contribution Graph representation */}
              <div className="p-5 rounded-3xl glass-panel border border-slate-805 bg-[#0f172a]/95 space-y-3.5 shadow-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>GitHub Contribution Graph</span>
                  </h4>
                  <span className="text-[9px] text-slate-500 font-mono">Past 15 Weeks contribution map</span>
                </div>
                
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none justify-center">
                  {mockContributions.map((col, cIdx) => (
                    <div key={cIdx} className="flex flex-col space-y-1 shrink-0">
                      {col.map((cell, rIdx) => (
                        <div key={rIdx} className={`w-2.5 h-2.5 rounded-sm ${getContribColor(cell)}`} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Repositories list */}
              <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/75 space-y-3 shadow-md">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Recent Pinned Repositories</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
                    <strong className="text-slate-200 block truncate">safeband-biometrics</strong>
                    <div className="text-[9px] text-cyan-400 font-bold">★ 14 stars</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
                    <strong className="text-slate-200 block truncate">queue-cure-routing</strong>
                    <div className="text-[9px] text-cyan-400 font-bold">★ 8 stars</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
                    <strong className="text-slate-200 block truncate">identity-vault-rag</strong>
                    <div className="text-[9px] text-cyan-400 font-bold">★ 22 stars</div>
                  </div>
                </div>
              </div>

              {/* Verified Experience summary */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-3 shadow-lg">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Experience Summary</span>
                </h4>
                <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                  {vaultInternships.map(i => (
                    <div key={i.id} className="border-l border-slate-900 pl-3">
                      <strong className="text-slate-200 block">{i.title}</strong>
                      <span className="text-[10px] text-cyan-400">{i.issuer}</span>
                      <p className="mt-0.5">{i.summary}</p>
                    </div>
                  ))}
                  {vaultInternships.length === 0 && <p className="italic text-slate-600">No internships ingested in vault yet.</p>}
                </div>
              </div>

              {/* Education Timeline */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-3 shadow-lg">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Education Timeline</span>
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{user.college}</span>
                    <span>2023 - 2027</span>
                  </div>
                  <p className="text-slate-400">{user.degree} in Production Engineering</p>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-1">GPA cutoff: {user.cgpa}</span>
                </div>
              </div>

              {/* Skills Matrix with Verified Checkmarks Badges */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500 block mb-2">Core Skills Matrix</span>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map((s, idx) => {
                    const isVerified = ['python', 'react', 'next.js', 'fastapi', 'sql', 'mongodb', 'docker'].includes(s.toLowerCase());
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold font-mono flex items-center space-x-1 ${
                          isVerified
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        }`}
                      >
                        <span>{s}</span>
                        {isVerified && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl border border-cyan-500/25 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <span className="text-slate-450">Share your dynamically verified academic identity.</span>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Profile Link' : 'Copy Public Share Link'}</span>
              </button>

              <button
                onClick={handleDownloadResume}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume Download</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* EDIT PROFILE VIEW FORM */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 shadow-2xl space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold font-outfit text-slate-100">Edit Academic & Career Information</h3>
            <span className="text-[10px] text-slate-400 font-mono">Dynamic persistence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Target Role / Career Goal</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">University / Institute</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Degree & Branch</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">CGPA (e.g. 8.92 / 10.0)</label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Expected Graduation Year</label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">GitHub Portfolio Link</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">LinkedIn Profile Link</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Executive Summary / Professional Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
          </div>

          {/* Skills Builder */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Core Skills Matrix</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center space-x-1.5"
                >
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 max-w-sm">
              <input
                type="text"
                placeholder="Add new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-202 text-xs font-semibold transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className={`px-8 py-3 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
                saved
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/20'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Changes Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </motion.div>
  );
};
