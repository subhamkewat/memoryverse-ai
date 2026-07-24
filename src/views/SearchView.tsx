import React, { useState, useEffect, useRef } from 'react';
import { DocumentItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  FileText,
  ArrowRight,
  CornerDownRight,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Send,
  User,
  Plus,
  Compass,
  Award,
  BookOpen,
  FolderKanban,
  FileSpreadsheet
} from 'lucide-react';

interface SearchViewProps {
  documents: DocumentItem[];
  onOpenDocModal: (doc: DocumentItem) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  relatedDocs?: DocumentItem[];
  matchedCategories?: {
    projects: any[];
    companies: any[];
    skills: string[];
    documents: DocumentItem[];
    certificates: any[];
    internships: any[];
    reports: any[];
  };
}

export const SearchView: React.FC<SearchViewProps> = ({ documents, onOpenDocModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('mv_search_history');
    return saved ? JSON.parse(saved) : [
      "Show all React projects.",
      "Explain Queue Cure.",
      "Find certificates related to AI."
    ];
  });

  const [activeChat, setActiveChat] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptShortcuts = [
    "Show all React projects.",
    "Which internship taught Process Control?",
    "Find MongoDB projects.",
    "Show Python skills.",
    "Find certificates related to AI."
  ];

  // Auto scroll to chat bottoms
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, isTyping]);

  const saveHistoryState = (updated: string[]) => {
    setChatHistory(updated);
    localStorage.setItem('mv_search_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm("Clear all past search query logs?")) {
      saveHistoryState([]);
      setActiveChat([]);
    }
  };

  // Global Search Engine covering Projects, Companies, Skills, Documents, Certificates, Internships, Reports
  const getAIAnswer = (query: string): ChatMessage => {
    const queryLower = query.toLowerCase().trim();
    let text = `Analyzing global RAG indexes for: "${query}". Based on matching semantic scores:`;

    // 1. Projects Match
    const matchedProjects = documents.filter(d => 
      d.category === 'Projects' && (d.title.toLowerCase().includes(queryLower) || d.summary.toLowerCase().includes(queryLower))
    );

    // 2. Companies Match
    const targetCompaniesList = ['Google', 'NVIDIA', 'Tata Motors', 'Hindalco', 'SAIL', 'Zepto', 'Razorpay'];
    const matchedCompanies = targetCompaniesList.filter(comp => comp.toLowerCase().includes(queryLower));

    // 3. Skills Match
    const targetSkillsList = ['Python', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Git', 'GitHub', 'PyTorch', 'Docker', 'FastAPI'];
    const matchedSkills = targetSkillsList.filter(s => s.toLowerCase().includes(queryLower));

    // 4. General Documents Match
    const matchedDocuments = documents.filter(d => 
      d.title.toLowerCase().includes(queryLower) || d.rawText.toLowerCase().includes(queryLower)
    );

    // 5. Certificates Match
    const matchedCertificates = documents.filter(d => 
      d.category === 'Certifications' && (d.title.toLowerCase().includes(queryLower) || d.issuer?.toLowerCase().includes(queryLower))
    );

    // 6. Internships Match
    const matchedInternships = documents.filter(d => 
      d.category === 'Internships' && (d.title.toLowerCase().includes(queryLower) || d.issuer?.toLowerCase().includes(queryLower))
    );

    // 7. Practice Reports Match
    const mockReportTitles = ['Technical React Interview Report', 'HR Evaluation Logs Report', 'AWS System Design Report'];
    const matchedReports = mockReportTitles.filter(rep => rep.toLowerCase().includes(queryLower));

    // Custom phrasing helper
    if (matchedProjects.length > 0) {
      text += ` Found ${matchedProjects.length} matching project configurations.`;
    }
    if (matchedSkills.length > 0) {
      text += ` Matched ${matchedSkills.length} technical skills in your core matrix.`;
    }
    if (matchedInternships.length > 0) {
      text += ` Identified ${matchedInternships.length} industry internship nodes.`;
    }
    if (matchedProjects.length === 0 && matchedSkills.length === 0 && matchedInternships.length === 0) {
      text = `No direct matches for: "${query}". Displaying closest semantic nodes from your vault index.`;
    }

    return {
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      text,
      relatedDocs: matchedDocuments.slice(0, 3),
      matchedCategories: {
        projects: matchedProjects,
        companies: matchedCompanies,
        skills: matchedSkills,
        documents: matchedDocuments,
        certificates: matchedCertificates,
        internships: matchedInternships,
        reports: matchedReports
      }
    };
  };

  const handleTriggerSearch = (promptStr: string) => {
    if (!promptStr.trim()) return;

    if (!chatHistory.includes(promptStr.trim())) {
      saveHistoryState([promptStr.trim(), ...chatHistory.slice(0, 10)]);
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptStr
    };

    setActiveChat(prev => [...prev, userMsg]);
    setSearchQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const ansMsg = getAIAnswer(promptStr);
      setActiveChat(prev => [...prev, ansMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...activeChat].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      setIsTyping(true);
      setTimeout(() => {
        const ansMsg = getAIAnswer(lastUserMsg.text);
        setActiveChat(prev => [...prev.slice(0, -1), ansMsg]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleCopyMessage = (id: string, contentText: string) => {
    navigator.clipboard.writeText(contentText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12 max-w-6xl mx-auto h-[calc(100vh-140px)]"
    >
      
      {/* Sidebar: Chat history list */}
      <div className="lg:col-span-1 p-5 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 flex flex-col justify-between max-h-[580px] shadow-lg">
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Chat History</h3>
            {chatHistory.length > 0 && (
              <button onClick={clearHistory} className="text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center space-x-1 font-mono">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono">
            {chatHistory.map((h, idx) => (
              <button
                key={idx}
                onClick={() => handleTriggerSearch(h)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all truncate block cursor-pointer"
              >
                {h}
              </button>
            ))}
            {chatHistory.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-xs">
                No past searches logged.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 text-center font-mono text-[9px] text-slate-500">
          MemoryVerse RAG v2.4
        </div>
      </div>

      {/* Main chat window workspace */}
      <div className="lg:col-span-3 p-6 rounded-3xl glass-panel border border-slate-805 bg-[#0f172a]/95 flex flex-col justify-between max-h-[580px] shadow-xl relative overflow-hidden">
        
        {/* Messages list scroll space */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none pb-4">
          
          {activeChat.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto pt-12">
              <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-slate-100 font-outfit">AI Natural Language RAG Search</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Query your digital identity vault using conversational phrasing. Searches are compiled across skills, certificates, and internships.
                </p>
              </div>

              {/* Suggestions shortcuts */}
              <div className="w-full space-y-2 text-left text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Suggested Prompts</span>
                <div className="flex flex-wrap gap-2">
                  {promptShortcuts.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTriggerSearch(s)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-cyan-500/40 text-slate-350 hover:text-cyan-400 transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeChat.map((m) => (
            <div
              key={m.id}
              className={`p-4.5 rounded-2xl flex items-start space-x-3.5 transition-all text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-900/60 border border-slate-850 ml-12'
                  : 'bg-indigo-500/5 border border-indigo-500/10 mr-12'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                m.sender === 'user' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-indigo-500/15 text-indigo-400'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className="flex-1 space-y-3.5">
                <p className="text-slate-200 font-sans">{m.text}</p>

                {/* Categories classification matches */}
                {m.matchedCategories && (
                  <div className="space-y-3 pt-2 border-t border-slate-900 font-mono text-[10px]">
                    
                    {/* Skills matches */}
                    {m.matchedCategories.skills.length > 0 && (
                      <div>
                        <span className="text-slate-550 block mb-1">SKILLS MATRIX:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.matchedCategories.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects matches */}
                    {m.matchedCategories.projects.length > 0 && (
                      <div>
                        <span className="text-slate-550 block mb-1">PROJECTS:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.matchedCategories.projects.map(p => (
                            <button key={p.id} onClick={() => onOpenDocModal(p)} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400 flex items-center space-x-1">
                              <FolderKanban className="w-3 h-3" />
                              <span>{p.title.replace(/\.[^/.]+$/, "")}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Internships matches */}
                    {m.matchedCategories.internships.length > 0 && (
                      <div>
                        <span className="text-slate-550 block mb-1">INTERNSHIPS:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.matchedCategories.internships.map(i => (
                            <button key={i.id} onClick={() => onOpenDocModal(i)} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:border-indigo-400 flex items-center space-x-1">
                              <Award className="w-3 h-3" />
                              <span>{i.issuer} Internship</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Companies matches */}
                    {m.matchedCategories.companies.length > 0 && (
                      <div>
                        <span className="text-slate-550 block mb-1">COMPANIES FIT:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.matchedCategories.companies.map(c => (
                            <span key={c} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Related Documents files matches links */}
                {m.relatedDocs && m.relatedDocs.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-900 space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Related Documents Node</span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.relatedDocs.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => onOpenDocModal(doc)}
                          className="px-2.5 py-1 rounded bg-slate-950 border border-slate-850 hover:border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{doc.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response controls (Copy, Regenerate) */}
                {m.sender === 'assistant' && (
                  <div className="pt-2 flex space-x-3 text-[10px] font-mono text-slate-500 border-t border-slate-900/40">
                    <button
                      onClick={() => handleCopyMessage(m.id, m.text)}
                      className="hover:text-cyan-400 flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy Response'}</span>
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="hover:text-cyan-400 flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Regenerate Response</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Typing animation block */}
          {isTyping && (
            <div className="p-4.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mr-12 flex items-start space-x-3.5">
              <div className="p-2 rounded-xl bg-indigo-505/15 text-indigo-400 shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex space-x-1.5 py-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input prompt area */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleTriggerSearch(searchQuery); }}
          className="border-t border-slate-900 pt-4 flex items-center space-x-2"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your search query (e.g. Show FastAPI projects)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </motion.div>
  );
};
