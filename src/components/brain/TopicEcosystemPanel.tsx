"use client";
import { useState, useMemo } from "react";
import { FlaskConical, FileText, CheckSquare, FolderOpen, Activity, Video, Lightbulb, Clock, Link2, ArrowUpDown, BookOpen, Map, Leaf, UtensilsCrossed, ListChecks } from "lucide-react";
import type { TopicEcosystem, KnowledgeNote } from "@/types/knowledge";

interface TopicEcosystemPanelProps {
  ecosystem: TopicEcosystem;
  onSelectNote?: (noteId: string) => void;
}

type EcosystemTab = "researches" | "notes" | "checklists" | "guides" | "journals" | "recipes" | "resources" | "tasks" | "projects" | "routines" | "meetings" | "learnings";
type SortField = "title" | "date" | "status";
type SortOrder = "asc" | "desc";

const tabs: { key: EcosystemTab; label: string; icon: React.ElementType }[] = [
  { key: "researches", label: "Investigaciones", icon: FlaskConical },
  { key: "notes", label: "Notas", icon: FileText },
  { key: "checklists", label: "Checklists", icon: ListChecks },
  { key: "guides", label: "Guías", icon: BookOpen },
  { key: "journals", label: "Bitácoras", icon: BookOpen },
  { key: "recipes", label: "Recetas", icon: UtensilsCrossed },
  { key: "resources", label: "Recursos", icon: Link2 },
  { key: "tasks", label: "Tareas", icon: CheckSquare },
  { key: "projects", label: "Proyectos", icon: FolderOpen },
  { key: "routines", label: "Rutinas", icon: Activity },
  { key: "meetings", label: "Reuniones", icon: Video },
  { key: "learnings", label: "Aprendizajes", icon: Lightbulb },
];

