"use client";
import { Link2, FlaskConical, FileText, Lightbulb, ArrowRight } from "lucide-react";
import type { KnowledgeEdge } from "@/types/knowledge";

interface BacklinksPanelProps {
  noteTitle: string;
  edgesFrom: KnowledgeEdge[];
  edgesTo: KnowledgeEdge[];
  onNavigate?: (noteId: string) => void;
}

const relationLabels: Record<string, string> = {
  REFERENCES: "referencia",
  DERIVED_FROM: "derivado de",
  SUPPORTS: "apoya",
  CONTRADICTS: "contradice",
  RELATED_TOPIC: "tema relacionado",
};

const typeIcons: Record<string, React.ElementType> = {
  BRAIN_NOTE: FileText,
  RESEARCH: FlaskConical,
  RESEARCH_DRAFT: FlaskConical,
  IDEA: Lightbulb,
  MEETING_NOTE: FileText,
  LEARNING: Lightbulb,
  ROUTINE_NOTE: FileText,
  ACTION_ITEM: FileText,
};

const typeColors: Record<string, string> = {
  BRAIN_NOTE: "text-indigo-600",
  RESEARCH: "text-green-600",
  RESEARCH_DRAFT: "text-green-500",
  IDEA: "text-amber-600",
  MEETING_NOTE: "text-red-500",
  LEARNING: "text-pink-500",
  ROUTINE_NOTE: "text-purple-500",
  ACTION_ITEM: "text-cyan-500",
};

export function BacklinksPanel({ noteTitle, edgesFrom, edgesTo, onNavigate }: BacklinksPanelProps) {
  if (edgesFrom.length === 0 && edgesTo.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
          <Link2 className="h-3.5 w-3.5" />Conexiones del grafo
        </h3>
        <p className="text-xs text-muted-foreground">Sin conexiones aún. Usa [[wikilinks]] para crear referencias.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-1.5">
        <Link2 className="h-3.5 w-3.5" />
        Conexiones ({edgesFrom.length + edgesTo.length})
      </h3>

      {/* Outgoing: this note references others */}
      {edgesFrom.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Sale de "{noteTitle}" →
          </p>
          <div className="space-y-1">
            {edgesFrom.map(edge => {
              const target = edge.to;
              if (!target) return null;
              const Icon = typeIcons[target.type] || FileText;
              const color = typeColors[target.type] || "text-gray-500";
              return (
                <button
                  key={edge.id}
                  onClick={() => onNavigate?.(target.id)}
                  className="flex items-center gap-2 w-full rounded-lg border p-2 text-left hover:bg-accent/30 transition-colors"
                >
                  <Icon className={`h-3.5 w-3.5 ${color} shrink-0`} />
                  <span className="text-xs flex-1 truncate">{target.title}</span>
                  <span className="text-[9px] text-muted-foreground italic">{relationLabels[edge.relationType] || edge.relationType}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Incoming: others reference this note (backlinks) */}
      {edgesTo.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            ← Apunta a "{noteTitle}"
          </p>
          <div className="space-y-1">
            {edgesTo.map(edge => {
              const source = edge.from;
              if (!source) return null;
              const Icon = typeIcons[source.type] || FileText;
              const color = typeColors[source.type] || "text-gray-500";
              return (
                <button
                  key={edge.id}
                  onClick={() => onNavigate?.(source.id)}
                  className="flex items-center gap-2 w-full rounded-lg border p-2 text-left hover:bg-accent/30 transition-colors"
                >
                  <Icon className={`h-3.5 w-3.5 ${color} shrink-0`} />
                  <span className="text-xs flex-1 truncate">{source.title}</span>
                  <span className="text-[9px] text-muted-foreground italic">{relationLabels[edge.relationType] || edge.relationType}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
