import React, { useState, useEffect } from 'react';
import { UserProfile, DocumentItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Award,
  BookOpen,
  Download,
  Star,
  CheckCircle2,
  FileText,
  User,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCode,
  GraduationCap,
  Save,
  Check,
  Zap,
  Activity,
  Award as MedalIcon
} from 'lucide-react';

interface CandidateProfile {
  id: string;
  name: string;
  targetRole: string;
  college: string;
  degree: string;
  cgpa: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  projects: Array<{ title: string; desc: string }>;
  internships: Array<{ title: string; company: string; desc: string }>;
  certs: string[];
  resumeText: string;
  
  // Recruiter v2 Scores
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  leadershipScore: number;
  projectScore: number;
  resumeScore: number;
  internshipScore: number;
  
  // Strengths / Weaknesses
  strengths: string[];
  weaknesses: string[];
  recommendedRoles: string[];
}

export const RecruiterView: React.FC = () => {
  // Mock Candidates List
  const mockCandidates: CandidateProfile[] = [
    {
      id: 'cand-1',
      name: 'Subham Kumar Kewat',
      targetRole: 'Full Stack AI Developer',
      college: 'Veer Surendra Sai University of Technology (VSSUT Burla)',
      degree: 'Production Engineering (Expected 2027)',
      cgpa: '8.92',
      email: 'subham.kewat@example.com',
      phone: '+91 9439281273',
      location: 'Odisha, India',
      skills: ['Python', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Git', 'GitHub', 'PyTorch', 'Docker', 'FastAPI'],
      projects: [
        { title: 'SafeBand AI biometric platform', desc: 'Ingests real-time biometric hazard metrics using FastAPI telemetry.' },
        { title: 'Queue Cure clinics optimizer', desc: 'Poisson distribution queue routing software reducing ER waiting time.' }
      ],
      internships: [
        { title: 'IIT Bhilai Fluid Spreading Research', company: 'IIT Bhilai Fluids Lab', desc: 'Mathematical modeling and rheology calibrations.' },
        { title: 'SAIL Oxygen Plant diagnostics', company: 'Rourkela Steel Plant', desc: 'Diagnostic testing processes on mechanical compressors.' }
      ],
      certs: [
        'deeplearning.ai Deep Learning Specialization',
        'Google Cloud Professional Machine Learning Specialist'
      ],
      resumeText: 'Subham Kumar Kewat - Full Stack AI Developer B.Tech Production Engineering expected graduation 2027. Production systems engineering knowledge coupled with AI/RAG system orchestration.',
      overallScore: 88,
      technicalScore: 92,
      communicationScore: 84,
      leadershipScore: 80,
      projectScore: 90,
      resumeScore: 86,
      internshipScore: 95,
      strengths: ['Excellent python/pytorch stack', 'Strong process control logic', 'Hands-on hardware telemetry experience'],
      weaknesses: ['Transitioning from core domain', 'Limited deployment in AWS Cloud clusters'],
      recommendedRoles: ['AI Systems Engineer', 'Full Stack SDE Intern', 'MLOps Engineer']
    },
    {
      id: 'cand-2',
      name: 'Pooja Sharma',
      targetRole: 'Machine Learning Engineer',
      college: 'Indian Institute of Technology Bhilai (IIT Bhilai)',
      degree: 'Computer Science & Engineering',
      cgpa: '9.15',
      email: 'pooja.sharma@example.com',
      phone: '+91 8249172635',
      location: 'Chhattisgarh, India',
      skills: ['Python', 'PyTorch', 'C++', 'TensorFlow', 'SQL', 'Kubernetes', 'MLOps', 'Git', 'Pandas', 'NumPy'],
      projects: [
        { title: 'Vision Transformers Spreads', desc: 'Pattern recognition model quantifying surface spreads on porous paper substrates.' },
        { title: 'Automated MLflow pipeline', desc: 'Orchestrating model retraining pipelines with Docker and Minikube clusters.' }
      ],
      internships: [
        { title: 'Research Intern - Computer Vision', company: 'IIT Bhilai CSE Lab', desc: 'Trained CNNs mapping spreading behaviors of industrial fluids.' }
      ],
      certs: [
        'AWS Certified Machine Learning - Specialty',
        'NVIDIA Deep Learning Institute Computer Vision Certification'
      ],
      resumeText: 'Pooja Sharma - CSE Undergrad at IIT Bhilai. Deep expertise in computer vision, MLOps, scikit-learn estimators, and containerised model deployment.',
      overallScore: 91,
      technicalScore: 96,
      communicationScore: 82,
      leadershipScore: 85,
      projectScore: 92,
      resumeScore: 90,
      internshipScore: 88,
      strengths: ['Expert in MLOps pipelines', 'Advanced model training parameters', 'Top-tier CGPA metrics'],
      weaknesses: ['Limited frontend knowledge', 'Mainly focused on academic research models'],
      recommendedRoles: ['Machine Learning Engineer', 'Computer Vision Scientist']
    },
    {
      id: 'cand-3',
      name: 'Ankit Mishra',
      targetRole: 'Full Stack Developer',
      college: 'Veer Surendra Sai University of Technology (VSSUT Burla)',
      degree: 'Information Technology',
      cgpa: '8.65',
      email: 'ankit.mishra@example.com',
      phone: '+91 7381290345',
      location: 'Odisha, India',
      skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'CSS', 'TypeScript', 'HTML5', 'REST APIs'],
      projects: [
        { title: 'Microservices E-Commerce Dashboard', desc: 'Multi-service e-commerce board with Docker compose and RabbitMQ logs.' }
      ],
      internships: [
        { title: 'Web Developer Intern', company: 'SaaS Labs India', desc: 'Created dashboard screens utilizing React Query and Tailwind CSS.' }
      ],
      certs: [
        'Meta Full-Stack Developer Professional Certificate',
        'TypeScript Complete Developer Guide'
      ],
      resumeText: 'Ankit Mishra - IT Undergrad specializing in high-throughput React frontends, Node backends, and responsive CSS dashboards.',
      overallScore: 84,
      technicalScore: 86,
      communicationScore: 88,
      leadershipScore: 82,
      projectScore: 80,
      resumeScore: 85,
      internshipScore: 84,
      strengths: ['Responsive UX layouts design', 'Type-safe express API setups', 'Agile team collaboration skills'],
      weaknesses: ['Limited data modeling depth', 'Prone to CSS class cluttering'],
      recommendedRoles: ['Frontend Engineer', 'Full Stack Developer']
    }
  ];

  const [candidatesList, setCandidatesList] = useState<CandidateProfile[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-1');

  // Comparison IDs selection list
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  // Recruiter ratings and notes states persistent in localStorage
  const [notes, setNotes] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('mv_recruiter_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [ratings, setRatings] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('mv_recruiter_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  const [noteText, setNoteText] = useState('');
  const [savedNote, setSavedNote] = useState(false);

  const selectedCandidate = candidatesList.find(c => c.id === selectedCandidateId) || candidatesList[0];

  useEffect(() => {
    setNoteText(notes[selectedCandidate.id] || '');
  }, [selectedCandidateId, notes]);

  const filteredCandidates = candidatesList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveNotes = () => {
    const updatedNotes = { ...notes, [selectedCandidate.id]: noteText };
    setNotes(updatedNotes);
    localStorage.setItem('mv_recruiter_notes', JSON.stringify(updatedNotes));
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  };

  const handleSetRating = (candidateId: string, ratingValue: number) => {
    const updatedRatings = { ...ratings, [candidateId]: ratingValue };
    setRatings(updatedRatings);
    localStorage.setItem('mv_recruiter_ratings', JSON.stringify(updatedRatings));
  };

  const toggleComparisonSelection = (candidateId: string) => {
    if (comparisonIds.includes(candidateId)) {
      setComparisonIds(comparisonIds.filter(id => id !== candidateId));
    } else {
      if (comparisonIds.length >= 2) {
        alert("You can select up to 2 candidates for side-by-side comparison.");
        return;
      }
      setComparisonIds([...comparisonIds, candidateId]);
    }
  };

  const handleDownloadCandidateReport = (cand: CandidateProfile) => {
    const candidateNotes = notes[cand.id] || 'No evaluation notes recorded.';
    const candidateRating = ratings[cand.id] || 'Unrated';

    const textData = `
=========================================
MEMORYVERSE VERIFIED CANDIDATE REPORT
=========================================
Candidate Name: ${cand.name}
College: ${cand.college}
Degree: ${cand.degree} (CGPA: ${cand.cgpa})
Target Goal: ${cand.targetRole}
Location: ${cand.location}

-----------------------------------------
CANDIDATE ASSESSMENT SCORES:
- Overall Candidate Score: ${cand.overallScore}/100
- Technical Competency Score: ${cand.technicalScore}/100
- Communication Score: ${cand.communicationScore}/100
- Leadership Score: ${cand.leadershipScore}/100
- Project Execution Score: ${cand.projectScore}/100
- Resume Score: ${cand.resumeScore}/100
- Internship Performance: ${cand.internshipScore}/100

-----------------------------------------
STRENGTHS:
${cand.strengths.map(s => `- ${s}`).join('\n')}

-----------------------------------------
AREAS FOR DEVELOPMENT (WEAKNESSES):
${cand.weaknesses.map(w => `- ${w}`).join('\n')}

-----------------------------------------
RECOMMENDED JOB ROLES:
${cand.recommendedRoles.map(r => `- ${r}`).join('\n')}

-----------------------------------------
RECRUITER FEEDBACK NOTES:
- Rating: ${candidateRating} Stars
- Notes: ${candidateNotes}
    `;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cand.name.replace(/\s+/g, '_')}_Recruiter_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              RECRUITER AUDIT HUB
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Recruiter View Module
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare candidate profiles, check verified academic credentials, and compile private evaluation logs.
          </p>
        </div>

        <button
          onClick={() => setCompareMode(!compareMode)}
          disabled={comparisonIds.length < 2 && !compareMode}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border cursor-pointer ${
            compareMode
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-slate-200 disabled:opacity-40 font-mono'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{compareMode ? 'Standard View' : 'Compare Selection (2 Candidates)'}</span>
        </button>
      </div>

      {compareMode ? (
        /* COMPARISON MATRIX VIEWER (SIDE BY SIDE) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {comparisonIds.map(id => {
            const cand = candidatesList.find(c => c.id === id);
            if (!cand) return null;

            return (
              <div key={cand.id} className="p-6 rounded-3xl glass-panel border border-slate-805 bg-[#0f172a]/95 space-y-6">
                
                {/* Meta details */}
                <div className="flex justify-between items-start border-b border-slate-900 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{cand.name}</h3>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 mt-1 inline-block">
                      {cand.targetRole}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Candidate Rating</span>
                    <div className="flex justify-end space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleSetRating(cand.id, val)}
                          className="text-slate-500 hover:text-amber-400"
                        >
                          <Star className={`w-3.5 h-3.5 ${val <= (ratings[cand.id] || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-650'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score breakdown metrics grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">OVERALL</span>
                    <strong className="text-cyan-400 font-bold">{cand.overallScore}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">TECHNICAL</span>
                    <strong className="text-indigo-400 font-bold">{cand.technicalScore}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">PROJECTS</span>
                    <strong className="text-amber-400 font-bold">{cand.projectScore}%</strong>
                  </div>
                </div>

                {/* Info block */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase mb-1">CGPA Cutoff</span>
                    <strong className="text-slate-200">{cand.cgpa} GPA</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase mb-1">College</span>
                    <strong className="text-slate-200 truncate block">{cand.college.split(' ')[0]}</strong>
                  </div>
                </div>

                {/* Recommended Roles */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Recommended Roles</span>
                  <div className="flex flex-wrap gap-1">
                    {cand.recommendedRoles.map(r => (
                      <span key={r} className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 font-mono">{r}</span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Skills Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills.slice(0, 7).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-850 text-slate-300">
                        {s}
                      </span>
                    ))}
                    {cand.skills.length > 7 && <span className="text-[10px] text-slate-500">+{cand.skills.length - 7} more</span>}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleDownloadCandidateReport(cand)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Candidate Report</span>
                </button>

              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD RECRUITER WORKSPACE VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Candidate Search List */}
          <div className="lg:col-span-1 p-5 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 flex flex-col space-y-4 max-h-[580px] shadow-lg">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search candidates, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            {/* List */}
            <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
              {filteredCandidates.map(cand => {
                const isSelected = selectedCandidateId === cand.id;
                const isCompared = comparisonIds.includes(cand.id);

                return (
                  <div
                    key={cand.id}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div onClick={() => setSelectedCandidateId(cand.id)} className="space-y-1.5 flex-1">
                      <div className="flex justify-between items-start">
                        <strong className={`text-xs block group-hover:text-cyan-400 transition-colors ${
                          isSelected ? 'text-cyan-300' : 'text-slate-200'
                        }`}>{cand.name}</strong>
                        
                        <span className="flex items-center text-amber-400 text-[10px] font-bold">
                          {(ratings[cand.id] || 0) > 0 ? `★ ${ratings[cand.id]}` : ''}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono block truncate">{cand.targetRole}</span>
                      <span className="text-[9px] text-slate-550 block font-mono">Score: {cand.overallScore}% | CGPA: {cand.cgpa}</span>
                    </div>

                    {/* Comparison selector checkbox */}
                    <div className="pt-2 border-t border-slate-900 mt-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-550">Compete select:</span>
                      <button
                        onClick={() => toggleComparisonSelection(cand.id)}
                        className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                          isCompared
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-900 text-slate-500 border-slate-850 hover:text-slate-350'
                        }`}
                      >
                        {isCompared ? '✓ Selected' : '+ Compare'}
                      </button>
                    </div>

                    {/* Active highlight bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-cyan-400" />
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right panel (2 cols): Selected Candidate Detailed Auditing */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Candidate Executive Panel */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-5 shadow-lg">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-900">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-outfit">{selectedCandidate.name}</h3>
                  <div className="text-xs text-cyan-400 font-mono mt-1">{selectedCandidate.targetRole}</div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">{selectedCandidate.location} | {selectedCandidate.email}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">Candidate Rating</span>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleSetRating(selectedCandidate.id, val)}
                        className="text-slate-500 hover:text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${val <= (ratings[selectedCandidate.id] || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-755'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CANDIDATE MATRIX SCORES GRID */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Recruiter Assessment Matrix</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">OVERALL</span>
                    <strong className="text-cyan-400 text-sm mt-0.5 block">{selectedCandidate.overallScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">TECHNICAL</span>
                    <strong className="text-indigo-400 text-sm mt-0.5 block">{selectedCandidate.technicalScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">COMMUNICATION</span>
                    <strong className="text-emerald-400 text-sm mt-0.5 block">{selectedCandidate.communicationScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">LEADERSHIP</span>
                    <strong className="text-amber-400 text-sm mt-0.5 block">{selectedCandidate.leadershipScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">PROJECTS</span>
                    <strong className="text-cyan-400 text-sm mt-0.5 block">{selectedCandidate.projectScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">RESUME</span>
                    <strong className="text-indigo-400 text-sm mt-0.5 block">{selectedCandidate.resumeScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900">
                    <span className="text-[8px] text-slate-500 block">INTERNSHIPS</span>
                    <strong className="text-emerald-400 text-sm mt-0.5 block">{selectedCandidate.internshipScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center flex-col">
                    <span className="text-[8px] text-slate-500 block">RATING</span>
                    <strong className="text-amber-400 text-sm mt-0.5 block">★ {ratings[selectedCandidate.id] || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* Recommended roles */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Recommended Roles</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.recommendedRoles.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">{r}</span>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">Strengths Discoveries</span>
                  <ul className="space-y-1 text-[11px] text-slate-350">
                    {selectedCandidate.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] text-red-400 font-bold block uppercase">Development Gaps</span>
                  <ul className="space-y-1 text-[11px] text-slate-355">
                    {selectedCandidate.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-red-400">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Skills Stack</span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {selectedCandidate.skills.map(s => (
                    <span key={s} className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions: Download report */}
              <button
                onClick={() => handleDownloadCandidateReport(selectedCandidate)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Candidate Verified Report</span>
              </button>

            </div>

            {/* Recruiter Evaluation Notes persist box */}
            <div className="p-6 rounded-3xl border border-indigo-500/25 bg-[#0d1224] space-y-4">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                Evaluator Evaluation Notes
              </h4>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write private notes on candidate parameters, interview schedules, or weaknesses..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveNotes}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    savedNote ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-500 hover:bg-indigo-400 text-slate-100'
                  }`}
                >
                  {savedNote ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{savedNote ? 'Notes Logged!' : 'Save Evaluation Notes'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </motion.div>
  );
};
