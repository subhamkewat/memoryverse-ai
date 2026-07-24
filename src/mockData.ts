import { UserProfile, DocumentItem, KnowledgeNode, KnowledgeLink, TimelineMilestone, ChatMessage, AnalyticsSummary } from './types';

export const initialUserProfile: UserProfile = {
  name: "Subham Kumar Kewat",
  title: "Full Stack AI Developer | Production Engineering",
  email: "subham.kewat@vssut.ac.in",
  phone: "+91 94398 76543",
  college: "Veer Surendra Sai University of Technology (VSSUT), Burla, Odisha",
  degree: "B.Tech in Production Engineering",
  cgpa: "8.92 / 10.0",
  graduationYear: "2027",
  targetRole: "Full Stack AI Developer",
  careerScore: 92,
  bio: "Highly motivated Production Engineering student at VSSUT Burla with deep expertise in Full Stack AI Development. Skilled in Python, JavaScript, React, Next.js, Node.js, and databases. Builder of intelligent safety systems and predictive orchestration engines.",
  github: "github.com/subham-kewat",
  linkedin: "linkedin.com/in/subham-kumar-kewat",
  portfolio: "subham-kewat.dev",
  location: "Burla, Odisha, India",
  avatarUrl: "/profile.jpg"
};

export const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "IIT Bhilai Research Internship Completion Letter.pdf",
    category: "Internships",
    fileType: "pdf",
    fileSize: "1.2 MB",
    uploadDate: "2026-07-20",
    confidenceScore: 98,
    issuer: "IIT Bhilai Fluidics & Pattern Lab",
    dateCompleted: "2026-07-15",
    tags: ["Internship", "Research", "Pattern Analysis", "Python", "Fluid Rheology"],
    summary: "Research Internship project: 'Determining Experimental Correlation between Liquid Spreading on Paper & Fluid Rheological Behaviour through Pattern Analysis'. Used Python computer vision to correlate spreading behavior with fluid dynamics.",
    rawText: "CERTIFICATE OF RESEARCH INTERNSHIP. Awarded to Subham Kumar Kewat for completing a 2-month research project at IIT Bhilai. Project Title: Determining Experimental Correlation between Liquid Spreading on Paper & Fluid Rheological Behaviour through Pattern Analysis. Utilized Python, OpenCV, and statistical regression to analyze droplet spreads.",
    status: "processed",
    extractedEntities: [
      { id: "e1", type: "Company", value: "IIT Bhilai", confidence: 99 },
      { id: "e2", type: "Role", value: "Research Intern", confidence: 98 },
      { id: "e3", type: "Skill", value: "Python", confidence: 99 },
      { id: "e4", type: "Skill", value: "Pattern Analysis", confidence: 96 },
      { id: "e5", type: "Skill", value: "Fluid Dynamics", confidence: 95 },
      { id: "e6", type: "Date", value: "May - July 2026", confidence: 99 }
    ]
  },
  {
    id: "doc-2",
    title: "Hindalco Industrial Training Certificate.pdf",
    category: "Internships",
    fileType: "pdf",
    fileSize: "950 KB",
    uploadDate: "2025-12-20",
    confidenceScore: 97,
    issuer: "Hindalco Industries Limited",
    dateCompleted: "2025-12-15",
    tags: ["Industrial Training", "Hindalco", "Production Control", "Optimization"],
    summary: "Completed industrial internship studying machinery automation, production scheduling lines, and workflow efficiency optimizations at Hindalco plant.",
    rawText: "HINDALCO INDUSTRIES CERTIFICATE. This is to certify that Subham Kumar Kewat, student of VSSUT Burla, completed industrial training at Hindalco. Gained experience in manufacturing workflows, automation sensors, and production line optimization analytics.",
    status: "processed",
    extractedEntities: [
      { id: "e7", type: "Company", value: "Hindalco Industries", confidence: 100 },
      { id: "e8", type: "Skill", value: "Production Optimization", confidence: 95 },
      { id: "e9", type: "Skill", value: "Process Automation", confidence: 96 }
    ]
  },
  {
    id: "doc-3",
    title: "SAIL Internship Training Completion Report.pdf",
    category: "Internships",
    fileType: "pdf",
    fileSize: "1.1 MB",
    uploadDate: "2025-07-10",
    confidenceScore: 96,
    issuer: "Steel Authority of India Limited (SAIL)",
    dateCompleted: "2025-07-05",
    tags: ["SAIL", "Industrial Training", "Maintenance Diagnostics", "SQL"],
    summary: "Verified industrial training at SAIL steel plant. Researched diagnostic automation, machinery analytics, and inventory databases.",
    rawText: "STEEL AUTHORITY OF INDIA LIMITED. Vocational training completion. Subham Kumar Kewat underwent training in automation mechanics. Analyzed production line database tracking queries using SQL and automated failure forecasting models.",
    status: "processed",
    extractedEntities: [
      { id: "e10", type: "Company", value: "SAIL", confidence: 100 },
      { id: "e11", type: "Skill", value: "SQL", confidence: 98 },
      { id: "e12", type: "Skill", value: "Failure Forecasting", confidence: 95 }
    ]
  },
  {
    id: "doc-4",
    title: "SafeBand AI Wearable Project Report.docx",
    category: "Projects",
    fileType: "docx",
    fileSize: "2.4 MB",
    uploadDate: "2026-04-12",
    confidenceScore: 98,
    issuer: "Personal Project",
    dateCompleted: "2026-04-05",
    tags: ["Project", "SafeBand AI", "Safety Systems", "React", "Node.js"],
    summary: "Safety wearable IoT software platform featuring real-time biometric tracking, automated hazard alerts, and React Dashboard visualization.",
    rawText: "PROJECT REPORT: SAFEBAND AI. Developer: Subham Kumar Kewat. SafeBand AI is an intelligent safety platform connecting sensor bands with a web dashboard built using React, Node.js, Express, and MongoDB. Integrates hazard classification models.",
    status: "processed",
    extractedEntities: [
      { id: "e13", type: "Project", value: "SafeBand AI", confidence: 99 },
      { id: "e14", type: "Skill", value: "React", confidence: 98 },
      { id: "e15", type: "Skill", value: "Node.js", confidence: 97 },
      { id: "e16", type: "Skill", value: "MongoDB", confidence: 98 }
    ]
  },
  {
    id: "doc-5",
    title: "Queue Cure Healthcare Orchestrator.pdf",
    category: "Projects",
    fileType: "pdf",
    fileSize: "1.8 MB",
    uploadDate: "2026-02-18",
    confidenceScore: 96,
    issuer: "VSSUT Hackathon Entry",
    dateCompleted: "2026-02-15",
    tags: ["Project", "Queue Cure", "Next.js", "Express.js", "MongoDB"],
    summary: "Smart healthcare patient flow optimizer utilizing predictive algorithms to reduce clinic queue delay by 42%.",
    rawText: "QUEUE CURE ORCHESTRATION ENGINE. Authors: Subham Kumar Kewat et al. Built with Next.js, Express, Node.js, and MongoDB. Solves waiting time delays using predictive queues and live patient tracking panels.",
    status: "processed",
    extractedEntities: [
      { id: "e17", type: "Project", value: "Queue Cure", confidence: 98 },
      { id: "e18", type: "Skill", value: "Next.js", confidence: 99 },
      { id: "e19", type: "Skill", value: "Express.js", confidence: 96 }
    ]
  },
  {
    id: "doc-6",
    title: "MemoryVerse AI Identity Engine Spec.docx",
    category: "Projects",
    fileType: "docx",
    fileSize: "3.1 MB",
    uploadDate: "2026-07-02",
    confidenceScore: 99,
    issuer: "Personal Project Portfolio",
    dateCompleted: "2026-07-01",
    tags: ["Project", "MemoryVerse AI", "Full Stack AI", "React", "Next.js", "Python"],
    summary: "Design specifications of an AI-powered student digital identity mapping engine featuring OCR text parsing and interactive knowledge graphing.",
    rawText: "MEMORYVERSE AI SPECIFICATIONS. Core developers: Subham Kumar Kewat. Tech Stack: React, Next.js, Node.js, Python, and SQLite. Features automated document text classification and relationship graphs.",
    status: "processed",
    extractedEntities: [
      { id: "e20", type: "Project", value: "MemoryVerse AI", confidence: 99 },
      { id: "e21", type: "Skill", value: "React & Next.js", confidence: 98 },
      { id: "e22", type: "Skill", value: "Python", confidence: 97 }
    ]
  },
  {
    id: "doc-7",
    title: "Subham_Kumar_Kewat_Resume_2026.pdf",
    category: "Resume",
    fileType: "pdf",
    fileSize: "380 KB",
    uploadDate: "2026-07-21",
    confidenceScore: 100,
    issuer: "VSSUT Career Portal",
    dateCompleted: "2026-07-21",
    tags: ["Resume", "Subham Kumar Kewat", "VSSUT", "Production Engineering"],
    summary: "Full verified resume listing all industrial internships (SAIL, Hindalco, IIT Bhilai research) and SDE projects (SafeBand AI, Queue Cure, MemoryVerse AI).",
    rawText: "SUBHAM KUMAR KEWAT. Production Engineering Undergrad at VSSUT Burla. SKILLS: Python, JavaScript, React, Next.js, Node.js, Express.js, MongoDB, SQL, Git, GitHub. EXPERIENCE: IIT Bhilai Research Intern, Hindalco Trainee, SAIL Trainee.",
    status: "processed",
    extractedEntities: [
      { id: "e23", type: "College", value: "VSSUT Burla", confidence: 100 },
      { id: "e24", type: "Skill", value: "JavaScript", confidence: 99 },
      { id: "e25", type: "Skill", value: "Git & GitHub", confidence: 98 }
    ]
  }
];

