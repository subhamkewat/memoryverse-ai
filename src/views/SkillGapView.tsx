import React, { useState, useEffect } from 'react';
import { DocumentItem, UserProfile } from '../types';
import { motion } from 'framer-motion';
import {
  Code,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Layers,
  Flag,
  ArrowUpRight,
  Play,
  BookMarked,
  FileCode,
  Activity,
  Award as Medal
} from 'lucide-react';

interface CareerTargetTemplate {
  title: string;
  requiredSkills: string[];
  learningTime: string;
  priority: 'High' | 'Medium' | 'Low';
  courses: string[];
  projects: Array<{ title: string; desc: string }>;
  weeklyRoadmap: string[];
  resources: {
    documentation: string[];
    youtube: string[];
    practiceProject: string;
  };
}

export const SkillGapView: React.FC = () => {
  // Read state from localStorage to execute comparison audit dynamically
  const user: UserProfile = (() => {
    const saved = localStorage.getItem('mv_user');
    return saved ? JSON.parse(saved) : { name: 'Subham Kumar Kewat', targetRole: 'Full Stack AI Developer', college: 'VSSUT Burla', degree: 'Production Engineering', cgpa: '8.92' };
  })();

  const skills: string[] = (() => {
    const saved = localStorage.getItem('mv_skills');
    return saved ? JSON.parse(saved) : [];
  })();

  // Selected Career Target
  const [selectedTarget, setSelectedTarget] = useState<string>('Full Stack AI Developer');

  // Weekly Checklist completed state persistent loader
  const [checkedWeeks, setCheckedWeeks] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('mv_skillgap_weeks');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleWeekCheck = (weekKey: string) => {
    const updated = { ...checkedWeeks, [weekKey]: !checkedWeeks[weekKey] };
    setCheckedWeeks(updated);
    localStorage.setItem('mv_skillgap_weeks', JSON.stringify(updated));
  };

  // Career Target Templates Dataset
  const careerTargets: { [key: string]: CareerTargetTemplate } = {
    'Full Stack AI Developer': {
      title: 'Full Stack AI Developer',
      requiredSkills: ['Python', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Git', 'GitHub', 'PyTorch', 'Docker', 'FastAPI'],
      learningTime: '10 Weeks',
      priority: 'High',
      courses: [
        'Deep Learning Specialization (DeepLearning.AI - Coursera)',
        'Next.js 14 Developer Masterclass (Academind - Udemy)',
        'Docker & Kubernetes Complete Guide (Stephen Grider - Udemy)'
      ],
      projects: [
        { title: 'Vector DB Search Engine', desc: 'Deploy an automated RAG document analyzer matching text semantic nodes using FastAPI and Redis.' },
        { title: 'Serverless Inference Pipeline', desc: 'Host a PyTorch classification model on AWS Lambda triggered by Node.js webhooks.' }
      ],
      weeklyRoadmap: [
        'Week 1: Core Neural Networks with PyTorch & Model Optimization',
        'Week 2: Advanced FastAPI backend integrations with CORS policies',
        'Week 3: Containerizing Next.js frontend and Node server with multi-stage Docker builds',
        'Week 4: Deploying state logs and vector database indexes in production clusters'
      ],
      resources: {
        documentation: ['Next.js App Router Specs (nextjs.org/docs)', 'PyTorch Model Optimization APIs (pytorch.org/docs)'],
        youtube: ['FastAPI Crash Course (freeCodeCamp)', 'DeepLearning.AI RAG engineering guidelines'],
        practiceProject: 'Build a multi-tenant document indexing RAG chatbot dashboard using FastAPI and Pinecone.'
      }
    },
    'Full Stack Developer': {
      title: 'Full Stack Developer',
      requiredSkills: ['JavaScript', 'HTML', 'CSS', 'React', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Git', 'GitHub', 'Docker', 'CI/CD Pipelines', 'TypeScript'],
      learningTime: '8 Weeks',
      priority: 'Medium',
      courses: [
        'Meta Full-Stack Developer Professional Certificate (Coursera)',
        'TypeScript Complete Course (Udemy)',
        'DevOps CI/CD Masterclass (Coursera)'
      ],
      projects: [
        { title: 'Microservices E-Commerce', desc: 'Create a multi-service SaaS app using Docker Compose, RabbitMQ messaging, and Postgres DB.' },
        { title: 'Type-Safe CRM Panel', desc: 'Build an admin analytics panel using React Query, Tailwind CSS, and Node/TypeScript APIs.' }
      ],
      weeklyRoadmap: [
        'Week 1: Clean TypeScript schema structures and React state optimizations',
        'Week 2: Backend microservices decoupling and RESTful api routing constraints',
        'Week 3: Containerization with Docker and local networks orchestration',
        'Week 4: Automated unit tests configurations and GitHub Actions CI/CD deployment flow'
      ],
      resources: {
        documentation: ['React Query guides (tanstack.com/query)', 'TypeScript HandBook Reference (typescriptlang.org/docs)'],
        youtube: ['TypeScript for beginners (Programming with Mosh)', 'Docker Compose guides for microservices (TechWorld with Nana)'],
        practiceProject: 'Develop a type-safe task scheduler board syncing items using WebSockets and a PostgreSQL database.'
      }
    },
    'Data Scientist / ML Engineer': {
      title: 'Data Scientist / ML Engineer',
      requiredSkills: ['Python', 'SQL', 'Git', 'GitHub', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas / NumPy', 'AWS Vertex AI', 'MLOps', 'FastAPI'],
      learningTime: '12 Weeks',
      priority: 'High',
      courses: [
        'Machine Learning Zoomcamp (DataTalks.Club - Free)',
        'MLOps Engineering Specialization (Duke University - Coursera)',
        'Advanced SQL for Data Analytics (Udemy)'
      ],
      projects: [
        { title: 'Production Droplet Model', desc: 'Convert the IIT Bhilai fluid rheology droplet spreading scripts into a production API hosted on AWS Vertex AI.' },
        { title: 'Biometric Hazard Forecast Engine', desc: 'Predict factory biometric stress indicators using pandas analysis and scikit-learn random forests.' }
      ],
      weeklyRoadmap: [
        'Week 1: Mathematical modeling, NumPy arrays data sanitation, and SciPy optimization',
        'Week 2: Training Convolutional Neural Networks and Transformers using PyTorch',
        'Week 3: Setting up MLflow tracking metrics and training pipeline automation',
        'Week 4: Containerizing training models with FastAPI and deploying to AWS Vertex AI'
      ],
      resources: {
        documentation: ['Scikit-Learn estimators reference (scikit-learn.org)', 'MLflow model pipelines logs (mlflow.org)'],
        youtube: ['Machine Learning Zoomcamp video logs (Alexey Grigorev)', 'MLOps deployment tutorials (freeCodeCamp)'],
        practiceProject: 'Deploy a drift detection scheduler pipeline running scikit-learn models classifying tabular sensor feeds.'
      }
    },
    'DevOps Engineer': {
      title: 'DevOps Engineer',
      requiredSkills: ['Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS Vertex AI', 'CI/CD Pipelines', 'Linux Shell scripting', 'Terraform', 'Prometheus / Grafana', 'SQL'],
      learningTime: '12 Weeks',
      priority: 'Medium',
      courses: [
        'Kubernetes Certified Administrator (CKA) Training (KodeKloud)',
        'Terraform Associate Certification course (Udemy)',
        'Monitoring with Prometheus & Grafana (Pluralsight)'
      ],
      projects: [
        { title: 'Multi-Cluster Deployments', desc: 'Orchestrate a local Kubernetes cluster hosting a Node.js server and MongoDB state storage with telemetry monitoring.' },
        { title: 'Infrastructure as Code repo', desc: 'Provision AWS security parameters, VPC networking, and database instances using Terraform scripts.' }
      ],
      weeklyRoadmap: [
        'Week 1: Linux system admin controls, bash automation scripting, and SSH configurations',
        'Week 2: Multi-stage Docker builds and image size optimization practices',
        'Week 3: Kubernetes pods deployments, services networking, and persistent storage bounds',
        'Week 4: Terraform provisioning automation and Grafana alerts dashboards setup'
      ],
      resources: {
        documentation: ['Kubernetes networking specifications (kubernetes.io)', 'Terraform syntax guidelines (developer.hashicorp.com)'],
        youtube: ['Kubernetes Complete CKA syllabus tutorial (KodeKloud)', 'Terraform crash course videos (freeCodeCamp)'],
        practiceProject: 'Provision a containerized application monitoring stack running Prometheus/Grafana inside a local Minikube cluster.'
      }
    }
  };

  const target = careerTargets[selectedTarget];

  const currentMatched = target.requiredSkills.filter(s =>
    skills.map(c => c.toLowerCase()).includes(s.toLowerCase())
  );
  
  const missing = target.requiredSkills.filter(s =>
    !skills.map(c => c.toLowerCase()).includes(s.toLowerCase())
  );

  // Hour estimator helper
  const getEstHours = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name === 'python' || name === 'javascript') return 12;
    if (name === 'react' || name === 'next.js') return 20;
    if (name === 'pytorch' || name === 'tensorflow') return 35;
    if (name === 'docker' || name === 'kubernetes') return 25;
    if (name === 'system design') return 30;
    return 15; // default fallback
  };

  // Skill difficulty & prerequisites helper
  const getSkillMeta = (skillName: string) => {
    const name = skillName.toLowerCase();
    let difficulty = 'Medium';
    let prerequisites = 'None';
    
    if (['python', 'javascript', 'html', 'css', 'git', 'github'].includes(name)) {
      difficulty = 'Easy';
      prerequisites = 'Basic computer literacy';
    } else if (['react', 'next.js', 'node.js', 'express.js', 'sql', 'mongodb', 'fastapi'].includes(name)) {
      difficulty = 'Medium';
      prerequisites = 'Programming fundamentals';
    } else if (['pytorch', 'tensorflow', 'docker', 'kubernetes', 'system design', 'mlops'].includes(name)) {
      difficulty = 'Hard';
      prerequisites = 'Backend databases, Advanced Python/C++';
    }
    
    return { difficulty, prerequisites };
  };

  // Typewriter/ASCII progress bar helper
  const renderProgressBar = (percent: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((percent / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    
    return (
      <span className="font-mono text-cyan-400 font-bold tracking-wider">
        {'█'.repeat(filledBlocks)}
        {'░'.repeat(emptyBlocks)}
      </span>
    );
  };

  // Learning order: prioritise missing skills
  const getLearningOrder = (missingSkills: string[]) => {
    const languages = ['python', 'javascript', 'typescript', 'c++'];
    const backend = ['node.js', 'express.js', 'mongodb', 'sql', 'fastapi'];
    
    return [...missingSkills].sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aIdx = languages.includes(aLower) ? 0 : backend.includes(aLower) ? 1 : 2;
      const bIdx = languages.includes(bLower) ? 0 : backend.includes(bLower) ? 1 : 2;
      return aIdx - bIdx;
    });
  };

  const learningOrder = getLearningOrder(missing);
  const gapPercentage = Math.round((currentMatched.length / target.requiredSkills.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-12 max-w-5xl mx-auto"
    >
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              CURRICULUM GAP ANALYZER
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            AI Skill Gap Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Map your verified profile against industry-standard engineering roles, highlighting missing skills and weekly roadmaps.
          </p>
        </div>

        {/* Target Career Goal Selector */}
        <div className="flex items-center space-x-2.5">
          <span className="text-xs text-slate-400 font-mono">Career Target:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
          >
            {Object.keys(careerTargets).map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CORE EVALUATION GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-2">
          <span className="text-[10px] text-slate-500 block uppercase">Curriculum Compatibility</span>
          <div className="text-2xl font-extrabold text-cyan-400">{gapPercentage}% Matched</div>
          <p className="text-[10px] text-slate-500">{currentMatched.length} out of {target.requiredSkills.length} skills</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-2">
          <span className="text-[10px] text-slate-500 block uppercase">Est. Learning Time</span>
          <div className="text-2xl font-extrabold text-indigo-400">{target.learningTime}</div>
          <p className="text-[10px] text-slate-500">Based on missing competencies</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-2">
          <span className="text-[10px] text-slate-500 block uppercase">Action Priority Level</span>
          <div className="text-2xl font-extrabold text-amber-400">{target.priority}</div>
          <p className="text-[10px] text-slate-500">Recommended schedule density</p>
        </div>
      </div>

      {/* COMPREHENSIVE SKILL PROGRESS PERCENTAGE GRID WITH ASCII PROGRESS BARS */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Detailed Competency Target Progress</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {target.requiredSkills.map(s => {
            const hasSkill = skills.map(c => c.toLowerCase()).includes(s.toLowerCase());
            const percent = hasSkill ? 100 : 20;
            const meta = getSkillMeta(s);

            return (
              <div key={s} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-200 block">{s}</span>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded font-mono ${
                      meta.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' :
                      meta.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>{meta.difficulty}</span>
                    <span>Pre: {meta.prerequisites}</span>
                  </div>
                </div>
                <div className="text-right space-y-1 font-mono">
                  <div className="text-slate-400 text-[10px]">{renderProgressBar(percent)}</div>
                  <span className={`font-bold block text-[10px] ${hasSkill ? 'text-emerald-400' : 'text-slate-550'}`}>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED SKILLS & LEARNING ORDER PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Skills matching & missing list */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-5 shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Competency Mapping</h3>

          <div className="space-y-4">
            
            {/* Matches list */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2 font-mono">Verified Matched Skills ({currentMatched.length})</span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {currentMatched.map(s => (
                  <span key={s} className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s} (100%)
                  </span>
                ))}
                {currentMatched.length === 0 && <span className="text-xs text-slate-500 italic">None matched yet</span>}
              </div>
            </div>

            {/* Missing list */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2 font-mono">Missing Skills Gaps ({missing.length})</span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {missing.map(s => (
                  <span key={s} className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    {s} ({getEstHours(s)}h)
                  </span>
                ))}
                {missing.length === 0 && <span className="text-xs text-emerald-400 italic font-mono">Complete match! You are ready to apply.</span>}
              </div>
            </div>

          </div>
        </div>

        {/* Right Card: Dynamic Learning Order schedule */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Optimal Acquisition Order & Hours</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light">
            AI sequenced sequence of missing technologies designed to satisfy language requirements before framework configurations.
          </p>

          <div className="space-y-2.5 pt-2">
            {learningOrder.map((s, idx) => (
              <div key={s} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center font-bold text-[9px] text-cyan-400">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-semibold">{s}</span>
                </div>
                <span className="text-[10px] text-slate-500">Est: {getEstHours(s)} Hours</span>
              </div>
            ))}
            {learningOrder.length === 0 && (
              <div className="text-xs text-emerald-400 flex items-center space-x-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Competency stack fully optimized.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ROADMAPS & COURSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Roadmap Checkboxes Tracker */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Weekly Progress Tracker</span>
          </h3>

          <div className="space-y-3 pt-2">
            {target.weeklyRoadmap.map((week, idx) => {
              const weekKey = `${selectedTarget}-week-${idx}`;
              const isChecked = !!checkedWeeks[weekKey];

              return (
                <div
                  key={idx}
                  onClick={() => toggleWeekCheck(weekKey)}
                  className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through'
                      : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                    isChecked ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-800 bg-slate-900'
                  }`}>
                    {isChecked ? '✓' : ''}
                  </span>
                  <p>{week}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Courses & Pinned Projects */}
        <div className="space-y-6 font-mono">
          
          {/* Courses */}
          <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/70 space-y-3.5 shadow-md">
            <span className="text-[10px] text-slate-500 block uppercase">Recommended Resource Courses</span>
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              {target.courses.map((course, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="p-5 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/70 space-y-3.5 shadow-md">
            <span className="text-[10px] text-slate-500 block uppercase">Target Capstone Projects</span>
            <div className="space-y-3 text-xs">
              {target.projects.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <strong className="text-slate-200 block text-[11px]">{p.title}</strong>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* LEARNING RESOURCES SECTION */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold text-slate-250 uppercase tracking-wider font-mono flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Curated Learning Resources</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold block uppercase flex items-center space-x-1"><BookMarked className="w-3.5 h-3.5 text-cyan-400" /> <span>Documentation</span></span>
            <ul className="space-y-1 text-[11px] text-slate-350">
              {target.resources.documentation.map((doc, idx) => (
                <li key={idx}>• {doc}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold block uppercase flex items-center space-x-1"><Play className="w-3.5 h-3.5 text-red-400" /> <span>YouTube</span></span>
            <ul className="space-y-1 text-[11px] text-slate-350">
              {target.resources.youtube.map((yt, idx) => (
                <li key={idx}>• {yt}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold block uppercase flex items-center space-x-1"><FileCode className="w-3.5 h-3.5 text-indigo-400" /> <span>Practice Project</span></span>
            <p className="text-[11px] text-slate-350 leading-relaxed">
              {target.resources.practiceProject}
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
};
