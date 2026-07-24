import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Brain,
  GitFork,
  MessageSquare,
  ShieldCheck,
  Zap,
  Award,
  Layers,
  BarChart,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Play,
  FileText,
  Mail,
  Send,
  HelpCircle,
  Database,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onUploadClick: () => void;
  onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onUploadClick,
  onTryDemo
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [demoActiveSample, setDemoActiveSample] = useState<'internship' | 'aws' | 'resume'>('internship');
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Active architecture node selected
  const [activeArchNode, setActiveArchNode] = useState<string>('ocr');

  const demoSamples = {
    internship: {
      title: "IIT Bhilai Research Internship Letter.pdf",
      issuer: "IIT Bhilai Fluidics & Pattern Lab",
      entities: [
        { label: "Organization", val: "IIT Bhilai Lab" },
        { label: "Role", val: "Fluidics Research Intern" },
        { label: "Core Project", val: "Liquid Spreading & Fluid Rheology Analysis" },
        { label: "Technologies", val: "Python, Computer Vision, Regression Models" }
      ],
      vectorTag: "AI_RESEARCH_FLUIDICS_PATTERN_CORRELATION"
    },
    aws: {
      title: "SafeBand AI Wearable Project Report.docx",
      issuer: "VSSUT Burla Software Lab",
      entities: [
        { label: "Project Title", val: "SafeBand AI Wearable" },
        { label: "Architecture", val: "React, Node.js, Express, MongoDB" },
        { label: "Domain", val: "Industrial Ambient Safety Analytics" },
        { label: "AI Verification", val: "99.2% Score" }
      ],
      vectorTag: "PROJECT_SAFEBAND_AI_WEARABLE_LOGS"
    },
    resume: {
      title: "Subham_Kumar_Kewat_Resume_2026.pdf",
      issuer: "VSSUT Career Center Portal",
      entities: [
        { label: "Candidate", val: "Subham Kumar Kewat" },
        { label: "CGPA & Major", val: "8.92 / Production Engineering" },
        { label: "Target Path", val: "Full Stack AI Developer" },
        { label: "Extracted Stack", val: "Python, JavaScript, React, Next.js, Node.js" }
      ],
      vectorTag: "CANDIDATE_RESUME_SUBHAM_KEWAT"
    }
  };

  const handleSelectSample = (sample: 'internship' | 'aws' | 'resume') => {
    setIsProcessingDemo(true);
    setDemoActiveSample(sample);
    setTimeout(() => setIsProcessingDemo(false), 600);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 2500);
  };

  const faqs = [
    {
      q: "How does MemoryVerse AI extract entities from certificates and resumes?",
      a: "MemoryVerse AI uses optical character recognition (OCR) combined with transformer-based Named Entity Recognition (NER) models to automatically extract skills, project details, college dates, CGPA, issuer information, and metrics without any manual tagging."
    },
    {
      q: "What is the AI Relationship Engine (Knowledge Graph)?",
      a: "The Knowledge Graph dynamically links your extracted skills to your projects, internships, certifications, and target career paths. You can interactively explore how each learning milestone impacts your placement readiness."
    },
    {
      q: "Can I query my documents using natural language?",
      a: "Yes! Our built-in RAG (Retrieval-Augmented Generation) Chatbot indexes your documents as high-dimensional vector embeddings. You can ask queries like 'Show certificates related to Python' or 'Summarize my profile for Google AI'."
    },
    {
      q: "Is my personal academic and resume data private?",
      a: "Absolutely. All documents are encrypted in transit and at rest with strict user-permission controls, allowing you to export or delete your dataset at any time."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#080c14] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. HERO SECTION WITH ANIMATED BACKDROP PARTICLES GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-blue-650/10 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-purple-650/10 rounded-full blur-[160px] pointer-events-none" />

      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
        
        {/* Futuristic Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen Student Digital Identity System</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Hero Main Heading */}
        <h1 className="font-outfit text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15]">
          Your Digital Journey,{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent text-glow-cyan">
            Powered by AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-350 max-w-3xl mx-auto font-light leading-relaxed">
          MemoryVerse AI ingests, organizes, connects, and instantly retrieves all your academic papers, certificates, projects, and internships into an interactive Knowledge Graph & RAG Chatbot.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center justify-center space-x-3 group cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onUploadClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-slate-700 hover:border-cyan-500/50 text-slate-200 font-semibold text-base hover:bg-slate-800/80 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Upload className="w-5 h-5 text-cyan-400" />
            <span>Upload Documents</span>
          </button>

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white font-medium text-base transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-indigo-400" />
            <span>Try Interactive Demo</span>
          </button>
        </div>

        {/* Floating Quick Feature Tags */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Automated OCR Ingestion</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Interactive Knowledge Graph</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>RAG Career Assistant</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Placement Readiness Score</span>
          </span>
        </div>

      </section>

      {/* 2. INTERACTIVE EXTRACTION DEMO WIDGET */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="glass-panel border border-cyan-500/30 rounded-3xl p-6 sm:p-10 bg-[#0f172a]/80 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Live Ingest Sandbox
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-outfit mt-2 text-slate-100">
                See AI OCR & Entity Extraction in Real Time
              </h2>
            </div>

            {/* Sample Selector Tabs */}
            <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto whitespace-nowrap max-w-full font-mono">
              <button
                onClick={() => handleSelectSample('internship')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  demoActiveSample === 'internship'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                IIT Internship
              </button>
              <button
                onClick={() => handleSelectSample('aws')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  demoActiveSample === 'aws'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SafeBand AI
              </button>
              <button
                onClick={() => handleSelectSample('resume')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  demoActiveSample === 'resume'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Master Resume
              </button>
            </div>
          </div>

          {/* Sandbox Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Input File Card */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 text-slate-400 text-xs font-mono mb-4">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Simulated Document Input</span>
                </div>
                <h4 className="text-lg font-bold text-slate-200">
                  {demoSamples[demoActiveSample].title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Issued by: <span className="text-cyan-300 font-medium">{demoSamples[demoActiveSample].issuer}</span>
                </p>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400/90 leading-relaxed">
                {isProcessingDemo ? (
                  <div className="flex items-center space-x-2 py-4 text-cyan-400 animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Running Neural Network OCR & NER Parsing...</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-500">// Vector Embedding Code</span>
                    <br />
                    tag: "{demoSamples[demoActiveSample].vectorTag}"
                    <br />
                    status: "99.4% AI Verification Confidence"
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Extracted Output Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center space-x-2 font-mono">
                  <Brain className="w-4 h-4" />
                  <span>Structured Named Entities Output</span>
                </h4>

                <div className="space-y-3">
                  {demoSamples[demoActiveSample].entities.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">{item.label}</span>
                      <span className="font-bold text-slate-100">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between font-mono">
                <span className="text-[10px] text-slate-550">Node Connected to Knowledge Graph</span>
                <button
                  onClick={onTryDemo}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Explore Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CSS INTERACTIVE SYSTEM ARCHITECTURE DIAGRAM */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">System Topology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-100 mt-2">
            Interactive Architecture Diagram
          </h2>
          <p className="text-xs text-slate-450 mt-1 font-mono">Click on any core module node to inspect its functionality specs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Architecture visual nodes timeline */}
          <div className="lg:col-span-2 space-y-4 font-mono text-xs">
            
            {[
              { id: 'ocr', title: 'OCR Extraction Pipeline', subtitle: 'Hashed Ingestion', icon: Upload, desc: 'Converts multi-format raw binary files (PDFs, images) into a verified text stream using local Tesseract or cloud APIs.' },
              { id: 'ner', title: 'NER Extraction Classifier', subtitle: 'Taxonomy Matcher', icon: Brain, desc: 'Uses trained Named Entity Recognition to map academic tokens like PyTorch, CGPA, and SAIL into relational identity models.' },
              { id: 'vector', title: 'Vector Embeddings Cache', subtitle: 'RAG Index Storage', icon: Database, desc: 'Indexes extracted nodes into high-dimensional vector embeddings, allowing sub-second semantic search retrieval.' }
            ].map(node => {
              const isActive = activeArchNode === node.id;
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveArchNode(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-950/60 border-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-cyan-500/20' : 'bg-slate-900'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-slate-200 block">{node.title}</strong>
                      <span className="text-[10px] text-slate-500">{node.subtitle}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-cyan-400' : 'text-slate-650'}`} />
                </div>
              );
            })}

          </div>

          {/* Inspect Details panel */}
          <div className="p-6 rounded-3xl border border-slate-805 bg-slate-950/80 space-y-4 min-h-[220px] flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Module Specs</span>
              <h4 className="text-sm font-bold text-slate-100 font-outfit">
                {activeArchNode === 'ocr' ? 'OCR Extraction Pipeline' : activeArchNode === 'ner' ? 'NER Extraction Classifier' : 'Vector Embeddings Cache'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {activeArchNode === 'ocr' 
                  ? 'Ingests project sheets and transcripts, computing SHA256 verification hashes to protect credential integrity against modifications.'
                  : activeArchNode === 'ner'
                  ? 'Applies natural language pattern checks to classify raw text into structured categories (Skills, Internships, Projects, College) with confidence scores.'
                  : 'Tokens are processed through semantic models to enable conversational search responses in the ChatGPT career assistant.'
                }
              </p>
            </div>
            <span className="text-[9px] text-slate-600 font-mono">Node Sync status: 100% verified</span>
          </div>

        </div>
      </section>

      {/* 4. KEY FEATURES SHOWCASE */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Core Platform Capabilities</span>
          <h3 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-100 mt-2">
            Engineered for High-Achieving Students
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "AI Document Upload Center", desc: "Upload PDFs, DOCX, resumes, certificates, and portfolio links with automatic OCR and entity classification.", icon: Layers },
            { title: "Interactive Knowledge Graph", desc: "Explore visual connections between your skills, projects, internships, and target companies.", icon: GitFork },
            { title: "Digital Journey Timeline", desc: "An elegant vertical chronological record of your academic milestones from college admission to placement.", icon: Award },
            { title: "Semantic Vector Search", desc: "Search using natural queries like 'Show python certificates' or 'Find React projects' with sub-second retrieval.", icon: Zap },
            { title: "RAG AI Career Assistant", desc: "Get personalized career recommendations, resume feedback, and placement readiness estimations.", icon: MessageSquare },
            { title: "Career Analytics Dashboard", desc: "Track skill distribution, certification growth, and category counts with interactive charts.", icon: BarChart }
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all">
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-100 mb-3">{f.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CONTACT FORM SECTION */}
      <section className="py-20 px-6 max-w-xl mx-auto border-t border-slate-900">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Contact Desk</span>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">Get in Touch</h2>
          <p className="text-xs text-slate-450 mt-1 font-mono">Have suggestions? Drop us a line.</p>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-[10px] text-slate-550 uppercase block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Subham Kumar Kewat"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-550 uppercase block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="subham.kewat@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-550 uppercase block mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder="Write your message details..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{messageSent ? 'Message Dispatched!' : 'Send Message'}</span>
          </button>
        </form>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm mt-2">Everything you need to know about MemoryVerse AI</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel border border-slate-800 cursor-pointer transition-colors"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-base font-bold text-slate-200">
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-cyan-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {activeFaq === idx && (
                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3 font-sans">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-outfit font-bold text-slate-300">MemoryVerse AI</span>
            <span>— Intelligent Digital Identity System</span>
          </div>
          <p>© 2026 MemoryVerse AI. Built for International AI Hackathon Excellence.</p>
        </div>
      </footer>

    </div>
  );
};