export function TopicEcosystemPanel({ ecosystem, onSelectNote }: TopicEcosystemPanelProps) {
  const [activeTab, setActiveTab] = useState<EcosystemTab>("researches");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { topic } = ecosystem;

  const counts: Record<EcosystemTab, number> = {
    researches: ecosystem.researches.length,
    notes: ecosystem.notes.length,
    checklists: (ecosystem.checklists || []).length,
    guides: (ecosystem.guides || []).length,
    journals: (ecosystem.journals || []).length,
    recipes: (ecosystem.recipes || []).length,
    resources: (ecosystem.resources || []).length,
    tasks: ecosystem.tasks.length,
    projects: ecosystem.projects.length,
    routines: ecosystem.routines.length,
    meetings: ecosystem.meetings.length,
    learnings: ecosystem.learnings.length,
  };

  function toggleSort(field: SortField) {
    if (sortField === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("desc"); }
  }

  // Sorted & filtered knowledge notes
  const sortedResearches = useMemo(() => {
    let items = [...ecosystem.researches];
    if (statusFilter !== "all") items = items.filter(n => n.status === statusFilter);
    items.sort((a, b) => {
      if (sortField === "title") return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      if (sortField === "date") return sortOrder === "asc" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortField === "status") return sortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      return 0;
    });
    return items;
  }, [ecosystem.researches, sortField, sortOrder, statusFilter]);

  const sortedNotes = useMemo(() => {
    let items = [...ecosystem.notes];
    if (statusFilter !== "all") items = items.filter(n => n.status === statusFilter);
    items.sort((a, b) => {
      if (sortField === "title") return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      return sortOrder === "asc" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return items;
  }, [ecosystem.notes, sortField, sortOrder, statusFilter]);

  return (
    <section className="rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b px-5 py-4 flex items-center gap-3">
        <span className="text-2xl">{topic.icon}</span>
        <div className="flex-1">
          <h2 className="font-semibold">{topic.name}</h2>
          <p className="text-xs text-muted-foreground">
            {Object.values(counts).reduce((a, b) => a + b, 0)} elementos · {topic.lifeArea.toLowerCase()}
          </p>
        </div>
        {/* Sort & Filter controls */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => toggleSort("date")} className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] ${sortField === "date" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
            <Clock className="h-3 w-3" />Fecha {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button onClick={() => toggleSort("title")} className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] ${sortField === "title" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
            <ArrowUpDown className="h-3 w-3" />A-Z {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded border bg-transparent px-2 py-1 text-[10px]">
            <option value="all">Todos</option>
            <option value="DRAFT">Borrador</option>
            <option value="COMPLETED">Completada</option>
            <option value="PUBLISHED">Publicada</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-5 flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = counts[tab.key];
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
              {count > 0 && <span className="rounded-full bg-muted px-1.5 text-[10px]">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-5 min-h-[200px]">
        {activeTab === "researches" && (
          <div className="space-y-2">
            {sortedResearches.length === 0 && <EmptyState label="investigaciones" />}
            {sortedResearches.map(r => (
              <KnowledgeCard key={r.id} note={r} icon={FlaskConical} iconColor="text-green-600" onClick={() => onSelectNote?.(r.id)} />
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-2">
            {sortedNotes.length === 0 && <EmptyState label="notas" />}
            {sortedNotes.map(n => (
              <KnowledgeCard key={n.id} note={n} icon={FileText} iconColor="text-indigo-600" onClick={() => onSelectNote?.(n.id)} />
            ))}
          </div>
        )}

        {activeTab === "checklists" && (
          <div className="space-y-2">
            {(ecosystem.checklists || []).length === 0 && <EmptyState label="checklists" />}
            {(ecosystem.checklists || []).map(n => (
              <KnowledgeCard key={n.id} note={n} icon={ListChecks} iconColor="text-emerald-600" onClick={() => onSelectNote?.(n.id)} />
            ))}
          </div>
        )}

        {activeTab === "guides" && (
          <div className="space-y-2">
            {(ecosystem.guides || []).length === 0 && <EmptyState label="guías" />}
            {(ecosystem.guides || []).map(n => (
              <KnowledgeCard key={n.id} note={n} icon={BookOpen} iconColor="text-blue-600" onClick={() => onSelectNote?.(n.id)} />
            ))}
          </div>
        )}

        {activeTab === "journals" && (
          <div className="space-y-2">
            {(ecosystem.journals || []).length === 0 && <EmptyState label="bitácoras" />}
            {(ecosystem.journals || []).map(n => (
              <KnowledgeCard key={n.id} note={n} icon={BookOpen} iconColor="text-orange-600" onClick={() => onSelectNote?.(n.id)} />
            ))}
          </div>
        )}

        {activeTab === "recipes" && (
          <div className="space-y-2">
            {(ecosystem.recipes || []).length === 0 && <EmptyState label="recetas" />}
            {(ecosystem.recipes || []).map(n => (
              <KnowledgeCard key={n.id} note={n} icon={UtensilsCrossed} iconColor="text-rose-600" onClick={() => onSelectNote?.(n.id)} />
            ))}
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-2">
            {(ecosystem.resources || []).length === 0 && <EmptyState label="recursos" />}
            {(ecosystem.resources || []).map(n => (
              <KnowledgeCard key={n.id} note={n} icon={Link2} iconColor="text-cyan-600" onClick={() => onSelectNote?.(n.id)} />
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-2">
            {ecosystem.tasks.length === 0 && <EmptyState label="tareas" />}
            {ecosystem.tasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                <CheckSquare className={`h-4 w-4 shrink-0 ${t.status === "COMPLETED" ? "text-green-600" : "text-blue-600"}`} />
                <p className="text-sm flex-1 truncate">{t.name}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  t.priority === "HIGH" ? "bg-red-100 text-red-700" : t.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                }`}>{t.priority}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-2">
            {ecosystem.projects.length === 0 && <EmptyState label="proyectos" />}
            {ecosystem.projects.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                <FolderOpen className="h-4 w-4 text-amber-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  {p.description && <p className="text-[10px] text-muted-foreground truncate">{p.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "routines" && (
          <div className="space-y-2">
            {ecosystem.routines.length === 0 && <EmptyState label="rutinas" />}
            {ecosystem.routines.map(r => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                <Activity className={`h-4 w-4 shrink-0 ${r.isActive ? "text-purple-600" : "text-gray-400"}`} />
                <p className="text-sm flex-1 truncate">{r.name}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">{r.category.toLowerCase()}</span>
                {r.isActive && <span className="h-2 w-2 rounded-full bg-green-500" title="Activa" />}
              </div>
            ))}
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="space-y-2">
            {ecosystem.meetings.length === 0 && <EmptyState label="reuniones" />}
            {ecosystem.meetings.map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                <Video className="h-4 w-4 text-red-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(m.scheduledAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "learnings" && (
          <div className="space-y-2">
            {ecosystem.learnings.length === 0 && <EmptyState label="aprendizajes" />}
            {ecosystem.learnings.map(l => (
              <div key={l.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                <Lightbulb className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{l.title}</p>
                  {l.content && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{l.content.slice(0, 120)}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(l.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Card with connection indicators */
function KnowledgeCard({ note, icon: Icon, iconColor, onClick }: {
  note: KnowledgeNote;
  icon: React.ElementType;
  iconColor: string;
  onClick?: () => void;
}) {
  const edgeCount = (note.edgesFrom?.length || 0) + (note.edgesTo?.length || 0);
  return (
    <div onClick={onClick} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors cursor-pointer group">
      <Icon className={`h-4 w-4 ${iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{note.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={note.status} />
          <span className="text-[10px] text-muted-foreground">{new Date(note.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
          {note.tags.length > 0 && <span className="text-[10px] text-muted-foreground">{note.tags.length} tags</span>}
        </div>
      </div>
      {/* Connection indicators */}
      <div className="flex items-center gap-1.5 shrink-0">
        {edgeCount > 0 && (
          <span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary font-medium" title={`${edgeCount} conexiones`}>
            <Link2 className="h-2.5 w-2.5" />{edgeCount}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-600",
    PENDING: "bg-gray-100 text-gray-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    SCHEDULED: "bg-purple-100 text-purple-700",
    CANCELLED: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    DRAFT: "Borrador",
    COMPLETED: "Completada",
    PUBLISHED: "Publicada",
    ARCHIVED: "Archivada",
    PENDING: "Pendiente",
    IN_PROGRESS: "En progreso",
    SCHEDULED: "Programada",
    CANCELLED: "Cancelada",
  };
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">No hay {label} vinculadas a este tema aún.</p>;
}
