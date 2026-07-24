import React, { useState } from 'react';
import { DocumentItem, DocumentCategory } from '../types';
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  Calendar,
  Award,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Plus,
  Clock,
  Layers,
  History
} from 'lucide-react';

interface VaultViewProps {
  documents: DocumentItem[];
  onOpenDocModal: (doc: DocumentItem) => void;
  onNavigateUpload: () => void;
  onUpdateDocument?: (updated: DocumentItem) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  documents: initialDocs,
  onOpenDocModal,
  onNavigateUpload,
  onUpdateDocument
}) => {
  // Sync documents list with local storage to support local edits
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('mv_documents');
    return saved ? JSON.parse(saved) : initialDocs;
  });

  const updateVaultState = (updatedList: DocumentItem[]) => {
    setDocuments(updatedList);
    localStorage.setItem('mv_documents', JSON.stringify(updatedList));
  };

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Advanced Filters
  const [filterConfidence, setFilterConfidence] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');

  // Preview States
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [newTagInput, setNewTagInput] = useState<string>('');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Documents' },
    { id: 'Projects', label: 'Projects' },
    { id: 'Skills', label: 'Skills' },
    { id: 'Certifications', label: 'Certifications' },
    { id: 'Internships', label: 'Internships' },
    { id: 'Academics', label: 'Academics' },
    { id: 'Achievements', label: 'Achievements' },
    { id: 'Research', label: 'Research' },
    { id: 'Experience', label: 'Experience' },
    { id: 'Resume', label: 'Resume' },
    { id: 'Portfolio', label: 'Portfolio' }
  ];

  // Helper check for duplicates
  const detectDuplicate = (doc: DocumentItem) => {
    return documents.some(
      (d) => d.id !== doc.id && d.title.toLowerCase().trim() === doc.title.toLowerCase().trim()
    );
  };

  // Filter documents dynamically
  const filteredDocs = documents.filter((doc) => {
    // Category match
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;

    // Search inside title, summary, tags, and rawText
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.extractedEntities.some((e) => e.value.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tag filter match
    const matchesTag = !selectedTagFilter || doc.tags.includes(selectedTagFilter);

    // Advanced filters: Confidence match
    let matchesConfidence = true;
    if (filterConfidence === 'high') matchesConfidence = doc.confidenceScore >= 90;
    else if (filterConfidence === 'mid') matchesConfidence = doc.confidenceScore >= 70 && doc.confidenceScore < 90;
    else if (filterConfidence === 'low') matchesConfidence = doc.confidenceScore < 70;

    // Advanced filters: Date range
    let matchesDate = true;
    if (filterDateRange === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesDate = new Date(doc.uploadDate) >= thirtyDaysAgo;
    } else if (filterDateRange === '6months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      matchesDate = new Date(doc.uploadDate) >= sixMonthsAgo;
    }

    // Advanced filters: Size
    let matchesSize = true;
    const isBig = doc.fileSize && (doc.fileSize.includes('MB') || parseFloat(doc.fileSize) > 800);
    if (filterSize === 'large') matchesSize = !!isBig;
    else if (filterSize === 'small') matchesSize = !isBig;

    return matchesCat && matchesSearch && matchesTag && matchesConfidence && matchesDate && matchesSize;
  });

  // Manual Tag Editing Handler
  const handleAddTag = (docId: string) => {
    if (!newTagInput.trim()) return;
    const updated = documents.map(d => {
      if (d.id === docId && !d.tags.includes(newTagInput.trim())) {
        return { ...d, tags: [...d.tags, newTagInput.trim()] };
      }
      return d;
    });
    updateVaultState(updated);
    if (onUpdateDocument) {
      const target = updated.find(d => d.id === docId);
      if (target) onUpdateDocument(target);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (docId: string, tagToRemove: string) => {
    const updated = documents.map(d => {
      if (d.id === docId) {
        return { ...d, tags: d.tags.filter(t => t !== tagToRemove) };
      }
      return d;
    });
    updateVaultState(updated);
    if (onUpdateDocument) {
      const target = updated.find(d => d.id === docId);
      if (target) onUpdateDocument(target);
    }
  };

  // Find related documents based on shared tags or categories
  const getRelatedDocs = (doc: DocumentItem) => {
    return documents.filter(
      (d) => d.id !== doc.id && (d.category === doc.category || d.tags.some(t => doc.tags.includes(t)))
    ).slice(0, 3);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              DIGITAL IDENTITY VAULT
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Categorized Knowledge Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organized records of all academic papers, projects, certificates, transcripts, and verified achievements.
          </p>
        </div>

        <button
          onClick={onNavigateUpload}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-[#0f172a]/95 space-y-4">
        
        {/* Search & Mode Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, details, tags or inside raw texts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            {selectedTagFilter && (
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 flex items-center space-x-1"
              >
                <span>Tag: #{selectedTagFilter}</span>
                <span className="font-bold">×</span>
              </button>
            )}

            <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Better Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-900 text-xs font-mono">
          <div>
            <label className="text-[9px] text-slate-500 uppercase block mb-1">OCR Confidence Filter</label>
            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Confidence Scores</option>
              <option value="high">High Verification (90%+)</option>
              <option value="mid">Medium Verification (70% - 90%)</option>
              <option value="low">Low Verification (&lt; 70%)</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] text-slate-500 uppercase block mb-1">Ingestion Date Range</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Time Ingests</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] text-slate-500 uppercase block mb-1">Document File Size</label>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All File Sizes</option>
              <option value="large">Large documents (&gt; 1 MB)</option>
              <option value="small">Small documents (&lt; 1 MB)</option>
            </select>
          </div>
        </div>

      </div>

      {/* CATEGORY TABS SCROLLABLE */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const count = cat.id === 'All' 
            ? documents.length 
            : documents.filter(d => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                selectedCategory === cat.id ? 'bg-slate-950/40 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* DOCUMENT GRID OR TABLE VIEW */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-300">No matching documents found</h4>
          <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const isDuplicate = detectDuplicate(doc);
            const isPreviewOpen = previewDocId === doc.id;
            const related = getRelatedDocs(doc);

            return (
              <div
                key={doc.id}
                className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                
                {/* Duplicate Notification warning */}
                {isDuplicate && (
                  <div className="absolute top-0 left-0 right-0 py-1 bg-amber-500/20 border-b border-amber-500/30 text-center flex items-center justify-center space-x-1.5 z-10 text-[9px] font-mono text-amber-300 uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Potential Duplicate Detected</span>
                  </div>
                )}

                <div className={isDuplicate ? 'pt-4' : ''}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                      {doc.category}
                    </span>
                    
                    {/* Glowing OCR Confidence score rating */}
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-glow-emerald" />
                      <span>{doc.confidenceScore}% AI</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {doc.summary}
                  </p>

                  {/* Extracted tags categorized with AI indicators */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {doc.tags.slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[9px] font-mono rounded bg-slate-900 border border-slate-850 text-indigo-300"
                        title="AI Generated Semantic Tag"
                      >
                        #{t} <strong className="text-[8px] text-slate-600 font-bold">[AI]</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inline Preview Panel */}
                {isPreviewOpen && (
                  <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-slate-850 space-y-4 animate-slideDown text-xs text-slate-300 font-mono">
                    
                    {/* PDF viewer simulated / Image Zoom */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-850 pb-1.5">
                        <span>SIMULATED VIEW: {doc.fileType.toUpperCase()} Reader</span>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => setZoomScale(s => Math.max(0.5, s - 0.2))} className="hover:text-cyan-400"><ZoomOut className="w-3.5 h-3.5" /></button>
                          <span className="text-[9px]">{Math.round(zoomScale * 100)}%</span>
                          <button onClick={() => setZoomScale(s => Math.min(2.0, s + 0.2))} className="hover:text-cyan-400"><ZoomIn className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      
                      <div
                        className="p-3.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400/90 max-h-40 overflow-y-auto whitespace-pre-wrap transition-transform origin-top"
                        style={{ transform: `scale(${zoomScale})` }}
                      >
                        {doc.rawText}
                      </div>
                    </div>

                    {/* Version History Log */}
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-500 uppercase flex items-center space-x-1">
                        <History className="w-3 h-3 text-cyan-400" />
                        <span>Document Version History</span>
                      </div>
                      <div className="text-[9px] text-slate-400 space-y-0.5 border-l border-slate-800 pl-2">
                        <div>v1.0 ({doc.uploadDate}) - Ingested OCR Extracted</div>
                        <div>v1.1 (Today) - Checked by Student</div>
                      </div>
                    </div>

                    {/* Manual tags editing panel */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-slate-500 uppercase block">Tag Manager</span>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 flex items-center space-x-1">
                            <span>#{t}</span>
                            <button onClick={() => handleRemoveTag(doc.id, t)} className="text-red-400 hover:text-red-300">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="text"
                          placeholder="Add manual tag..."
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag(doc.id)}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500 max-w-[140px]"
                        />
                        <button
                          onClick={() => handleAddTag(doc.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Related documents list */}
                    {related.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase block">Related Vault Items</span>
                        <div className="space-y-1">
                          {related.map(r => (
                            <button
                              key={r.id}
                              onClick={() => onOpenDocModal(r)}
                              className="w-full text-left truncate text-cyan-400 hover:underline flex items-center space-x-1"
                            >
                              <span>▸ {r.title.replace(/\.[^/.]+$/, "")}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDocId(isPreviewOpen ? null : doc.id);
                    }}
                    className="flex items-center space-x-1 text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPreviewOpen ? 'Hide Preview' : 'Quick Preview'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDocModal(doc);
                    }}
                    className="flex items-center space-x-1 text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Issuer / Source</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => onOpenDocModal(doc)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-200">{doc.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{doc.issuer || 'Verified Ingest'}</td>
                    <td className="p-4 text-slate-400 font-mono">{doc.dateCompleted || doc.uploadDate}</td>
                    <td className="p-4 font-mono text-emerald-400 font-semibold">{doc.confidenceScore}%</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenDocModal(doc); }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-semibold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
