"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Brain, Plus, Search, Lightbulb, FlaskConical, ListChecks, Sparkles } from "lucide-react";
import { HYPERBRAIN_TOPICS_SEED, type SeedTopic } from "@/lib/brain/seed";
import { TopicWorkspace } from "@/components/brain/TopicWorkspace";
import { QuickCaptureBar } from "@/components/brain/QuickCaptureBar";
import { CommandPalette } from "@/components/brain/CommandPalette";

const lifeAreaLabels: Record<string, string> = {
  SCIENTIFIC: "Científico",
  TECH: "Tecnología",
  CULTURAL: "Cultural",
  PERSONAL: "Personal",
  PHILOSOPHICAL: "Filosófico",
  ECONOMIC: "Económico",
};

export default function BrainPage() {
  const searchParams = useSearchParams();
  const [selectedTopic, setSelectedTopic] = useState<SeedTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomain, setFilterDomain] = useState<string>("all");

  // Handle ?topic= query param from external links (e.g. routines)
  useEffect(() => {
    const topicSlug = searchParams.get("topic");
    if (topicSlug && !selectedTopic) {
      const found = HYPERBRAIN_TOPICS_SEED.find(t => t.slug === topicSlug);
      if (found) setSelectedTopic(found);
    }
  }, [searchParams, selectedTopic]);

  const domains = useMemo(() => {
    const set = new Set(HYPERBRAIN_TOPICS_SEED.map(t => t.lifeArea));
    return Array.from(set);
  }, []);

  const filteredTopics = useMemo(() => {
    let items = HYPERBRAIN_TOPICS_SEED;
    if (filterDomain !== "all") items = items.filter(t => t.lifeArea === filterDomain);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(t => t.name.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    return items;
  }, [filterDomain, searchQuery]);

  function handleCommand(action: string, payload?: any) {
    if (action === "new-research") window.location.href = "/brain/research";
    if (action === "open-graph") window.location.href = "/brain/graph";
  }

  // Keyboard: Escape to deselect
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && selectedTopic) setSelectedTopic(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedTopic]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">HyperBrain</h1>
            <p className="text-xs text-muted-foreground">
              {HYPERBRAIN_TOPICS_SEED.length} temas · {HYPERBRAIN_TOPICS_SEED.reduce((a, t) => a + t.initialNotes.length, 0)} notas · {HYPERBRAIN_TOPICS_SEED.reduce((a, t) => a + t.initialLearnings.length, 0)} aprendizajes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="hidden sm:inline-flex rounded border bg-muted px-2 py-1 text-[10px] text-muted-foreground">⌘K</kbd>
        </div>
      </div>

      {/* Quick Capture Bar */}
      <QuickCaptureBar activeTopic={selectedTopic?.name} />

      {/* Topics Index */}
      {!selectedTopic && (
        <section className="space-y-4">
          {/* Search + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar tema..."
                className="w-full rounded-lg border bg-transparent pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setFilterDomain("all")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterDomain === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
                Todos
              </button>
              {domains.map(d => (
                <button key={d} onClick={() => setFilterDomain(d)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterDomain === d ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
                  {lifeAreaLabels[d] || d}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTopics.map(topic => (
              <button
                key={topic.slug}
                onClick={() => setSelectedTopic(topic)}
                className="rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{topic.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>{topic.initialNotes.length} notas</span>
                      <span>{topic.initialLearnings.length} aprendizajes</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {topic.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">No se encontraron temas para "{searchQuery}"</p>
          )}
        </section>
      )}

      {/* Topic Workspace (when selected) */}
      {selectedTopic && (
        <section>
          {/* Back button */}
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors mb-4"
          >
            <span className="text-lg">{selectedTopic.icon}</span>
            {selectedTopic.name}
            <span className="text-xs opacity-60 ml-1">✕ Cerrar</span>
          </button>

          <TopicWorkspace topic={selectedTopic} />
        </section>
      )}

      {/* Command Palette */}
      <CommandPalette
        onAction={handleCommand}
        topicName={selectedTopic?.name}
        notes={selectedTopic?.initialNotes.map((n, i) => ({ id: `${selectedTopic.slug}-${i}`, title: n.title })) || []}
      />
    </div>
  );
}
