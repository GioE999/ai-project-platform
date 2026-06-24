"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, FileText, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type LifeArea = "scientific" | "tech" | "cultural" | "personal" | "philosophical" | "economic";
type NodeType = "topic" | "note";

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  lifeArea?: LifeArea;
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

const lifeAreaNodeColors: Record<LifeArea, string> = {
  scientific: "#3b82f6",
  tech: "#a855f7",
  cultural: "#f59e0b",
  personal: "#22c55e",
  philosophical: "#ef4444",
  economic: "#eab308",
};

const noteNodeColor = "#6b7280";

// Pre-calculated positions: topics on outer ring, notes on inner ring
const centerX = 400;
const centerY = 300;
const outerRadius = 220;
const innerRadius = 120;

const topicNodes: GraphNode[] = [
  { id: "t1", label: "Arquitectura", type: "topic", lifeArea: "tech", x: centerX + Math.cos(0) * outerRadius, y: centerY + Math.sin(0) * outerRadius, connections: 5 },
  { id: "t2", label: "Productividad", type: "topic", lifeArea: "personal", x: centerX + Math.cos((Math.PI * 2) / 6) * outerRadius, y: centerY + Math.sin((Math.PI * 2) / 6) * outerRadius, connections: 4 },
  { id: "t3", label: "DevOps", type: "topic", lifeArea: "tech", x: centerX + Math.cos((Math.PI * 2 * 2) / 6) * outerRadius, y: centerY + Math.sin((Math.PI * 2 * 2) / 6) * outerRadius, connections: 4 },
  { id: "t4", label: "UX/UI", type: "topic", lifeArea: "cultural", x: centerX + Math.cos((Math.PI * 2 * 3) / 6) * outerRadius, y: centerY + Math.sin((Math.PI * 2 * 3) / 6) * outerRadius, connections: 3 },
  { id: "t5", label: "Aprendizaje", type: "topic", lifeArea: "philosophical", x: centerX + Math.cos((Math.PI * 2 * 4) / 6) * outerRadius, y: centerY + Math.sin((Math.PI * 2 * 4) / 6) * outerRadius, connections: 3 },
  { id: "t6", label: "Salud", type: "topic", lifeArea: "scientific", x: centerX + Math.cos((Math.PI * 2 * 5) / 6) * outerRadius, y: centerY + Math.sin((Math.PI * 2 * 5) / 6) * outerRadius, connections: 2 },
];

const noteNodes: GraphNode[] = [
  { id: "n1", label: "Arquitectura del Sistema", type: "note", x: centerX + Math.cos(Math.PI / 6) * innerRadius, y: centerY + Math.sin(Math.PI / 6) * innerRadius, connections: 3 },
  { id: "n2", label: "Microservicios", type: "note", x: centerX + Math.cos((Math.PI / 6) + (Math.PI * 2) / 6) * innerRadius, y: centerY + Math.sin((Math.PI / 6) + (Math.PI * 2) / 6) * innerRadius, connections: 4 },
  { id: "n3", label: "PostgreSQL", type: "note", x: centerX + Math.cos((Math.PI / 6) + (Math.PI * 2 * 2) / 6) * innerRadius, y: centerY + Math.sin((Math.PI / 6) + (Math.PI * 2 * 2) / 6) * innerRadius, connections: 3 },
  { id: "n4", label: "Reunión Sprint 11", type: "note", x: centerX + Math.cos((Math.PI / 6) + (Math.PI * 2 * 3) / 6) * innerRadius, y: centerY + Math.sin((Math.PI / 6) + (Math.PI * 2 * 3) / 6) * innerRadius, connections: 2 },
  { id: "n5", label: "Ideas de Producto", type: "note", x: centerX + Math.cos((Math.PI / 6) + (Math.PI * 2 * 4) / 6) * innerRadius, y: centerY + Math.sin((Math.PI / 6) + (Math.PI * 2 * 4) / 6) * innerRadius, connections: 3 },
  { id: "n6", label: "Guía de Onboarding", type: "note", x: centerX + Math.cos((Math.PI / 6) + (Math.PI * 2 * 5) / 6) * innerRadius, y: centerY + Math.sin((Math.PI / 6) + (Math.PI * 2 * 5) / 6) * innerRadius, connections: 2 },
];

const allNodes: GraphNode[] = [...topicNodes, ...noteNodes];