export const initialKnowledgeNodes: KnowledgeNode[] = [
  // Skills
  { id: "skill-python", label: "Python", type: "skill", category: "AI & ML", val: 32, color: "#38bdf8", description: "Primary programming language for research analysis and machine learning scripts." },
  { id: "skill-javascript", label: "JavaScript", type: "skill", category: "Web Tech", val: 28, color: "#f59e0b", description: "Core frontend script language for interactive React dashboards." },
  { id: "skill-react", label: "React / Next.js", type: "skill", category: "Frontend", val: 30, color: "#34d399", description: "Building reusable UI components and dynamic server-side web layouts." },
  { id: "skill-node", label: "Node & Express", type: "skill", category: "Backend", val: 26, color: "#c084fc", description: "Asynchronous server management, route APIs, and middleware logic." },
  { id: "skill-mongodb", label: "MongoDB", type: "skill", category: "Database", val: 24, color: "#fbbf24", description: "NoSQL document storage for patient queues and device biometric data." },
  { id: "skill-sql", label: "SQL", type: "skill", category: "Database", val: 22, color: "#f472b6", description: "Relational database querying for industrial training asset logs." },

  // Projects
  { id: "proj-safeband", label: "SafeBand AI", type: "project", category: "AI Wearable", val: 32, color: "#3b82f6", description: "Real-time wearable sensor analytics for industrial environment safety." },
  { id: "proj-queue-cure", label: "Queue Cure", type: "project", category: "Healthcare", val: 28, color: "#10b981", description: "Predictive clinic queue flow optimizer built on Node & Next.js." },
  { id: "proj-memoryverse", label: "MemoryVerse AI", type: "project", category: "AI Platform", val: 34, color: "#06b6d4", description: "Digital Identity & Personal Knowledge Management Engine." },

  // Internships
  { id: "exp-iit-intern", label: "IIT Bhilai Research Intern", type: "internship", category: "Research", val: 28, color: "#818cf8", description: "Determined correlation between liquid spreads and fluid rheological behavior." },
  { id: "exp-hindalco", label: "Hindalco Industrial Trainee", type: "internship", category: "Industry", val: 24, color: "#e879f9", description: "Analyzed machinery diagnostics and automation lines." },
  { id: "exp-sail", label: "SAIL Vocational Trainee", type: "internship", category: "Industry", val: 22, color: "#60a5fa", description: "Vocational training tracking supply chain logistics databases." },

  // Target Career Paths
  { id: "career-ai-dev", label: "Full Stack AI Developer", type: "career", category: "Target Role", val: 38, color: "#f43f5e", description: "Target profession building server backends and predictive deep models." }
];

