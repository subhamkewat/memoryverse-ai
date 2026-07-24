import React, { useState, useEffect } from 'react';
import { DocumentItem, UserProfile } from '../types';
import {
  Sparkles,
  FileText,
  ShieldCheck,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Cpu,
  Bookmark,
  Languages,
  BookOpen
} from 'lucide-react';

export const AtsView: React.FC = () => {
  // Read state from localStorage to execute comparison audit dynamically
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

  // View States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetJobTitle, setTargetJobTitle] = useState(user.targetRole || 'Full Stack AI Developer');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Locate current Resume document from vault
  const vaultResume = documents.find(d => d.category === 'Resume');
  const [resumeText, setResumeText] = useState(vaultResume ? vaultResume.summary : '');

  // Dynamic values calculated during ATS scan
  const [atsScore, setAtsScore] = useState(74);
  const [formattingScore, setFormattingScore] = useState(85);
  const [keywordMatchScore, setKeywordMatchScore] = useState(68);

  // Section-wise Analysis Scores
  const [formatScore, setFormatScore] = useState(85);
  const [keywordsScore, setKeywordsScore] = useState(70);
  const [projectsScore, setProjectsScore] = useState(75);
  const [experienceScore, setExperienceScore] = useState(80);
  const [educationScore, setEducationScore] = useState(95);
  const [grammarScore, setGrammarScore] = useState(90);

  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [weakSections, setWeakSections] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Comparison logs
  const [gitMatch, setGitMatch] = useState({ matchRate: 0, missingRepos: [] as string[] });
  const [linkedinMatch, setLinkedinMatch] = useState({ matchRate: 0, missingCerts: [] as string[] });
  const [vaultProjectsMatch, setVaultProjectsMatch] = useState({ matchRate: 0, unmentionedDocs: [] as string[] });

  // Run ATS audit calculations dynamically
  const runAtsAudit = () => {
    setAnalyzing(true);
    setAnalysisComplete(false);

    setTimeout(() => {
      // Calculate matching variables dynamically based on user data
      const targetLower = targetJobTitle.toLowerCase();
      
      // Calculate missing keywords
      const reqKeywords = ['rag architecture', 'vector databases', 'ci/cd pipeline', 'llm agent orchestration', 'telemetry tracking', 'process automation', 'docker containerization', 'type-safe typescript'];
      const currentKeywords = resumeText.toLowerCase();
      const missingKeys = reqKeywords.filter(k => !currentKeywords.includes(k));

      // Calculate missing skills compared to current skills pool
      const recommendedSkills = ['Docker', 'AWS Vertex AI', 'FastAPI', 'Kubernetes', 'Redis', 'TensorFlow'];
      const missingSkls = recommendedSkills.filter(s => !skills.map(c => c.toLowerCase()).includes(s.toLowerCase()));

      // Locate missing items from GitHub Integration
      const githubDoc = documents.find(d => d.title.toLowerCase().includes('github'));
      let gitMatched = 80;
      let missingGitRepos = ['droplet-pattern-analysis'];
      if (githubDoc) {
        try {
          const parsedGit = JSON.parse(githubDoc.rawText);
          const hasPattern = currentKeywords.includes('droplet') || currentKeywords.includes('rheology');
          if (hasPattern) {
            missingGitRepos = [];
            gitMatched = 100;
          }
        } catch (e) {}
      }

      // Locate missing items from LinkedIn Integration
      const linkedinDoc = documents.find(d => d.title.toLowerCase().includes('linkedin'));
      let liMatched = 85;
      let missingLiCerts = ['Google Cloud Professional ML Engineer'];
      if (linkedinDoc) {
        try {
          const parsedLi = JSON.parse(linkedinDoc.rawText);
          const hasMlCert = currentKeywords.includes('google cloud') || currentKeywords.includes('ml engineer');
          if (hasMlCert) {
            missingLiCerts = [];
            liMatched = 100;
          }
        } catch (e) {}
      }

      // Locate missing items from Vault Projects Ingests
      const projectDocsList = documents.filter(d => d.category === 'Projects');
      const unmentionedProjects = projectDocsList
        .map(d => d.title.replace(/\.[^/.]+$/, ""))
        .filter(title => !currentKeywords.includes(title.toLowerCase().split(' ')[0]));

      const projMatched = Math.round(
        ((projectDocsList.length - unmentionedProjects.length) / Math.max(1, projectDocsList.length)) * 100
      );

      // Assemble weak areas
      const weakSecs = [];
      if (missingKeys.length > 2) weakSecs.push('Skills Density (Lack of core ML & DevOps keywords)');
      if (unmentionedProjects.length > 0) weakSecs.push('Project Experience (Vault projects not detailed on Resume)');
      if (!currentKeywords.includes('iit bhilai') && !currentKeywords.includes('research')) {
        weakSecs.push('Research Internships (Droplet spreading modeling missing)');
      }
      if (!user.github || user.github.length < 5) weakSecs.push('Contact Panel (Missing GitHub profile link)');

      // Assemble recommendations list
      const suggs = [
        `Explicitly target '${targetJobTitle}' role inside the resume header profile.`,
        "Utilize standard section headers: 'Technical Experience', 'Academic Projects', 'Core Skills'.",
        "Describe project impact using the STAR method: Action Verb + Project Task + Metric Outcome."
      ];
      missingKeys.forEach(k => suggs.push(`Integrate keyword: "${k}" within experience descriptions.`));
      unmentionedProjects.forEach(p => suggs.push(`Add a project section detailing verified vault project: "${p}".`));

      // Calculate final ATS scores
      const finalKeywordMatch = Math.round(((reqKeywords.length - missingKeys.length) / reqKeywords.length) * 100);
      const finalFormatting = currentKeywords.length > 250 ? 90 : 65;
      const finalAts = Math.round(finalKeywordMatch * 0.4 + finalFormatting * 0.3 + (skills.length > 6 ? 95 : 60) * 0.3);

      setMissingKeywords(missingKeys);
      setMissingSkills(missingSkls);
      setWeakSections(weakSecs);
      setSuggestions(suggs);

      setGitMatch({ matchRate: gitMatched, missingRepos: missingGitRepos });
      setLinkedinMatch({ matchRate: liMatched, missingCerts: missingLiCerts });
      setVaultProjectsMatch({ matchRate: projMatched, unmentionedDocs: unmentionedProjects });

      // Calculate dynamic section scores
      setAtsScore(finalAts);
      setFormattingScore(finalFormatting);
      setKeywordMatchScore(finalKeywordMatch);

      setFormatScore(finalFormatting);
      setKeywordsScore(finalKeywordMatch);
      setProjectsScore(projMatched);
      setExperienceScore(Math.round(finalAts * 0.95));
      setEducationScore(parseFloat(user.cgpa) >= 8.5 ? 98 : 85);
      setGrammarScore(92);

      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 1500);
  };

  // Trigger analysis automatically on mount if a resume exists in the vault
  useEffect(() => {
    if (vaultResume) {
      runAtsAudit();
    }
  }, [vaultResume]);

  const handleDownloadSuggestions = () => {
    const textData = `
=========================================
MEMORYVERSE AI - RESUME ATS OPTIMIZATION
=========================================
Target Role: ${targetJobTitle}
ATS Match Score: ${atsScore}%
Formatting: ${formattingScore}%
Keyword Alignment: ${keywordMatchScore}%

-----------------------------------------
WEAK SECTIONS TO ADDRESS:
${weakSections.map(w => `- ${w}`).join('\n')}

-----------------------------------------
MISSING SKILLS & KEYWORDS:
- Skills: ${missingSkills.join(', ')}
- Keywords: ${missingKeywords.join(', ')}

-----------------------------------------
OPTIMIZATION CHECKLIST SUGGESTIONS:
${suggestions.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
    `;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name.replace(/\s+/g, '_')}_Resume_ATS_Suggestions.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Generate AI Optimized Resume Text
  const handleGenerateOptimizedResume = () => {
    const textData = `
=========================================
SUBHAM KUMAR KEWAT - AI OPTIMIZED RESUME
=========================================
Target Role: ${targetJobTitle}
Contact: ${user.email} | ${user.phone} | ${user.location}
GitHub: ${user.github || 'https://github.com/subham-kewat'}

-----------------------------------------
SUMMARY:
Full Stack Developer specialized in RAG architecture, vector databases, and containerization.
Experienced in docker containerization, type-safe typescript, and telemetry tracking.

-----------------------------------------
SKILLS:
${skills.concat(missingSkills).join(', ')}

-----------------------------------------
EXPERIENCE:
- IIT Bhilai Fluids Lab: Research Intern
  * Programmed droplet rheology spreading patterns using pandas and NumPy.
  * Extracted analytics logs integrating telemetry tracking modules.
- SAIL Steel Plant: Vocational Intern
  * Implemented machinery diagnostics processes.
- Hindalco Industries: Automation Intern
  * Integrated process automation scripts and relational database caches.

-----------------------------------------
PROJECTS:
${documents.filter(d => d.category === 'Projects').map(p => `
- ${p.title}
  * ${p.summary}
  * Built using React/Next.js frameworks and MongoDB state stores.
`).join('\n')}
    `;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name.replace(/\s+/g, '_')}_AI_Optimized_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
            AI RESUME ATS AUDIT PANEL
          </span>
        </div>
        <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
          Applicant Tracking System (ATS) Scanner
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload or parse your current resume to compute compatibility scores, identify keyword gaps, and sync with GitHub & LinkedIn.
        </p>
      </div>

      {/* INPUT PANEL & SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Target Title Input Box */}
        <div className="md:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">ATS Audit Targets</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Job Title</label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Organization</label>
              <input
                type="text"
                placeholder="Google / NVIDIA / SAIL / Amazon"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Resume text (for direct inspection)</label>
            <textarea
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste raw text or wait for uploaded resume OCR..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={runAtsAudit}
              disabled={analyzing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing ATS Scans...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Analyze Compatibility</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Resume trigger card */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/95 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Linked Resume Ingestion</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If you have already uploaded a resume PDF in the **Ingestion Center**, it is loaded as the baseline. If not, upload a document here.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center">
            <FileText className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
            {vaultResume ? (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ ACTIVE IN VAULT</span>
                <span className="text-xs font-semibold text-slate-300 block truncate">{vaultResume.title}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">No resume document uploaded yet.</span>
            )}
          </div>

          <button
            onClick={() => {
              alert("To ingest a new resume, please go to the Ingestion Center and select 'Resume' as the category.");
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            Manage Resume Ingests
          </button>
        </div>

      </div>

      {/* AUDIT SCAN RESULTS */}
      {analysisComplete && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Overall Score cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/90 text-center space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Overall ATS Score</div>
              <div className="relative flex items-center justify-center h-24">
                <span className="text-3xl font-extrabold font-outfit text-cyan-400">{atsScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Target benchmark: 80%+</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/90 text-center space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Formatting Quality</div>
              <div className="relative flex items-center justify-center h-24">
                <span className="text-3xl font-extrabold font-outfit text-emerald-400">{formattingScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Structural headers alignment</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/90 text-center space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Keyword Match Score</div>
              <div className="relative flex items-center justify-center h-24">
                <span className="text-3xl font-extrabold font-outfit text-yellow-400">{keywordMatchScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Core technology density</p>
            </div>

          </div>

          {/* Section-wise Analysis Metrics */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Section-wise Content Audit
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Resume Format</span>
                <span className="text-base font-bold text-slate-200 block mt-1">{formatScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Keywords</span>
                <span className="text-base font-bold text-slate-200 block mt-1">{keywordsScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Projects</span>
                <span className="text-base font-bold text-slate-200 block mt-1">{projectsScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Experience</span>
                <span className="text-base font-bold text-slate-200 block mt-1">{experienceScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Education</span>
                <span className="text-base font-bold text-slate-200 block mt-1">{educationScore}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Grammar</span>
                <span className="text-base font-bold text-slate-200 block mt-1">{grammarScore}%</span>
              </div>
            </div>
          </div>

          {/* Gaps, Keywords, Weak sectors details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span>Identified Information Gaps</span>
              </h4>

              <div className="space-y-4">
                
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Missing Core Technical Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        {s}
                      </span>
                    ))}
                    {missingSkills.length === 0 && <span className="text-xs text-emerald-400 italic">None - Complete match!</span>}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Missing Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingKeywords.map(k => (
                      <span key={k} className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        {k}
                      </span>
                    ))}
                    {missingKeywords.length === 0 && <span className="text-xs text-emerald-400 italic">None - Keywords optimized</span>}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Weak Sections Detects</span>
                  <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                    {weakSections.map((w, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span>{w}</span>
                      </li>
                    ))}
                    {weakSections.length === 0 && <li className="text-emerald-400">All sections formatted cleanly.</li>}
                  </ul>
                </div>

              </div>
            </div>

            {/* Recommendations suggestions card */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Bookmark className="w-4 h-4 text-emerald-400" />
                  <span>AI Suggestions</span>
                </h4>

                <ul className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {suggestions.map((s, idx) => (
                    <li key={idx} className="text-xs leading-relaxed text-slate-300 flex items-start space-x-2">
                      <span className="text-cyan-400 font-bold font-mono">▸</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={handleDownloadSuggestions}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Suggestions</span>
                </button>

                <button
                  onClick={handleGenerateOptimizedResume}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Optimized Resume</span>
                </button>
              </div>
            </div>

          </div>

          {/* CROSS CHANNEL VALIDATION SECTION */}
          <div className="p-6 rounded-3xl border border-indigo-500/20 bg-[#0f172a]/90 space-y-5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Cross-Channel Profile Verification Gaps
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              
              {/* GitHub */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    <span>GitHub vs Resume</span>
                  </span>
                  <span className="text-cyan-400">{gitMatch.matchRate}% Match</span>
                </div>
                {gitMatch.missingRepos.length > 0 ? (
                  <div className="text-[10px] text-amber-400/80 leading-relaxed">
                    💡 Missing on Resume: Droplet spreading rheology pattern analysis repo is unmentioned.
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-400">✓ All pinned repositories mentioned.</div>
                )}
              </div>

              {/* LinkedIn */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    <span>LinkedIn vs Resume</span>
                  </span>
                  <span className="text-indigo-400">{linkedinMatch.matchRate}% Match</span>
                </div>
                {linkedinMatch.missingCerts.length > 0 ? (
                  <div className="text-[10px] text-amber-400/80 leading-relaxed">
                    💡 Missing on Resume: Google Cloud Professional ML Engineer is unmentioned.
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-400">✓ All certifications aligned.</div>
                )}
              </div>

              {/* Ingested projects */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Vault vs Resume</span>
                  </span>
                  <span className="text-emerald-400">{vaultProjectsMatch.matchRate}% Match</span>
                </div>
                {vaultProjectsMatch.unmentionedDocs.length > 0 ? (
                  <div className="text-[10px] text-amber-400/80 leading-relaxed">
                    💡 Missing on Resume: {vaultProjectsMatch.unmentionedDocs.join(', ')} project(s) not found on Resume.
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-400">✓ All projects verified on Resume.</div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
