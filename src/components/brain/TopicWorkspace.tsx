"use client";
import { useState } from "react";
import { FileText, Lightbulb, Sparkles, BookOpen, Tag, Activity } from "lucide-react";
import type { SeedTopic, SeedKnowledgeNote, SeedLearning } from "@/lib/brain/seed";
import { getRoutinesForTopic } from "@/lib/brain/routine-links";

interface TopicWorkspaceProps {
  topic: SeedTopic;
}

type WorkspaceTab = "resumen" | "notas" | "aprendizajes" | "rutinas";

export function TopicWorkspace({ topic }: TopicWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("resumen");

  const linkedRoutines = getRoutinesForTopic(topic.slug);

  const tabs: { key: WorkspaceTab; label: string; count: number; icon: React.ElementType }[] = [
    { key: "resumen", label: "Resumen", count: 0, icon: Sparkles },
    { key: "notas", label: "Notas", count: topic.initialNotes.length, icon: FileText },
    { key: "aprendizajes", label: "Aprendizajes", count: topic.initialLearnings.length, icon: Lightbulb },
    { key: "rutinas", label: "Rutinas", count: linkedRoutines.length, icon: Activity },
  ];

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{topic.icon}</span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{topic.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{topic.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {topic.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  <Tag className="h-2.5 w-2.5" />{tag}
                </span>
              ))}
            </div>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[10px] font-medium bg-primary/10 text-primary capitalize">
            {topic.lifeArea.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-5 flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count > 0 && <span className="rounded-full bg-muted px-1.5 text-[10px]">{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-5 min-h-[300px]">
        {activeTab === "resumen" && <ResumenTab topic={topic} />}
        {activeTab === "notas" && <NotasTab notes={topic.initialNotes} />}
        {activeTab === "aprendizajes" && <AprendizajesTab learnings={topic.initialLearnings} />}
        {activeTab === "rutinas" && <RutinasTab routines={linkedRoutines} />}
      </div>
    </div>
  );
}

function ResumenTab({ topic }: { topic: SeedTopic }) {
  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5" />Resumen del tema
        </h3>
        <p className="text-sm leading-relaxed">{topic.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Notas" value={topic.initialNotes.length} icon="📝" />
        <StatCard label="Aprendizajes" value={topic.initialLearnings.length} icon="💡" />
        <StatCard label="Tags" value={topic.tags.length} icon="🏷️" />
        <StatCard label="Área" value={topic.lifeArea.toLowerCase()} icon="📂" isText />
      </div>

      {/* Quick preview of latest content */}
      {topic.initialNotes.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contenido destacado</h4>
          <div className="space-y-2">
            {topic.initialNotes.slice(0, 2).map((note, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{note.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content.replace(/[#*`\[\]]/g, "").slice(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick preview of learnings */}
      {topic.initialLearnings.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Aprendizajes clave</h4>
          <div className="space-y-1.5">
            {topic.initialLearnings.slice(0, 3).map((l, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border p-2.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">{l.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotasTab({ notes }: { notes: SeedKnowledgeNote[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (notes.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No hay notas aún.</p>;

  return (
    <div className="space-y-3">
      {notes.map((note, i) => (
        <div key={i} className="rounded-xl border overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-accent/30 transition-colors"
          >
            <FileText className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{note.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                  note.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>{note.status}</span>
                <span className="text-[10px] text-muted-foreground">{note.type}</span>
              </div>
            </div>
          </button>
          {expanded === i && (
            <div className="border-t px-4 py-3 bg-muted/30">
              <div className="prose prose-sm max-w-none text-sm">
                {note.content.split("\n").map((line, j) => {
                  if (line.startsWith("## ")) return <h3 key={j} className="text-sm font-bold mt-3 mb-1">{line.replace("## ", "")}</h3>;
                  if (line.startsWith("### ")) return <h4 key={j} className="text-xs font-semibold mt-2 mb-1">{line.replace("### ", "")}</h4>;
                  if (line.startsWith("- ")) return <li key={j} className="text-xs text-muted-foreground ml-4 list-disc">{line.replace("- ", "")}</li>;
                  if (line.startsWith("> ")) return <blockquote key={j} className="border-l-2 border-primary/30 pl-3 text-xs italic text-muted-foreground my-1">{line.replace("> ", "")}</blockquote>;
                  if (line.trim() === "") return <div key={j} className="h-1.5" />;
                  return <p key={j} className="text-xs leading-relaxed text-foreground/80">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
                })}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.map(tag => (
                  <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AprendizajesTab({ learnings }: { learnings: SeedLearning[] }) {
  if (learnings.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No hay aprendizajes aún.</p>;

  const typeColors: Record<string, string> = {
    FACT: "bg-blue-100 text-blue-700",
    INSIGHT: "bg-purple-100 text-purple-700",
    SKILL: "bg-green-100 text-green-700",
    REFLECTION: "bg-amber-100 text-amber-700",
    QUOTE: "bg-pink-100 text-pink-700",
  };

  const sourceIcons: Record<string, string> = {
    BOOK: "📚",
    ARTICLE: "📰",
    EXPERIENCE: "🧪",
    VIDEO: "🎥",
    CONVERSATION: "💬",
  };

  return (
    <div className="space-y-2">
      {learnings.map((l, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
          <span className="text-sm shrink-0">{sourceIcons[l.source] || "📝"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed">{l.content}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${typeColors[l.type] || "bg-gray-100 text-gray-700"}`}>
                {l.type.toLowerCase()}
              </span>
              <span className="text-[10px] text-muted-foreground">{l.source.toLowerCase()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, icon, isText }: { label: string; value: number | string; icon: string; isText?: boolean }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <span className="text-lg">{icon}</span>
      <p className={`font-semibold mt-1 ${isText ? "text-xs" : "text-lg"}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function RutinasTab({ routines }: { routines: { id: string; name: string; category: string; emoji: string; steps: number; totalMin: number; adherence: number }[] }) {
  if (routines.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No hay rutinas vinculadas a este tema aún.</p>;

  return (
    <div className="space-y-2">
      {routines.map(r => (
        <a key={r.id} href="/routines" className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
          <span className="text-xl">{r.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{r.name}</p>
            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
              <span>{r.steps} pasos</span>
              <span>{r.totalMin} min</span>
              <span className="text-green-600 font-medium">{r.adherence}% adherencia</span>
            </div>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}
