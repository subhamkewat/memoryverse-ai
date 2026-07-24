import React, { useState, useEffect } from 'react';
import {
  initialUserProfile,
  initialDocuments,
  initialTimelineMilestones,
  initialChatMessages,
  initialAnalyticsSummary
} from './mockData';
import { DocumentItem, UserProfile, ChatMessage, TimelineMilestone, KnowledgeNode, KnowledgeLink, AnalyticsSummary, DocumentCategory } from './types';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocumentModal } from './components/DocumentModal';
import { Sparkles, MessageSquare } from 'lucide-react';

const LandingPage = React.lazy(() => import('./views/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardView = React.lazy(() => import('./views/DashboardView').then(m => ({ default: m.DashboardView })));
const UploadView = React.lazy(() => import('./views/UploadView').then(m => ({ default: m.UploadView })));
const VaultView = React.lazy(() => import('./views/VaultView').then(m => ({ default: m.VaultView })));
const KnowledgeGraphView = React.lazy(() => import('./views/KnowledgeGraphView').then(m => ({ default: m.KnowledgeGraphView })));
const TimelineView = React.lazy(() => import('./views/TimelineView').then(m => ({ default: m.TimelineView })));
const SearchView = React.lazy(() => import('./views/SearchView').then(m => ({ default: m.SearchView })));
const ChatView = React.lazy(() => import('./views/ChatView').then(m => ({ default: m.ChatView })));
const AnalyticsView = React.lazy(() => import('./views/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const ProfileView = React.lazy(() => import('./views/ProfileView').then(m => ({ default: m.ProfileView })));
const SettingsView = React.lazy(() => import('./views/SettingsView').then(m => ({ default: m.SettingsView })));
const AtsView = React.lazy(() => import('./views/AtsView').then(m => ({ default: m.AtsView })));
const PredictionView = React.lazy(() => import('./views/PredictionView').then(m => ({ default: m.PredictionView })));
const InterviewView = React.lazy(() => import('./views/InterviewView').then(m => ({ default: m.InterviewView })));
const SkillGapView = React.lazy(() => import('./views/SkillGapView').then(m => ({ default: m.SkillGapView })));
const RoadmapView = React.lazy(() => import('./views/RoadmapView').then(m => ({ default: m.RoadmapView })));
const RecruiterView = React.lazy(() => import('./views/RecruiterView').then(m => ({ default: m.RecruiterView })));
const AdminView = React.lazy(() => import('./views/AdminView').then(m => ({ default: m.AdminView })));
import { generateRAGResponseWithGemini } from './utils/gemini';
const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 font-mono text-xs">
    <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
    <span className="text-slate-400 uppercase tracking-widest animate-pulse">Orchestrating Vector Pipeline...</span>
  </div>
);

export default function App() {
  // 1. Centralized State Loaders from localStorage
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mv_user');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('mv_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [skills, setSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('mv_skills');
    return saved ? JSON.parse(saved) : [
      "Python", "JavaScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "SQL", "HTML", "CSS", "Git", "GitHub"
    ];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mv_chat_messages');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('mv_gemini_api_key') || '';
  });

  const [currentView, setCurrentView] = useState<string>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [inspectDoc, setInspectDoc] = useState<DocumentItem | null>(null);

  // Floating Career Assistant States
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Hello! I am your career assistant. Ask me anything about resume reviews, ATS optimizer checks, or interview preparation guidance!' }
  ]);

  const handleSendAssistantMessage = async (textStr: string) => {
    if (!textStr.trim()) return;
    
    const userMsg = { sender: 'user' as const, text: textStr };
    setAssistantMessages(prev => [...prev, userMsg]);
    setAssistantInput('');

    setTimeout(() => {
      const q = textStr.toLowerCase();
      let answer = "I have scanned your digital credentials database. Let's analyze your path:";
      
      if (q.includes('ats') || q.includes('resume')) {
        answer = "Your ATS resume score is currently 88%. To hit the 95% threshold: 1. Add specific project metric keywords (e.g. 'reduced latency by 30%'). 2. List PyTorch and FastAPI under core technologies.";
      } else if (q.includes('project') || q.includes('capstone')) {
        answer = "For a Full Stack AI role, build a 'Multi-tenant Document Vector Indexer' using FastAPI, next.js server actions, and Pinecone vectors. This displays direct product-market fit.";
      } else if (q.includes('career') || q.includes('suggest')) {
        answer = "Based on your Production background and ML skills, your highest matching path is MLOps or AI Systems Engineer. Focus on Docker packaging and CI/CD automation.";
      } else {
        answer = "I have indexed your files. To maximize your placement compatibility, update your settings API keys and check the Skill Gap Analyzer page.";
      }

      setAssistantMessages(prev => [...prev, { sender: 'assistant', text: answer }]);
    }, 700);
  };

  // 2. Persist State Changes to localStorage
  useEffect(() => {
    localStorage.setItem('mv_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mv_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('mv_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('mv_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('mv_gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  // 3. Dynamic Knowledge Graph Generation from state
  const deriveKnowledgeGraph = (): { nodes: KnowledgeNode[]; links: KnowledgeLink[] } => {
    const derivedNodes: KnowledgeNode[] = [];
    const derivedLinks: KnowledgeLink[] = [];

    // Root Career Goal Node
    derivedNodes.push({
      id: "career-root",
      label: user.targetRole || "Full Stack AI Developer",
      type: "career",
      category: "Target Role",
      val: 38,
      color: "#f43f5e",
      description: `Aspirational career milestone to work as a ${user.targetRole}.`
    });

    // Skill Nodes from user skills state
    skills.forEach((skill) => {
      const skillId = `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`;
      derivedNodes.push({
        id: skillId,
        label: skill,
        type: "skill",
        category: "Skills Stack",
        val: 26,
        color: "#f59e0b",
        description: `Verified skill in ${skill}.`
      });

      // Connect every skill to the main target career goal
      derivedLinks.push({
        source: skillId,
        target: "career-root",
        label: "Required Skill",
        strength: 0.8
      });
    });

    // Project & Internship Nodes derived directly from uploaded documents
    documents.forEach((doc) => {
      if (doc.category === 'Projects') {
        const nodeId = `proj-${doc.id}`;
        derivedNodes.push({
          id: nodeId,
          label: doc.title.replace(/\.[^/.]+$/, ""), // strip extension
          type: "project",
          category: "Projects",
          val: 30,
          color: "#38bdf8",
          description: doc.summary
        });

        // Link project to career goal
        derivedLinks.push({
          source: nodeId,
          target: "career-root",
          label: "Portfolio Proof",
          strength: 0.9
        });

        // Scan document text/tags for matching skills to generate connection links
        skills.forEach((skill) => {
          const skillId = `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`;
          const skillLower = skill.toLowerCase();
          if (
            doc.title.toLowerCase().includes(skillLower) ||
            doc.summary.toLowerCase().includes(skillLower) ||
            doc.tags.some(t => t.toLowerCase().includes(skillLower))
          ) {
            derivedLinks.push({
              source: skillId,
              target: nodeId,
              label: "Implemented In",
              strength: 0.95
            });
          }
        });
      } else if (doc.category === 'Internships') {
        const nodeId = `intern-${doc.id}`;
        derivedNodes.push({
          id: nodeId,
          label: doc.title.replace(/\.[^/.]+$/, ""),
          type: "internship",
          category: "Internships",
          val: 28,
          color: "#34d399",
          description: doc.summary
        });

        // Link internship to career goal
        derivedLinks.push({
          source: nodeId,
          target: "career-root",
          label: "Practical Exp",
          strength: 0.92
        });

        // Connect matching skills
        skills.forEach((skill) => {
          const skillId = `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`;
          const skillLower = skill.toLowerCase();
          if (
            doc.summary.toLowerCase().includes(skillLower) ||
            doc.tags.some(t => t.toLowerCase().includes(skillLower))
          ) {
            derivedLinks.push({
              source: skillId,
              target: nodeId,
              label: "Practiced Skill",
              strength: 0.9
            });
          }
        });
      } else if (doc.category === 'Certifications') {
        const nodeId = `cert-${doc.id}`;
        derivedNodes.push({
          id: nodeId,
          label: doc.title.replace(/\.[^/.]+$/, ""),
          type: "certification",
          category: "Certifications",
          val: 24,
          color: "#c084fc",
          description: doc.summary
        });

        // Link certification to career goal
        derivedLinks.push({
          source: nodeId,
          target: "career-root",
          label: "Certified Link",
          strength: 0.85
        });
      }
    });

    return { nodes: derivedNodes, links: derivedLinks };
  };

  const graphData = deriveKnowledgeGraph();

  // 4. Dynamic Timeline Milestone Generation
  const deriveTimeline = (): TimelineMilestone[] => {
    const list: TimelineMilestone[] = [
      {
        id: "base-enrollment",
        title: `Enrolled in ${user.college}`,
        category: "Academics",
        date: "2023-08-01",
        organization: user.college,
        description: `Began degree studies specializing in ${user.degree}.`,
        skills: ["Engineering Foundations"],
        impactScore: 85,
        badge: "Academic Start"
      }
    ];

    documents.forEach((doc) => {
      // Create milestones for key categories
      if (['Internships', 'Projects', 'Certifications', 'Achievements', 'Research'].includes(doc.category)) {
        list.push({
          id: `milestone-${doc.id}`,
          title: doc.title.replace(/\.[^/.]+$/, ""),
          category: doc.category,
          date: doc.dateCompleted || doc.uploadDate,
          organization: doc.issuer || "Verified Milestone",
          description: doc.summary,
          skills: doc.tags,
          impactScore: doc.confidenceScore,
          badge: doc.category === 'Achievements' ? 'Trophy Accomplished' : `${doc.category} Verified`,
          documentId: doc.id
        });
      }
    });

    // Sort chronologically (latest milestones first or oldest first? Let's sort oldest first for chronological timeline flow)
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const milestones = deriveTimeline();

  // 5. Dynamic Career Analytics Calculations
  const deriveAnalytics = (): AnalyticsSummary => {
    const totalDocs = documents.length;
    const skillsCount = skills.length;
    const projects = documents.filter(d => d.category === 'Projects').length;
    const internships = documents.filter(d => d.category === 'Internships').length;
    const certs = documents.filter(d => d.category === 'Certifications').length;
    const achievements = documents.filter(d => d.category === 'Achievements').length;
    
    const confidenceScores = documents.map(d => d.confidenceScore);
    const avgConfidence = confidenceScores.length > 0 
      ? Math.round(confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length * 10) / 10
      : 98.2;

    // Dynamic career score calculator based on user profile entries
    const cgpaVal = parseFloat(user.cgpa) || 8.0;
    const baseCgpaContribution = Math.min(40, (cgpaVal / 10) * 40);
    const skillsContribution = Math.min(20, (skillsCount / 10) * 20);
    const projectsContribution = Math.min(20, (projects / 3) * 20);
    const internshipsContribution = Math.min(20, (internships / 2) * 20);

    const calculatedReadiness = Math.round(
      Math.min(99, baseCgpaContribution + skillsContribution + projectsContribution + internshipsContribution)
    );

    return {
      totalDocuments: totalDocs,
      skillsExtracted: skillsCount,
      projectsCount: projects,
      internshipsCount: internships,
      certificationsCount: certs,
      achievementsCount: achievements,
      careerReadiness: calculatedReadiness,
      aiConfidenceAvg: avgConfidence
    };
  };

  const analytics = deriveAnalytics();

  // Trigger dynamic updates to Career Score in profile
  useEffect(() => {
    if (user.careerScore !== analytics.careerReadiness) {
      setUser((prev) => ({ ...prev, careerScore: analytics.careerReadiness }));
    }
  }, [analytics.careerReadiness]);

  // 6. Complete CRUD callbacks
  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => {
      let list = prev;
      // Requirement 6: Uploading a new PDF/DOCX of same title or Resume replaces previous version
      if (newDoc.category === 'Resume') {
        list = prev.filter((d) => d.category !== 'Resume');
      }
      list = list.filter((d) => d.title.toLowerCase() !== newDoc.title.toLowerCase());
      return [newDoc, ...list];
    });
  };

  const handleUpdateDocument = (updatedDoc: DocumentItem) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)));
    // If the inspectDoc is currently open, sync it
    if (inspectDoc && inspectDoc.id === updatedDoc.id) {
      setInspectDoc(updatedDoc);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  // 7. RAG assistant messaging with state mapping
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const thinkingMsg: ChatMessage = {
      id: `msg-think-${Date.now()}`,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinking: true
    };

    setChatMessages((prev) => [...prev, userMsg, thinkingMsg]);

    if (geminiApiKey) {
      generateRAGResponseWithGemini(text, documents, user, skills, geminiApiKey)
        .then((res) => {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.isThinking
                ? {
                    id: `msg-ai-${Date.now()}`,
                    sender: 'ai',
                    text: res.text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    citations: res.citations.length > 0 ? res.citations : documents.slice(0, 2).map(d => ({ title: d.title, category: d.category, id: d.id })),
                    isThinking: false
                  }
                : m
            )
          );
        })
        .catch((err) => {
          console.error("Gemini RAG fetch failed:", err);
          fallbackRAGResponse(text);
        });
    } else {
      fallbackRAGResponse(text);
    }
  };

  const fallbackRAGResponse = (text: string) => {
    let replyText = `Based on your **verified digital portfolio and current skills profile**, here is the synthesized answer:\n\n`;
    let citations = documents.slice(0, 2).map((d) => ({ title: d.title, category: d.category, id: d.id }));

    const lower = text.toLowerCase();
    if (lower.includes('summar') || lower.includes('strength')) {
      replyText += `### 🌟 Executive Career Summary\n- **Target Career Path**: ${user.targetRole}\n- **Verified CGPA / Branch**: ${user.cgpa} | ${user.degree}\n- **Top Skills Stack**: ${skills.slice(0, 6).join(', ')}\n- **Verified Ingested Projects**: ${documents.filter(d => d.category === 'Projects').map(d => d.title.replace(/\.[^/.]+$/, "")).join(', ')}\n- **Placement Readiness Fit**: **${analytics.careerReadiness}%**`;
    } else if (lower.includes('missing') || lower.includes('recommend') || lower.includes('gap')) {
      replyText += `### 🚀 AI Skill Recommendation\n1. **Docker Containerization**: Building deployment configs for your portfolio projects.\n2. **Continuous Integration (CI/CD)**: Establishing GitHub Actions pipelines to deploy your Next.js dashboards.\n3. **ML Deployment (FastAPI)**: Deploying predictive algorithms as endpoints.`;
    } else if (lower.includes('intern') || lower.includes('iit bhilai') || lower.includes('liquid') || lower.includes('paper')) {
      const iitDoc = documents.find((d) => d.title.toLowerCase().includes('iit'));
      replyText += `### 🔬 Research Internship Highlight\n${
        iitDoc 
          ? `According to your letter **${iitDoc.title}**, you worked on: *Determining Experimental Correlation between Liquid Spreading on Paper & Fluid Rheological Behaviour through Pattern Analysis* using Python.` 
          : `Your IIT Bhilai Research letter indicates droplet spread modeling using computer vision python models.`
      }`;
    } else {
      replyText += `You have successfully indexed **${documents.length} documents** inside your memory vault. Your profile shows proficiency in **${skills.join(', ')}**. What specific question can I help you answer?`;
    }

    setChatMessages((prev) =>
      prev.map((m) =>
        m.isThinking
          ? {
              id: `msg-ai-${Date.now()}`,
              sender: 'ai',
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              citations,
              isThinking: false
            }
          : m
      )
    );
  };

  const handleOpenDocModalById = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) setInspectDoc(doc);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, documents, skills }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MemoryVerse_AI_Digital_Identity_${user.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#080c14] text-slate-100' : 'bg-slate-50 text-slate-900'} relative font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden`}>
      
      {/* Background Floating Particles Canvas */}
      <BackgroundParticles />

      {/* Top Header Navbar */}
      <Header
        user={user}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setCurrentView('search')}
      />

      {/* Main Container Layout */}
      <div className="flex">
        
        {/* Navigation Sidebar */}
        {currentView !== 'landing' && (
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            docCount={documents.length}
          />
        )}

        {/* View Router Main Area */}
        <main
          className={`flex-1 transition-all duration-300 min-w-0 ${
            currentView === 'landing'
              ? 'w-full'
              : sidebarCollapsed
              ? 'ml-20 p-4 sm:p-8'
              : 'ml-20 md:ml-64 p-4 sm:p-8'
          }`}
        >
          <React.Suspense fallback={<LoadingSkeleton />}>
            {currentView === 'landing' && (
            <LandingPage
              onGetStarted={() => setCurrentView('dashboard')}
              onUploadClick={() => setCurrentView('upload')}
              onTryDemo={() => setCurrentView('graph')}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              documents={documents}
              analytics={analytics}
              onNavigate={(view) => setCurrentView(view)}
              onOpenDocModal={(doc) => setInspectDoc(doc)}
            />
          )}

          {currentView === 'upload' && (
            <UploadView
              onAddDocument={handleAddDocument}
              onNavigate={(view) => setCurrentView(view)}
              apiKey={geminiApiKey}
            />
          )}

          {currentView === 'vault' && (
            <VaultView
              documents={documents}
              onOpenDocModal={(doc) => setInspectDoc(doc)}
              onNavigateUpload={() => setCurrentView('upload')}
            />
          )}

          {currentView === 'graph' && (
            <KnowledgeGraphView
              nodes={graphData.nodes}
              links={graphData.links}
              onNavigateVault={() => setCurrentView('vault')}
            />
          )}

          {currentView === 'timeline' && (
            <TimelineView
              milestones={milestones}
              onOpenDocModalById={handleOpenDocModalById}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              documents={documents}
              onOpenDocModal={(doc) => setInspectDoc(doc)}
            />
          )}

          {currentView === 'chat' && (
            <ChatView
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onOpenDocModalById={handleOpenDocModalById}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView analytics={analytics} />
          )}

          {currentView === 'profile' && (
            <ProfileView
              user={user}
              onUpdateProfile={(updated) => setUser(updated)}
              userSkills={skills}
              onUpdateSkills={(updatedSkills) => setSkills(updatedSkills)}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode(!darkMode)}
              onExportData={handleExportData}
              apiKey={geminiApiKey}
              onUpdateApiKey={setGeminiApiKey}
            />
          )}

          {currentView === 'ats' && (
            <AtsView />
          )}

          {currentView === 'prediction' && (
            <PredictionView />
          )}

          {currentView === 'interview' && (
            <InterviewView />
          )}

          {currentView === 'skillgap' && (
            <SkillGapView />
          )}

          {currentView === 'roadmap' && (
            <RoadmapView />
          )}

          {currentView === 'recruiter' && (
            <RecruiterView />
          )}

          {currentView === 'admin' && (
            <AdminView />
          )}
          </React.Suspense>
        </main>

      </div>

      {/* Floating AI Career Assistant Chat Box */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {showAssistant && (
          <div className="w-80 sm:w-96 rounded-2xl glass-panel border border-cyan-500/30 bg-[#0f172a] shadow-2xl p-4 mb-3 flex flex-col space-y-3 max-h-[460px] animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">AI Career Assistant</span>
              </div>
              <button
                onClick={() => setShowAssistant(false)}
                className="text-slate-500 hover:text-slate-350 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Message History list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 text-xs max-h-[250px] pr-1">
              {assistantMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 border-slate-800 text-slate-200 ml-6 text-right'
                      : 'bg-cyan-500/5 border-cyan-500/10 text-slate-300 mr-6'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Clicks suggestions */}
            <div className="flex flex-wrap gap-1 text-[9px] font-mono">
              <button
                onClick={() => handleSendAssistantMessage("Review my ATS Resume details")}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-450 hover:text-cyan-400 cursor-pointer"
              >
                # ATS Check
              </button>
              <button
                onClick={() => handleSendAssistantMessage("Suggest a capstone project")}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-450 hover:text-cyan-400 cursor-pointer"
              >
                # Capstone Project
              </button>
              <button
                onClick={() => handleSendAssistantMessage("Recommend next steps")}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-450 hover:text-cyan-400 cursor-pointer"
              >
                # Career Path
              </button>
            </div>

            {/* Input prompt */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendAssistantMessage(assistantInput); }}
              className="flex items-center space-x-1.5 border-t border-slate-900 pt-2"
            >
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask career advice..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowAssistant(!showAssistant)}
          className="p-4 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:scale-105 text-slate-950 font-bold shadow-2xl flex items-center justify-center cursor-pointer transition-all animate-pulse"
        >
          <MessageSquare className="w-5 h-5 text-slate-950" />
        </button>
      </div>

      {/* Global Document Detail Inspection & Edit/Delete Modal */}
      <DocumentModal
        document={inspectDoc}
        onClose={() => setInspectDoc(null)}
        onUpdateDocument={handleUpdateDocument}
        onDeleteDocument={handleDeleteDocument}
      />

    </div>
  );
}
