"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Brain, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  color: string;
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

const typeLabels: Record<string, string> = {
  BRAIN_NOTE: "Nota",
  RESEARCH: "Investigación",
  RESEARCH_DRAFT: "Borrador",
  MEETING_NOTE: "Reunión",
  IDEA: "Idea",
  ROUTINE_NOTE: "Rutina",
  ACTION_ITEM: "Acción",
  LEARNING: "Aprendizaje",
};

const edgeTypeStyles: Record<string, { dash: string; opacity: number }> = {
  REFERENCES: { dash: "none", opacity: 0.5 },
  DERIVED_FROM: { dash: "4 2", opacity: 0.6 },
  SUPPORTS: { dash: "none", opacity: 0.4 },
  CONTRADICTS: { dash: "2 2", opacity: 0.7 },
  RELATED_TOPIC: { dash: "6 3", opacity: 0.3 },
};

// Fallback static data for when API is not available
const fallbackNodes: Omit<GraphNode, "x" | "y" | "connections">[] = [
  { id: "n1", label: "Arquitectura del Sistema", type: "BRAIN_NOTE", color: "#6366f1" },
  { id: "n2", label: "Microservicios", type: "BRAIN_NOTE", color: "#6366f1" },
  { id: "n3", label: "PostgreSQL", type: "BRAIN_NOTE", color: "#6366f1" },
  { id: "r1", label: "CI/CD para monorepos", type: "RESEARCH", color: "#10b981" },
  { id: "r2", label: "Entrenamiento fuerza 3x", type: "RESEARCH", color: "#10b981" },
  { id: "r3", label: "Productividad remota", type: "RESEARCH", color: "#10b981" },
  { id: "i1", label: "Ideas de Producto", type: "IDEA", color: "#f59e0b" },
  { id: "m1", label: "Reunión Sprint 11", type: "MEETING_NOTE", color: "#ef4444" },
  { id: "l1", label: "Progresión lineal", type: "LEARNING", color: "#ec4899" },
  { id: "l2", label: "Turborepo caching", type: "LEARNING", color: "#ec4899" },
];

const fallbackEdges: GraphEdge[] = [
  { source: "n1", target: "n2", type: "REFERENCES" },
  { source: "n1", target: "n3", type: "REFERENCES" },
  { source: "n2", target: "n3", type: "REFERENCES" },
  { source: "r1", target: "l2", type: "DERIVED_FROM" },
  { source: "r2", target: "l1", type: "DERIVED_FROM" },
  { source: "r3", target: "i1", type: "SUPPORTS" },
  { source: "m1", target: "i1", type: "REFERENCES" },
  { source: "n1", target: "r1", type: "RELATED_TOPIC" },
  { source: "r2", target: "n1", type: "CONTRADICTS" },
];

function layoutNodes(rawNodes: Omit<GraphNode, "x" | "y" | "connections">[], edges: GraphEdge[]): GraphNode[] {
  const cx = 400, cy = 300;
  const count = rawNodes.length;
  if (count === 0) return [];

  // Count connections per node
  const connMap: Record<string, number> = {};
  rawNodes.forEach(n => { connMap[n.id] = 0; });
  edges.forEach(e => {
    if (connMap[e.source] !== undefined) connMap[e.source]++;
    if (connMap[e.target] !== undefined) connMap[e.target]++;
  });

  // Place nodes in a force-like circular layout, larger nodes (more connections) closer to center
  const sorted = [...rawNodes].sort((a, b) => (connMap[b.id] || 0) - (connMap[a.id] || 0));
  return sorted.map((node, i) => {
    const angle = (i * 2 * Math.PI) / count;
    const radius = 100 + (i / count) * 180;
    return {
      ...node,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      connections: connMap[node.id] || 0,
    };
  });
}