export const initialKnowledgeLinks: KnowledgeLink[] = [
  // Skill -> Project
  { source: "skill-python", target: "exp-iit-intern", label: "Pattern Code", strength: 0.9 },
  { source: "skill-javascript", target: "proj-safeband", label: "Frontend", strength: 0.8 },
  { source: "skill-react", target: "proj-safeband", label: "Dashboard", strength: 0.9 },
  { source: "skill-node", target: "proj-safeband", label: "Backend API", strength: 0.85 },
  { source: "skill-mongodb", target: "proj-safeband", label: "Store", strength: 0.8 },
  
  { source: "skill-react", target: "proj-queue-cure", label: "UI View", strength: 0.9 },
  { source: "skill-node", target: "proj-queue-cure", label: "APIs", strength: 0.88 },
  { source: "skill-mongodb", target: "proj-queue-cure", label: "Queue Store", strength: 0.8 },
  
  { source: "skill-react", target: "proj-memoryverse", label: "UI View", strength: 0.9 },
  { source: "skill-python", target: "proj-memoryverse", label: "OCR Parsing", strength: 0.85 },

  // Internship -> Career Path
  { source: "exp-iit-intern", target: "career-ai-dev", label: "Research Proof", strength: 0.95 },
  { source: "proj-safeband", target: "career-ai-dev", label: "Flagship Proof", strength: 0.9 },
  { source: "proj-queue-cure", target: "career-ai-dev", label: "SDE Proof", strength: 0.85 },
  { source: "proj-memoryverse", target: "career-ai-dev", label: "SDE Proof", strength: 0.95 }
];