const edges: GraphEdge[] = [
  { from: "t1", to: "n1" }, { from: "t1", to: "n2" }, { from: "t1", to: "n3" },
  { from: "t2", to: "n4" }, { from: "t2", to: "n5" },
  { from: "t3", to: "n2" }, { from: "t3", to: "n3" }, { from: "t3", to: "n1" },
  { from: "t4", to: "n5" }, { from: "t4", to: "n6" },
  { from: "t5", to: "n6" }, { from: "t5", to: "n5" },
  { from: "t6", to: "n5" },
  { from: "n1", to: "n2" }, { from: "n1", to: "n3" },
  { from: "n2", to: "n3" },
  { from: "n4", to: "n5" },
  { from: "t1", to: "t3" },
];

export default function GraphPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<"all" | "topic" | "note">("all");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedNode(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const visibleNodes = filterType === "all" ? allNodes : allNodes.filter(n => n.type === filterType);
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  const visibleEdges = edges.filter(e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to));

  const totalNodes = allNodes.length;
  const totalEdges = edges.length;
  const totalTopics = topicNodes.length;
  const totalNotes = noteNodes.length;

  function getNodeColor(node: GraphNode): string {
    if (node.type === "note") return noteNodeColor;
    return lifeAreaNodeColors[node.lifeArea || "tech"];
  }

  function getNodeSize(node: GraphNode): number {
    return node.type === "topic" ? 28 : 18;
  }

  function zoomIn() { setZoom(prev => Math.min(prev + 0.2, 2)); }
  function zoomOut() { setZoom(prev => Math.max(prev - 0.2, 0.4)); }
  function resetZoom() { setZoom(1); setSelectedNode(null); }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/brain" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al Brain
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Grafo de Conocimiento
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilterType("all")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterType === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>Todo</button>
          <button onClick={() => setFilterType("topic")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterType === "topic" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>Temas</button>
          <button onClick={() => setFilterType("note")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterType === "note" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>Notas</button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative overflow-hidden bg-muted/30">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
          <button onClick={zoomIn} className="rounded-lg border bg-card p-2 hover:bg-accent transition-colors shadow-sm"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={zoomOut} className="rounded-lg border bg-card p-2 hover:bg-accent transition-colors shadow-sm"><ZoomOut className="h-4 w-4" /></button>
          <button onClick={resetZoom} className="rounded-lg border bg-card p-2 hover:bg-accent transition-colors shadow-sm"><RotateCcw className="h-4 w-4" /></button>
        </div>

        {/* SVG Graph */}
        <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}>
          <div className="relative" style={{ width: "800px", height: "600px" }}>
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {visibleEdges.map((edge, i) => {
                const fromNode = allNodes.find(n => n.id === edge.from);
                const toNode = allNodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                return (
                  <line
                    key={i}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeOpacity={0.4}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {visibleNodes.map(node => {
              const size = getNodeSize(node);
              const color = getNodeColor(node);
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="absolute rounded-full flex items-center justify-center text-white font-medium shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                    left: `${node.x - size}px`,
                    top: `${node.y - size}px`,
                    backgroundColor: color,
                    border: isSelected ? "3px solid #4f46e5" : "2px solid rgba(255,255,255,0.5)",
                    fontSize: node.type === "topic" ? "11px" : "9px",
                  }}
                  title={node.label}
                >
                  <span className="truncate px-1 leading-tight text-center">
                    {node.label.split(" ").slice(0, 2).join(" ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Node Detail */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 rounded-xl border bg-card shadow-lg p-4 min-w-[280px]"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2" style={{ backgroundColor: getNodeColor(selectedNode) + "20" }}>
                {selectedNode.type === "topic" ? <Brain className="h-4 w-4" style={{ color: getNodeColor(selectedNode) }} /> : <FileText className="h-4 w-4" style={{ color: getNodeColor(selectedNode) }} />}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{selectedNode.label}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium rounded-full bg-muted px-2 py-0.5 capitalize">{selectedNode.type === "topic" ? "Tema" : "Nota"}</span>
                  <span className="text-[10px] text-muted-foreground">{selectedNode.connections} conexiones</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="border-t px-6 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-card">
        <span>{totalNodes} nodos</span>
        <span>·</span>
        <span>{totalEdges} conexiones</span>
        <span>·</span>
        <span>{totalTopics} temas</span>
        <span>·</span>
        <span>{totalNotes} notas</span>
      </div>
    </div>
  );
}