export default function GraphPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [topicFilter, setTopicFilter] = useState<string>("");

  // Fetch graph data
  useEffect(() => {
    const url = topicFilter ? `/api/knowledge/graph?topicId=${topicFilter}` : "/api/knowledge/graph";
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.nodes?.length > 0) {
          setNodes(layoutNodes(data.nodes, data.edges));
          setEdges(data.edges);
        } else {
          // Use fallback
          setNodes(layoutNodes(fallbackNodes, fallbackEdges));
          setEdges(fallbackEdges);
        }
      })
      .catch(() => {
        setNodes(layoutNodes(fallbackNodes, fallbackEdges));
        setEdges(fallbackEdges);
      });
  }, [topicFilter]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedNode(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const typeSet = new Set(nodes.map(n => n.type));
  const visibleNodes = filterType === "all" ? nodes : nodes.filter(n => n.type === filterType);
  const visibleIds = new Set(visibleNodes.map(n => n.id));
  const visibleEdges = edges.filter(e => visibleIds.has(e.source) && visibleIds.has(e.target));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/brain" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />Brain
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Grafo de Conocimiento
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilterType("all")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterType === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>Todo</button>
          {Array.from(typeSet).map(type => (
            <button key={type} onClick={() => setFilterType(type)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterType === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
              {typeLabels[type] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative overflow-hidden bg-muted/30">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} className="rounded-lg border bg-card p-2 hover:bg-accent shadow-sm"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="rounded-lg border bg-card p-2 hover:bg-accent shadow-sm"><ZoomOut className="h-4 w-4" /></button>
          <button onClick={() => { setZoom(1); setSelectedNode(null); }} className="rounded-lg border bg-card p-2 hover:bg-accent shadow-sm"><RotateCcw className="h-4 w-4" /></button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 rounded-lg border bg-card/90 p-3 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tipos de nodo</p>
          {[
            { color: "#6366f1", label: "Nota" },
            { color: "#10b981", label: "Investigación" },
            { color: "#f59e0b", label: "Idea" },
            { color: "#ef4444", label: "Reunión" },
            { color: "#8b5cf6", label: "Rutina" },
            { color: "#ec4899", label: "Aprendizaje" },
            { color: "#06b6d4", label: "Acción" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Relaciones</p>
            <div className="space-y-0.5 text-[10px] text-muted-foreground">
              <p>─── Referencias</p>
              <p>╌╌╌ Derivado de</p>
              <p>┈┈┈ Relacionado</p>
            </div>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}>
          <div className="relative" style={{ width: "800px", height: "600px" }}>
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {visibleEdges.map((edge, i) => {
                const from = nodes.find(n => n.id === edge.source);
                const to = nodes.find(n => n.id === edge.target);
                if (!from || !to) return null;
                const style = edgeTypeStyles[edge.type] || edgeTypeStyles.REFERENCES;
                return (
                  <line
                    key={i}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeOpacity={style.opacity}
                    strokeDasharray={style.dash}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {visibleNodes.map(node => {
              const size = 16 + Math.min(node.connections * 4, 20);
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="absolute rounded-full flex items-center justify-center text-white font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110"
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                    left: `${node.x - size}px`,
                    top: `${node.y - size}px`,
                    backgroundColor: node.color,
                    border: isSelected ? "3px solid #1e1b4b" : "2px solid rgba(255,255,255,0.6)",
                    fontSize: `${Math.max(8, 11 - Math.max(0, node.label.length - 15) * 0.3)}px`,
                  }}
                  title={`${node.label} (${typeLabels[node.type] || node.type})`}
                >
                  <span className="truncate px-1 leading-tight text-center">
                    {node.label.length > 16 ? node.label.slice(0, 14) + "…" : node.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Detail */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 rounded-xl border bg-card shadow-lg p-4 min-w-[300px]"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 flex items-center justify-center" style={{ backgroundColor: selectedNode.color + "30" }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{selectedNode.label}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium rounded-full bg-muted px-2 py-0.5">{typeLabels[selectedNode.type] || selectedNode.type}</span>
                  <span className="text-[10px] text-muted-foreground">{selectedNode.connections} conexiones</span>
                </div>
              </div>
            </div>
            {/* Connected nodes */}
            {selectedNode.connections > 0 && (
              <div className="mt-3 pt-2 border-t">
                <p className="text-[10px] text-muted-foreground font-medium mb-1">Conectado con:</p>
                <div className="flex flex-wrap gap-1">
                  {edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .slice(0, 6)
                    .map((e, i) => {
                      const otherId = e.source === selectedNode.id ? e.target : e.source;
                      const other = nodes.find(n => n.id === otherId);
                      if (!other) return null;
                      return (
                        <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[9px] truncate max-w-[120px]">
                          {other.label}
                        </span>
                      );
                    })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="border-t px-6 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-card">
        <span>{nodes.length} nodos</span>
        <span>·</span>
        <span>{edges.length} conexiones</span>
        <span>·</span>
        <span>{new Set(nodes.map(n => n.type)).size} tipos</span>
      </div>
    </div>
  );
}