export const initialTimelineMilestones: TimelineMilestone[] = [
  {
    id: "m-1",
    title: "Enrolled in VSSUT Burla (Production Engineering)",
    category: "Academics",
    date: "August 2023",
    organization: "VSSUT Burla",
    description: "Started undergraduate studies in Production Engineering. Balanced engineering fundamentals with learning software programming.",
    skills: ["SQL", "HTML", "CSS", "Git"],
    impactScore: 88,
    badge: "Undergrad Enrollment"
  },
  {
    id: "m-2",
    title: "Vocational Industrial Training at SAIL",
    category: "Internships",
    date: "July 2025",
    organization: "Steel Authority of India Limited",
    description: "Studied plant maintenance operations, diagnostic systems, and querying database schedules with SQL.",
    skills: ["SQL", "Logistics Operations", "Git"],
    impactScore: 90,
    badge: "Industry Exposure",
    documentId: "doc-3"
  },
  {
    id: "m-3",
    title: "Industrial Training at Hindalco Industries",
    category: "Internships",
    date: "December 2025",
    organization: "Hindalco Industries Limited",
    description: "Studied automation lines, process diagnostics, and production queue efficiency optimization pipelines.",
    skills: ["Process Control", "Automation", "Workflow Optimization"],
    impactScore: 91,
    badge: "Industrial Internship",
    documentId: "doc-2"
  },
  {
    id: "m-4",
    title: "Launched Queue Cure Healthcare Orchestrator",
    category: "Projects",
    date: "February 2026",
    organization: "VSSUT Hackathon Portfolio",
    description: "Engineered smart patient routing queues built on React, Express.js, and MongoDB. Optimized hospital waiting delay metrics.",
    skills: ["Next.js", "Express.js", "Node.js", "MongoDB"],
    impactScore: 93,
    badge: "Hackathon Entry",
    documentId: "doc-5"
  },
  {
    id: "m-5",
    title: "Completed SafeBand AI Wearable Platform",
    category: "Projects",
    date: "April 2026",
    organization: "Personal Safety Innovation",
    description: "Created dashboard software monitoring wearable sensor biometric telemetry feeds to predict industrial ambient hazards.",
    skills: ["React", "Node.js", "Express.js", "MongoDB"],
    impactScore: 94,
    badge: "IoT Project Success",
    documentId: "doc-4"
  },
  {
    id: "m-6",
    title: "IIT Bhilai Fluidics Research Internship",
    category: "Internships",
    date: "May - July 2026",
    organization: "IIT Bhilai Fluidics Lab",
    description: "Conducted research on 'Determining Experimental Correlation between Liquid Spreading on Paper & Fluid Rheological Behaviour through Pattern Analysis' using Python.",
    skills: ["Python", "Pattern Analysis", "Fluid Rheology", "Research Methods"],
    impactScore: 98,
    badge: "Research Fellowship",
    documentId: "doc-1"
  },
  {
    id: "m-7",
    title: "Launched MemoryVerse AI Digital Identity Platform",
    category: "Projects",
    date: "July 2026",
    organization: "Flagship Software Portfolio",
    description: "Created advanced student digital identity records management dashboard with interactive graphs, OCR inputs, and RAG chat assistants.",
    skills: ["React", "Next.js", "Node.js", "Python", "GitHub"],
    impactScore: 99,
    badge: "Software Milestone",
    documentId: "doc-6"
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: "c-1",
    sender: "ai",
    text: "Hello **Subham**! 👋 I am your **MemoryVerse AI Career Assistant**. I have analyzed all your uploaded documents, including your **IIT Bhilai Fluidics Research Letter**, **SAIL & Hindalco Internship Credentials**, **SafeBand AI Wearable Project**, and **Queue Cure Engine**.\n\nHow can I help you optimize your Full Stack AI career roadmap today?",
    timestamp: "09:00 AM",
    citations: [
      { title: "IIT Bhilai Research Internship Completion Letter.pdf", category: "Internships", id: "doc-1" },
      { title: "Subham_Kumar_Kewat_Resume_2026.pdf", category: "Resume", id: "doc-7" }
    ],
    suggestedPrompts: [
      "Summarize my research project on liquid spreading",
      "Which skills should I focus on for Full Stack AI Developer?",
      "List details of Hindalco and SAIL industrial training",
      "What core technologies are used in SafeBand AI?"
    ]
  }
];

export const initialAnalyticsSummary: AnalyticsSummary = {
  totalDocuments: 7,
  skillsExtracted: 12,
  projectsCount: 3,
  internshipsCount: 3,
  certificationsCount: 0,
  achievementsCount: 3,
  careerReadiness: 92,
  aiConfidenceAvg: 98.2
};
