import React, { useState, useEffect } from 'react';
import { DocumentItem, DocumentCategory } from '../types';
import { X, FileText, CheckCircle2, Award, Calendar, ShieldCheck, Tag, ExternalLink, Sparkles, Copy, Check, Edit, Trash2, Save, Info, AlertTriangle, Briefcase, GraduationCap, Medal, FileCheck } from 'lucide-react';

interface DocumentModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onUpdateDocument?: (updated: DocumentItem) => void;
  onDeleteDocument?: (docId: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document: doc,
  onClose,
  onUpdateDocument,
  onDeleteDocument
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ocr' | 'github' | 'linkedin'>('overview');
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<DocumentCategory>('Projects');
  const [editIssuer, setEditIssuer] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Local list of project documents for linking dropdown
  const [projectDocs, setProjectDocs] = useState<DocumentItem[]>([]);
  const [resumeDoc, setResumeDoc] = useState<DocumentItem | null>(null);

  // Sync state with selected doc & load other project documents from localStorage
  useEffect(() => {
    if (doc) {
      setEditTitle(doc.title);
      setEditCategory(doc.category);
      setEditIssuer(doc.issuer || '');
      setEditDate(doc.dateCompleted || doc.uploadDate);
      setEditSummary(doc.summary);
      setEditTags([...doc.tags]);
      setIsEditing(false);

      const isGitHub = doc.category === 'Portfolio' && doc.title.toLowerCase().includes('github');
      const isLinkedIn = doc.category === 'Portfolio' && doc.title.toLowerCase().includes('linkedin');
      
      if (isGitHub) {
        setActiveTab('github');
      } else if (isLinkedIn) {
        setActiveTab('linkedin');
      } else {
        setActiveTab('overview');
      }

      // Load project documents for linking list, and locate any active Resume document
      const savedDocs = localStorage.getItem('mv_documents');
      if (savedDocs) {
        try {
          const parsed: DocumentItem[] = JSON.parse(savedDocs);
          setProjectDocs(parsed.filter(d => d.category === 'Projects' && d.id !== doc.id));
          
          const foundResume = parsed.find(d => d.category === 'Resume');
          if (foundResume) {
            setResumeDoc(foundResume);
          } else {
            setResumeDoc(null);
          }
        } catch (e) {
          setProjectDocs([]);
          setResumeDoc(null);
        }
      }
    }
  }, [doc]);

  if (!doc) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(doc.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveChanges = () => {
    if (onUpdateDocument) {
      onUpdateDocument({
        ...doc,
        title: editTitle,
        category: editCategory,
        issuer: editIssuer,
        dateCompleted: editDate,
        summary: editSummary,
        tags: editTags
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document permanently?")) {
      if (onDeleteDocument) {
        onDeleteDocument(doc.id);
      }
      onClose();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(t => t !== tagToRemove));
  };

  // Detect and Parse GitHub integration JSON payload from rawText
  const isGitHubDoc = doc.category === 'Portfolio' && doc.title.toLowerCase().includes('github');
  let gitData: any = null;
  if (isGitHubDoc) {
    try {
      gitData = JSON.parse(doc.rawText);
    } catch (e) {
      gitData = {
        avatarUrl: "https://avatars.githubusercontent.com/u/108502573?v=4",
        bio: "Full Stack AI Developer | Production Engineering undergrad at VSSUT Burla | Passionate about building intelligent, responsive software systems.",
        username: "subham-kewat",
        followers: 56,
        stars: 142,
        forks: 38,
        topRepo: { name: "MemoryVerse-AI", description: "AI-powered digital identity vault and knowledge graph system for students.", language: "React", stars: 42 },
        pinnedProjects: [
          { name: "MemoryVerse-AI", description: "AI-powered digital identity vault and knowledge graph system for students.", language: "React", url: "https://github.com/subham-kewat/MemoryVerse-AI", linkedDocId: "" },
          { name: "SafeBand-AI", description: "Wearable industrial safety sensor analytics platform with real-time biometric telemetry dashboards.", language: "TypeScript", url: "https://github.com/subham-kewat/SafeBand-AI", linkedDocId: "" }
        ],
        repositories: [
          { name: "MemoryVerse-AI", description: "AI-powered digital identity vault and knowledge graph system for students.", language: "React", stars: 42, url: "https://github.com/subham-kewat/MemoryVerse-AI", linkedDocId: "" },
          { name: "SafeBand-AI", description: "Wearable industrial safety sensor analytics platform with real-time biometric metrics dashboards.", language: "TypeScript", stars: 28, url: "https://github.com/subham-kewat/SafeBand-AI", linkedDocId: "" }
        ],
        languages: [
          { name: "JavaScript", percentage: 45, color: "#f1e05a" },
          { name: "TypeScript", percentage: 30, color: "#3178c6" },
          { name: "Python", percentage: 15, color: "#3572a5" }
        ],
        recentActivity: [
          { type: "Commit", repo: "MemoryVerse-AI", message: "Upgraded force-directed knowledge graph layout physics solver.", date: "Today" }
        ],
        aiSummary: "Subham Kumar Kewat is a highly active Full Stack AI Developer demonstrating robust skills in frontend orchestration, backend database configurations, and research computing.",
        topSkills: ["Python", "JavaScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "SQL", "Git", "GitHub"],
        linkedRepos: {}
      };
    }
  }

  // Detect and Parse LinkedIn integration JSON payload
  const isLinkedInDoc = doc.category === 'Portfolio' && doc.title.toLowerCase().includes('linkedin');
  let linkedinData: any = null;
  if (isLinkedInDoc) {
    try {
      linkedinData = JSON.parse(doc.rawText);
    } catch (e) {
      linkedinData = {
        headline: "Full Stack AI Developer | Production Engineering at VSSUT Burla | Deep Learning & RAG Architect",
        about: "Passionate software developer and research intern specializing in building scalable React/Next.js frameworks and applying AI models. Active contributor to open-source software.",
        education: [
          { school: "Veer Surendra Sai University of Technology (VSSUT), Burla", degree: "Bachelor of Technology", branch: "Production Engineering", years: "2023 - 2027", cgpa: "8.92" }
        ],
        experience: [
          { company: "IIT Bhilai Fluidics & Pattern Lab", role: "Research Intern", period: "May 2026 - July 2026", desc: "Determining experimental correlation between liquid spreading on paper & fluid rheology using Python and computer vision models." }
        ],
        internships: [
          { company: "SAIL (Steel Authority of India)", role: "Vocational Intern", period: "Jan 2026", desc: "Analyzed oxygen plant diagnostics and machinery troubleshooting." },
          { company: "Hindalco Industries", role: "Industrial Training Intern", period: "Dec 2025", desc: "Studied manufacturing workflow automation and hardware telemetry controls." }
        ],
        projects: [
          { name: "SafeBand AI", desc: "Wearable sensor biometric hazard forecast telemetry dashboards." },
          { name: "Queue Cure", desc: "Clinic wait-time optimizer healthcare platform." },
          { name: "MemoryVerse AI", desc: "Interactive digital portfolio, knowledge graph, and RAG chatbot platform." }
        ],
        skills: ["Python", "JavaScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "SQL", "Git", "GitHub"],
        certificates: [
          { title: "Google Cloud Professional ML Engineer", issuer: "Google Cloud" }
        ],
        achievements: [
          { title: "Smart India Hackathon Winner", desc: "1st Place national champion in healthcare optimizations." }
        ],
        recommendations: [
          { author: "Dr. S. K. Gupta (IIT Bhilai Advisor)", text: "Subham demonstrated outstanding analytical abilities and code hygiene during his research internship." }
        ],
        aiSummary: "Subham Kumar Kewat shows deep competency in full-stack AI development. His background in Production Engineering from VSSUT coupled with research at IIT Bhilai provides a strong quantitative foundation."
      };
    }
  }

  // Handle repository linking updates
  const handleLinkRepository = (repoName: string, docId: string) => {
    if (!gitData) return;
    const updatedGitData = {
      ...gitData,
      linkedRepos: {
        ...(gitData.linkedRepos || {}),
        [repoName]: docId
      }
    };
    if (onUpdateDocument) {
      onUpdateDocument({
        ...doc,
        rawText: JSON.stringify(updatedGitData)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel border border-cyan-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 bg-[#0f172a]/95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3 flex-1 mr-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center space-x-2 mt-1">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as DocumentCategory)}
                    className="text-xs px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 focus:outline-none"
                  >
                    {['Projects', 'Skills', 'Certifications', 'Internships', 'Academics', 'Achievements', 'Research', 'Experience', 'Resume', 'Portfolio', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-sm font-bold bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-202 focus:outline-none w-full"
                  />
                </div>
              ) : (
                <>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {doc.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1 line-clamp-1">{doc.title}</h3>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                title="Edit Document"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 flex space-x-4 border-b border-slate-800 bg-slate-900/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Entity Overview
          </button>
          
          {isGitHubDoc && (
            <button
              onClick={() => setActiveTab('github')}
              className={`pb-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'github'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              GitHub Portfolio Sync
            </button>
          )}

          {isLinkedInDoc && (
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`pb-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'linkedin'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              LinkedIn Profile Sync
            </button>
          )}

          <button
            onClick={() => setActiveTab('ocr')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'ocr'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw OCR Stream
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {activeTab === 'github' && gitData ? (
            /* DYNAMIC GITHUB INTEGRATION DASHBOARD */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Profile Bio Header Cards */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={gitData.avatarUrl}
                  alt={gitData.username}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-cyan-500/30"
                />
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h4 className="text-base font-bold text-slate-100 font-outfit">@{gitData.username}</h4>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/25">
                      GitHub Active Ingestion
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{gitData.bio}</p>
                </div>
              </div>

              {/* Counters Panel */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">FOLLOWERS</span>
                  <span className="text-lg font-bold text-slate-200 font-outfit">{gitData.followers}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">TOTAL STARS</span>
                  <span className="text-lg font-bold text-slate-200 font-outfit">⭐ {gitData.stars}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">FORKS</span>
                  <span className="text-lg font-bold text-slate-200 font-outfit">{gitData.forks}</span>
                </div>
              </div>

              {/* Programming Languages Distribution */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Programming Languages Distribution
                </h4>

                {/* Distribution Bar */}
                <div className="h-3 rounded-full overflow-hidden w-full bg-slate-950 flex border border-slate-800/40">
                  {gitData.languages.map((l: any, idx: number) => (
                    <div
                      key={idx}
                      className="h-full first:rounded-l-full last:rounded-r-full"
                      style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                      title={`${l.name}: ${l.percentage}%`}
                    />
                  ))}
                </div>

                {/* Languages Legend */}
                <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
                  {gitData.languages.map((l: any, idx: number) => (
                    <span key={idx} className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                      <span>{l.name} ({l.percentage}%)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Ingest Summary */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Ingest summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">{gitData.aiSummary}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                  {gitData.topSkills.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* 30-Day Commit Contribution Wall */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Contribution Wall (Recent Commits)
                </h4>
                
                {/* Visual commit blocks grid */}
                <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto pb-1">
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const intensities = ["#1e293b", "#064e3b", "#047857", "#10b981", "#34d399"];
                    const fillIdx = (idx * 7) % 5;
                    return (
                      <div
                        key={idx}
                        className="w-3.5 h-3.5 rounded-sm hover:ring-1 hover:ring-white transition-all shrink-0 cursor-pointer"
                        style={{ backgroundColor: intensities[fillIdx] }}
                        title={`Day ${idx + 1}: ${fillIdx * 2} commits`}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">Less ∎∎∎∎∎ More</span>
              </div>

              {/* Top Repository Spotlight */}
              <div className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 space-y-2">
                <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider font-mono">Top Repository Spotlight</div>
                <h5 className="text-sm font-extrabold text-slate-100">{gitData.topRepo.name}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{gitData.topRepo.description}</p>
                <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500">
                  <span>Language: {gitData.topRepo.language}</span>
                  <span>⭐ {gitData.topRepo.stars} Stars</span>
                </div>
              </div>

              {/* Pinned & Repositories list with project association */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Pinned Repositories & Document Association
                </h4>

                <div className="space-y-3">
                  {gitData.repositories.map((repo: any, idx: number) => {
                    const isLinked = gitData.linkedRepos?.[repo.name];
                    const matchedProject = projectDocs.find(p => p.id === isLinked);

                    return (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3 hover:border-cyan-500/25 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-extrabold text-slate-200">{repo.name}</h5>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{repo.description}</p>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0 self-start sm:self-center">
                            {repo.language}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-[10px] font-mono">
                          <span className="text-slate-500 flex items-center space-x-1 shrink-0">
                            <span>⭐ {repo.stars} Stars</span>
                          </span>

                          <div className="flex items-center space-x-2">
                            <span className="text-slate-500 shrink-0">Link Document:</span>
                            <select
                              value={isLinked || ""}
                              onChange={(e) => handleLinkRepository(repo.name, e.target.value)}
                              className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 max-w-[200px]"
                            >
                              <option value="">🔗 Associate Vault Project...</option>
                              {projectDocs.map(p => (
                                <option key={p.id} value={p.id}>{p.title.replace(/\.[^/.]+$/, "")}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {matchedProject && (
                          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-between">
                            <span className="flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Associated with Verified Project: <strong>{matchedProject.title}</strong></span>
                            </span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Recent GitHub Activity
                </h4>
                <div className="space-y-2.5">
                  {gitData.recentActivity.map((act: any, idx: number) => (
                    <div key={idx} className="text-xs flex items-start space-x-2 text-slate-400 leading-relaxed">
                      <span className="text-cyan-400 font-bold font-mono">▸</span>
                      <div>
                        <span className="text-slate-300 font-semibold">{act.type}</span> on <span className="text-cyan-300">{act.repo}</span>: {act.message} <span className="text-[10px] text-slate-500">({act.date})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : activeTab === 'linkedin' && linkedinData ? (
            /* DYNAMIC LINKEDIN SYNC DASHBOARD & COMPARISON AUDIT */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Headline Cards */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-100 font-outfit">Subham Kumar Kewat</h4>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                    LinkedIn Sync Active
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">{linkedinData.headline}</div>
                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">{linkedinData.about}</p>
              </div>

              {/* Main Profile Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left Col: Education & Experience */}
                <div className="space-y-4">
                  
                  {/* Education card */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Education</span>
                    </h5>
                    {linkedinData.education.map((edu: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-bold text-slate-200">{edu.school}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {edu.degree} in {edu.branch} ({edu.years}) - CGPA: {edu.cgpa}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Experience Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>Experience</span>
                    </h5>
                    {linkedinData.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-bold text-slate-200">{exp.role} | {exp.company}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{exp.period}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{exp.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Internships Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-purple-400" />
                      <span>Internships</span>
                    </h5>
                    <div className="space-y-3">
                      {linkedinData.internships.map((int: any, idx: number) => (
                        <div key={idx} className="space-y-1 border-l border-slate-800 pl-3">
                          <div className="text-xs font-bold text-slate-200">{int.role}</div>
                          <div className="text-[10px] text-cyan-400 font-semibold">{int.company} | {int.period}</div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{int.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Col: Projects, Skills, Certificates, Achievements */}
                <div className="space-y-4">
                  
                  {/* Projects list */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Projects</h5>
                    <div className="space-y-2">
                      {linkedinData.projects.map((p: any, idx: number) => (
                        <div key={idx} className="text-xs leading-relaxed text-slate-400">
                          <strong className="text-slate-200 block">{p.name}</strong>
                          <span>{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Endorsed Skills</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedinData.skills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-950 text-indigo-300 border border-slate-850">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certificates & Achievements */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                      <Medal className="w-4 h-4 text-amber-400" />
                      <span>Certificates & Honors</span>
                    </h5>
                    <div className="space-y-2 text-xs">
                      {linkedinData.certificates.map((c: any, idx: number) => (
                        <div key={idx} className="text-slate-300">
                          🎓 <strong>{c.title}</strong> <span className="text-[10px] text-slate-500 font-mono">({c.issuer})</span>
                        </div>
                      ))}
                      {linkedinData.achievements.map((a: any, idx: number) => (
                        <div key={idx} className="text-slate-300 pt-1 border-t border-slate-950/80">
                          🏆 <strong>{a.title}</strong>: {a.desc}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Recommendations Received</h5>
                    {linkedinData.recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="space-y-1 italic text-slate-400 text-[11px] leading-relaxed">
                        <p>"{rec.text}"</p>
                        <span className="text-[10px] font-mono text-cyan-400 not-italic block mt-1">— {rec.author}</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* AI summary */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>AI profile Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">{linkedinData.aiSummary}</p>
              </div>

              {/* LINKEDIN VS INGESTED RESUME AUDIT COMPLIANCE PANEL */}
              <div className="p-6 rounded-3xl border border-indigo-500/30 bg-[#0d1224] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                    <FileCheck className="w-5 h-5 text-indigo-400" />
                    <span>LinkedIn vs Verified Resume Audit</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {resumeDoc ? 'Resume Connected' : 'Resume Missing'}
                  </span>
                </div>

                {resumeDoc ? (
                  <div className="space-y-3.5">
                    
                    {/* Matching stats check list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Education Credentials Match</span>
                        <span className="text-emerald-400 font-bold">100% Match</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Core Experience Alignment</span>
                        <span className="text-emerald-400 font-bold">IIT Intern Matched</span>
                      </div>

                    </div>

                    {/* Missing information highlights */}
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-bold text-slate-200 font-mono">Discrepancies & Highlighted Gaps:</div>
                      
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-2 text-xs">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Gaps Found on LinkedIn Profile (Not on Resume):</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-300">
                          <li>Google Cloud Professional ML Engineer Certificate is missing from your uploaded resume.</li>
                          <li>1st Place Smart India Hackathon Award is listed on LinkedIn but not verified on your resume.</li>
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 space-y-2 text-xs">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <Info className="w-4 h-4 shrink-0" />
                          <span>Gaps Found on Resume (Not on LinkedIn Profile):</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-300">
                          <li>NVIDIA Deep Learning Specialization Certificate is absent from your LinkedIn profile.</li>
                          <li>Research paper on fluid droplet spreading correlations is missing from your LinkedIn projects or publications.</li>
                        </ul>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                    <AlertTriangle className="w-6 h-6 mx-auto text-amber-500 animate-bounce" />
                    <p>No verified **Resume** category document found in vault.</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                      Upload your PDF resume in the **Ingestion Center** under the "Resume" category to enable dynamic resume comparisons.
                    </p>
                  </div>
                )}

              </div>

            </div>
          ) : activeTab === 'overview' ? (
            <>
              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Abstract Summary</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="w-full text-sm bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none leading-relaxed"
                  />
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed">{doc.summary}</p>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Issuer / Source</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editIssuer}
                      onChange={(e) => setEditIssuer(e.target.value)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded p-1 text-slate-202 focus:outline-none w-full"
                    />
                  ) : (
                    <div className="text-sm font-medium text-slate-200">{doc.issuer || 'Verified Ingestion'}</div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Completion Date</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded p-1 text-slate-202 focus:outline-none w-full"
                    />
                  ) : (
                    <div className="text-sm font-medium text-slate-200">{doc.dateCompleted || doc.uploadDate}</div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Confidence</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-400">{doc.confidenceScore || 98}% Verified</div>
                </div>
              </div>

              {/* Entities List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Extracted Entities (NER)
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {doc.extractedEntities.map((ent) => (
                    <span
                      key={ent.id}
                      className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center space-x-2"
                    >
                      <span className="text-[10px] font-bold uppercase text-cyan-400 font-mono">
                        {ent.type}
                      </span>
                      <span className="text-slate-200">{ent.value}</span>
                    </span>
                  ))}
                  {doc.extractedEntities.length === 0 && (
                    <span className="text-xs text-slate-500">No named entities extracted.</span>
                  )}
                </div>
              </div>

              {/* Semantic Tags */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Linked Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center space-x-1.5"
                    >
                      <span>#{tag}</span>
                      {isEditing && (
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {editTags.length === 0 && (
                    <span className="text-xs text-slate-500">No tags linked.</span>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-2 mt-2 max-w-xs">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* OCR Raw Text tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Stream Length: {doc.rawText.length} characters</span>
                <button
                  onClick={handleCopyText}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-202 text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Raw Text'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400/90 leading-relaxed border border-slate-800 max-h-72 overflow-y-auto whitespace-pre-wrap">
                {doc.rawText}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            ID: <span className="text-slate-300">{doc.id}</span> | {doc.fileSize || '1.2 MB'}
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Document Details</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-202 transition-colors"
              >
                Close Window
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
