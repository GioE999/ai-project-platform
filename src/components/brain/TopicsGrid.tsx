"use client";
import { FileText, CheckSquare, Video, FlaskConical, FolderOpen, Activity, Lightbulb, Plus, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Topic } from "@/types/topics";

interface TopicsGridProps {
  topics: Topic[];
  selectedTopicId: string | null;
  onSelectTopic: (topic: Topic) => void;
  onCreateTopic?: (data: { name: string; icon: string }) => void;
}

export function TopicsGrid({ topics, selectedTopicId, onSelectTopic, onCreateTopic }: TopicsGridProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "📌" });
  const [collapsed, setCollapsed] = useState(false);

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onCreateTopic?.({ name: form.name, icon: form.icon });
    setForm({ name: "", icon: "📌" });
    setShowForm(false);
  }

  // When a topic is selected, show compact mode (just the selected chip + deselect)
  if (selectedTopic) {
    return (
      <section>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTopic(selectedTopic)}
            className="flex items-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="text-lg">{selectedTopic.icon || "📌"}</span>
            {selectedTopic.name}
            <X className="h-3.5 w-3.5 ml-1 opacity-60" />
          </button>
          <span className="text-xs text-muted-foreground">
            Tema seleccionado · Clic para volver a todos los temas
          </span>
        </div>
      </section>
    );
  }

  // Full grid mode (no topic selected)
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Temas</h2>
          <button onClick={() => setCollapsed(!collapsed)} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
          </button>
          <p className="text-xs text-muted-foreground">{topics.length} temas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? "Cancelar" : "Nuevo"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 flex gap-2 rounded-lg border bg-card p-3">
          <input type="text" placeholder="Emoji" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-12 rounded border bg-transparent px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Nombre del tema" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="flex-1 rounded border bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" className="rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">Crear</button>
        </form>
      )}

      {!collapsed && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="rounded-xl border p-3 text-left transition-all hover:shadow-md hover:border-primary/30 group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{topic.icon || "📌"}</span>
                <h3 className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{topic.name}</h3>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                {(topic.noteCount || 0) > 0 && <span className="flex items-center gap-0.5"><FileText className="h-2.5 w-2.5" />{topic.noteCount}</span>}
                {(topic.researchCount || 0) > 0 && <span className="flex items-center gap-0.5"><FlaskConical className="h-2.5 w-2.5" />{topic.researchCount}</span>}
                {(topic.taskCount || 0) > 0 && <span className="flex items-center gap-0.5"><CheckSquare className="h-2.5 w-2.5" />{topic.taskCount}</span>}
                {(topic.projectCount || 0) > 0 && <span className="flex items-center gap-0.5"><FolderOpen className="h-2.5 w-2.5" />{topic.projectCount}</span>}
                {(topic.routineCount || 0) > 0 && <span className="flex items-center gap-0.5"><Activity className="h-2.5 w-2.5" />{topic.routineCount}</span>}
                {(topic.meetingCount || 0) > 0 && <span className="flex items-center gap-0.5"><Video className="h-2.5 w-2.5" />{topic.meetingCount}</span>}
                {(topic.learningCount || 0) > 0 && <span className="flex items-center gap-0.5"><Lightbulb className="h-2.5 w-2.5" />{topic.learningCount}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
