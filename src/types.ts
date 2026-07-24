export type DocumentCategory = 
  | 'Projects'
  | 'Skills'
  | 'Certifications'
  | 'Internships'
  | 'Academics'
  | 'Achievements'
  | 'Research'
  | 'Experience'
  | 'Resume'
  | 'Portfolio'
  | 'Other';

export interface ExtractedEntity {
  id: string;
  type: 'Skill' | 'Project' | 'Internship' | 'Certification' | 'College' | 'CGPA' | 'Achievement' | 'Company' | 'Date' | 'Role';
  value: string;
  confidence: number;
  metadata?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  fileType: 'pdf' | 'docx' | 'image' | 'link';
  fileSize?: string;
  uploadDate: string;
  confidenceScore: number;
  tags: string[];
  extractedEntities: ExtractedEntity[];
  rawText: string;
  summary: string;
  status: 'processed' | 'processing' | 'failed';
  externalUrl?: string;
  issuer?: string;
  dateCompleted?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'skill' | 'project' | 'internship' | 'certification' | 'career' | 'company';
  category: string;
  val: number; // size relative weight
  color?: string;
  x?: number;
  y?: number;
  description?: string;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  label?: string;
  strength?: number;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  category: DocumentCategory;
  date: string;
  organization: string;
  description: string;
  skills: string[];
  impactScore: number;
  badge?: string;
  documentId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: { title: string; category: string; id: string }[];
  suggestedPrompts?: string[];
  isThinking?: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  cgpa: string;
  graduationYear: string;
  targetRole: string;
  careerScore: number; // 0 - 100
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
  location: string;
  avatarUrl: string;
}

export interface AnalyticsSummary {
  totalDocuments: number;
  skillsExtracted: number;
  projectsCount: number;
  internshipsCount: number;
  certificationsCount: number;
  achievementsCount: number;
  careerReadiness: number;
  aiConfidenceAvg: number;
}
