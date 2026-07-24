import React, { useState, useEffect, useRef } from 'react';
import { KnowledgeNode, KnowledgeLink } from '../types';
import { GitFork, ZoomIn, ZoomOut, RotateCcw, Filter, Sparkles, ArrowRight, Info, CheckCircle2, Search as SearchIcon, X } from 'lucide-react';

interface KnowledgeGraphViewProps {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  onNavigateVault: () => void;
}

interface GraphNode extends KnowledgeNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  nodes,
  links,
  onNavigateVault
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('proj-memoryverse');
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  
  // Simulation states
  const [simNodes, setSimNodes] = useState<GraphNode[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // SVG coordinate tracking refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDraggingCanvasRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Initialize and update simulation nodes
  useEffect(() => {
    setSimNodes((prev) => {
      return nodes.map((node) => {
        const existing = prev.find((p) => p.id === node.id);
        return {
          ...node,
          x: existing ? existing.x : Math.random() * 500 + 250,
          y: existing ? existing.y : Math.random() * 300 + 100,
          vx: existing ? existing.vx : 0,
          vy: existing ? existing.vy : 0
        };
      });
    });
  }, [nodes]);

  // Force-Directed Layout Physics Engine Tick loop
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      setSimNodes((prevNodes) => {
        if (prevNodes.length === 0) return prevNodes;

        // Copy nodes to avoid mutating state directly
        const updated = prevNodes.map((n) => ({ ...n }));

        // 1. Central Gravity Force (pull towards center of viewBox: 500, 250)
        updated.forEach((n) => {
          if (n.id !== draggedNodeId) {
            n.vx += (500 - n.x) * 0.004;
            n.vy += (250 - n.y) * 0.004;
          }
        });

        // 2. Node Repulsion Force (prevent label & circle overlapping)
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const n1 = updated[i];
            const n2 = updated[j];

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            const minDistance = 140; // Spacing constant to prevent overlapping labels
            if (dist < minDistance) {
              const force = (minDistance - dist) * 0.025;
              const pushX = (dx / dist) * force;
              const pushY = (dy / dist) * force;

              if (n1.id !== draggedNodeId) {
                n1.vx -= pushX;
                n1.vy -= pushY;
              }
              if (n2.id !== draggedNodeId) {
                n2.vx += pushX;
                n2.vy += pushY;
              }
            }
          }
        }

        // 3. Link Attraction Force (pull connected nodes together)
        links.forEach((link) => {
          const nSource = updated.find((n) => n.id === link.source);
          const nTarget = updated.find((n) => n.id === link.target);

          if (nSource && nTarget) {
            const dx = nTarget.x - nSource.x;
            const dy = nTarget.y - nSource.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            const desiredDist = 160; // Spacing for dynamic balance
            const force = (dist - desiredDist) * 0.03;
            const pullX = (dx / dist) * force;
            const pullY = (dy / dist) * force;

            if (nSource.id !== draggedNodeId) {
              nSource.vx += pullX;
              nSource.vy += pullY;
            }
            if (nTarget.id !== draggedNodeId) {
              nTarget.vx -= pullX;
              nTarget.vy -= pullY;
            }
          }
        });

        // 4. Update Node Positions & Apply Friction
        updated.forEach((n) => {
          if (n.id === draggedNodeId) return; // position locked to cursor
          n.x += n.vx;
          n.y += n.vy;

          n.vx *= 0.78; // damping/friction
          n.vy *= 0.78;

          // Box boundaries checks
          if (n.x < 50) { n.x = 50; n.vx = 0; }
          if (n.x > 950) { n.x = 950; n.vx = 0; }
          if (n.y < 50) { n.y = 50; n.vy = 0; }
          if (n.y > 450) { n.y = 450; n.vy = 0; }
        });

        return updated;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [links, draggedNodeId]);

  // Derived properties from active selection
  const selectedNode = simNodes.find((n) => n.id === selectedNodeId) || simNodes[0];

  const connectedLinks = selectedNodeId
    ? links.filter((l) => l.source === selectedNodeId || l.target === selectedNodeId)
    : [];

  const connectedNodeIds = new Set(
    connectedLinks.flatMap((l) => [l.source, l.target])
  );

  // Hover connections highlight set
  const hoveredLinks = hoveredNodeId
    ? links.filter((l) => l.source === hoveredNodeId || l.target === hoveredNodeId)
    : [];

  const hoveredConnectedNodeIds = new Set(
    hoveredLinks.flatMap((l) => [l.source, l.target])
  );

  // Filters nodes list
  const filteredNodes = simNodes.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  // Node search filters
  const searchResults = searchQuery.trim()
    ? simNodes.filter((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Drag Handlers for individual Nodes
  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  // Drag & Pan Handlers for Background SVG canvas
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    isDraggingCanvasRef.current = true;
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      // Node Drag Mode: translate screen cursor offset to SVG coordinate scale
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      
      // Calculate cursor relative coordinates inside SVG viewport
      const x = ((e.clientX - rect.left) / rect.width) * 1000;
      const y = ((e.clientY - rect.top) / rect.height) * 500;

      setSimNodes((prev) =>
        prev.map((node) => (node.id === draggedNodeId ? { ...node, x, y, vx: 0, vy: 0 } : node))
      );
    } else if (isDraggingCanvasRef.current) {
      // Canvas Pan Mode
      setPanX(e.clientX - dragStartRef.current.x);
      setPanY(e.clientY - dragStartRef.current.y);
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
    isDraggingCanvasRef.current = false;
  };

  const resetPanAndZoom = () => {
    setPanX(0);
    setPanY(0);
    setZoomLevel(1);
  };

  // Node colors dictionary by category
  const getNodeColor = (type: string): string => {
    switch (type) {
      case 'skill': return '#f59e0b'; // Amber
      case 'project': return '#38bdf8'; // Sky Cyan
      case 'internship': return '#34d399'; // Emerald Green
      case 'certification': return '#c084fc'; // Fuchsia/Purple
      case 'career': return '#f43f5e'; // Rose Pink
      default: return '#818cf8'; // Indigo
    }
  };

  // Link colors dictionary by relationship type
  const getLinkColor = (link: KnowledgeLink): string => {
    const isHovered = hoveredNodeId && (link.source === hoveredNodeId || link.target === hoveredNodeId);
    const isSelected = selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId);

    if (isHovered) return '#38bdf8'; // Glowing sky blue for hovered link
    if (isSelected) return '#f59e0b'; // Glowing gold for selected link
    return '#1e293b'; // Default dark grey
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              AI KNOWLEDGE GRAPH ENGINE
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-100 mt-2">
            Interactive Relationship Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual dynamic knowledge network mapping Skills → Projects → Internships → Certifications → Target Career Goals.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Node Search Bar */}
          <div className="relative max-w-xs">
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search graph nodes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="pl-9 pr-8 py-2 w-full rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-md shadow-2xl p-2 z-50 max-h-52 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      setSelectedNodeId(result.id);
                      setSearchQuery('');
                      setShowSearchResults(false);
                      
                      // Pan graph to center the selected search target node
                      setPanX(500 - result.x * zoomLevel);
                      setPanY(250 - result.y * zoomLevel);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-800/80 text-slate-300 hover:text-cyan-300 transition-colors flex items-center space-x-2"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getNodeColor(result.type) }} />
                    <span>{result.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Node Category Switch Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none">
            {['all', 'skill', 'project', 'internship', 'certification', 'career'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* GRAPH CANVAS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Force-Directed SVG Canvas Card */}
        <div className="lg:col-span-2 relative rounded-3xl glass-panel border border-cyan-500/30 bg-[#070b14]/90 shadow-2xl overflow-hidden min-h-[520px] flex flex-col justify-between p-4 cursor-grab active:cursor-grabbing">
          
          {/* Canvas controls banner overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/60 p-2 rounded-xl text-[10px] font-mono text-cyan-400/80 border border-slate-800 backdrop-blur-md hidden sm:block">
            <span>Mouse Drag Node to reposition | Drag Background to Pan</span>
          </div>

          {/* Zoom Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md select-none">
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.8))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-cyan-400 w-10 text-center font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.6))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetPanAndZoom}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas SVG Container */}
          <div className="w-full h-full min-h-[460px] flex items-center justify-center overflow-hidden select-none">
            <svg
              ref={svgRef}
              className="w-full h-[480px] bg-transparent"
              viewBox="0 0 1000 500"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              <defs>
                <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Translation zoom panning viewport group */}
              <g transform={`translate(${panX}, ${panY}) scale(${zoomLevel})`}>
                
                {/* 1. Links Render */}
                {links.map((link, idx) => {
                  const sourceNode = simNodes.find((n) => n.id === link.source);
                  const targetNode = simNodes.find((n) => n.id === link.target);

                  if (!sourceNode || !targetNode) return null;

                  const isSelected = selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId);
                  const isHovered = hoveredNodeId && (link.source === hoveredNodeId || link.target === hoveredNodeId);
                  
                  // Check filter constraints
                  const isSourceVisible = filterType === 'all' || sourceNode.type === filterType;
                  const isTargetVisible = filterType === 'all' || targetNode.type === filterType;
                  if (!isSourceVisible || !isTargetVisible) return null;

                  return (
                    <g key={idx}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={getLinkColor(link)}
                        strokeWidth={isHovered ? 3 : isSelected ? 2.5 : 1}
                        strokeDasharray={isSelected || isHovered ? "5,3" : undefined}
                        opacity={isHovered ? 1.0 : isSelected ? 0.9 : 0.25}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* 2. Nodes Render */}
                {filteredNodes.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  const isConnected = connectedNodeIds.has(node.id);
                  const isHovered = node.id === hoveredNodeId;
                  
                  // Hover highlight connections filter logic
                  const isHighlightedByHover = hoveredNodeId
                    ? hoveredNodeId === node.id || hoveredConnectedNodeIds.has(node.id)
                    : true;

                  const nodeColor = getNodeColor(node.type);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                      onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="cursor-grab active:cursor-grabbing group transition-opacity duration-300"
                      opacity={isHighlightedByHover ? 1.0 : 0.3}
                    >
                      {/* Outer Glow Halo Ring */}
                      <circle
                        r={node.val / 2 + (isSelected ? 9 : isHovered ? 7 : 3)}
                        fill={nodeColor}
                        opacity={isSelected ? 0.35 : isHovered ? 0.25 : isConnected ? 0.15 : 0.05}
                        filter={isSelected || isHovered ? "url(#nodeGlow)" : undefined}
                        className="transition-all duration-300"
                      />

                      {/* Main Center circle */}
                      <circle
                        r={node.val / 2}
                        fill={nodeColor}
                        stroke={isSelected ? '#ffffff' : '#070b14'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />

                      {/* Text Label styling */}
                      <text
                        y={node.val / 2 + 15}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : isHovered ? '#38bdf8' : '#e2e8f0'}
                        fontSize={isSelected ? '12' : '10'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="Inter"
                        className="pointer-events-none drop-shadow font-medium"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}

              </g>
            </svg>
          </div>

          {/* Graph Legend Panel */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span>Projects</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span>Skills</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
              <span>Internships</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]" />
              <span>Certifications</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
              <span>Target Role</span>
            </span>
          </div>

        </div>

        {/* Right: Selected Node Relationship Inspector Side Panel */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-[#0f172a]/95 shadow-2xl flex flex-col justify-between">
          
          {selectedNode ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Graph Inspector</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 uppercase tracking-wider font-mono border border-cyan-500/20">
                  {selectedNode.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-100 font-outfit leading-snug">{selectedNode.label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedNode.description || 'Verified knowledge node linked to your professional identity.'}</p>
              </div>

              {/* Connected Relationships List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Linked Connections</span>
                  <span className="text-[10px] text-cyan-400 font-normal">{connectedLinks.length} Links</span>
                </h4>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {connectedLinks.map((link, idx) => {
                    const otherId = link.source === selectedNode.id ? link.target : link.source;
                    const otherNode = simNodes.find((n) => n.id === otherId);
                    if (!otherNode) return null;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedNodeId(otherNode.id)}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getNodeColor(otherNode.type) }} />
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {otherNode.label}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/25">
                          {link.label || 'Connected'}
                        </span>
                      </div>
                    );
                  })}
                  {connectedLinks.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-500">No directly linked relationships found.</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Info className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs">Click any node on the relationship engine to inspect connections.</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onNavigateVault}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Inspect Digital Identity Vault</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
