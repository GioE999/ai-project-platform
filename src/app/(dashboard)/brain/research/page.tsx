"use client";
import { useState, useEffect } from "react";
import { Globe, Search, X, ExternalLink, FileText, Loader2, Clock, BookOpen, Sparkles, ChevronDown, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchSource {
  title: string;
  url: string;
}

interface ResearchResult {
  id: string;
  query: string;
  status: "processing" | "completed" | "draft" | "published";
  title: string;
  overview: string;
  fullContent: string;
  sources: ResearchSource[];
  topic: string;
  timestamp: string;
  level: "surface" | "moderate" | "deep";
  hypothesis: string;
  impactNote: string;
  relatedTopics: string[];
  learningsGenerated: { content: string; date: string }[];
}

const topicOptions = ["Salud & Bienestar", "DevOps", "Productividad", "Arquitectura", "UX/UI", "IA & ML"];
const projectOptions = ["MVP Plataforma v1.0", "Integración Google Meet", "Personal Growth"];

const initialResearches: ResearchResult[] = [
  {
    id: "res-1",
    query: "Entrenamiento de fuerza 3x semana para principiantes",
    status: "completed",
    title: "Entrenamiento de fuerza 3x semana para principiantes",
    overview: "El entrenamiento de fuerza tres veces por semana es ideal para principiantes ya que permite suficiente recuperación muscular entre sesiones. Los programas más recomendados se basan en movimientos compuestos como sentadillas, press de banca y peso muerto. La progresión de carga debe ser gradual, aumentando entre 2-5% semanal para evitar lesiones.",
    fullContent: `## Entrenamiento de fuerza 3x semana para principiantes\n\n### Principios fundamentales\n\nEl entrenamiento de fuerza tres veces por semana es la frecuencia óptima para principiantes porque permite 48 horas de recuperación entre sesiones.\n\n### Programas recomendados\n\n**Starting Strength (Mark Rippetoe)**\n- Enfoque en 5 movimientos básicos\n- Progresión lineal simple\n- 3 sets x 5 reps\n\n**StrongLifts 5x5**\n- Alterna entre Workout A y B\n- 5 sets x 5 reps\n- Incremento de 2.5kg por sesión\n\n### Estructura recomendada\n\n**Día A:**\n- Sentadillas 3x5\n- Press banca 3x5\n- Remo con barra 3x5\n\n**Día B:**\n- Sentadillas 3x5\n- Press militar 3x5\n- Peso muerto 1x5\n\n### Consideraciones para principiantes\n\n1. **Técnica primero**: Aprende la forma correcta con peso ligero\n2. **Calentamiento**: 5-10 min de cardio suave + movilidad articular\n3. **Recuperación**: Dormir 7-8 horas y consumir proteína suficiente (1.6-2.2g/kg)\n4. **Progresión**: Aumentar peso solo cuando completes todas las reps con buena técnica`,
    sources: [
      { title: "Starting Strength - Beginner Program", url: "https://startingstrength.com/get-started" },
      { title: "NSCA Guidelines for Beginners", url: "https://www.nsca.com/education/articles" },
      { title: "StrongLifts 5x5 Program", url: "https://stronglifts.com/5x5" },
    ],
    topic: "Salud & Bienestar",
    timestamp: "2025-01-23T14:30:00Z",
    level: "moderate",
    hypothesis: "Un programa de fuerza 3x/semana con progresión lineal es suficiente para principiantes",
    impactNote: "Aplicable directamente a mi rutina personal de ejercicio",
    relatedTopics: ["Salud & Bienestar", "Productividad"],
    learningsGenerated: [
      { content: "La progresión lineal (2.5kg/sesión) es sostenible durante 3-6 meses para principiantes", date: "2025-01-23" },
      { content: "Los movimientos compuestos activan más masa muscular que los aislados", date: "2025-01-23" },
      { content: "48h de recuperación entre sesiones es el mínimo para hipertrofia", date: "2025-01-23" },
      { content: "La proteína post-entreno tiene una ventana de 2h, no 30min como se creía", date: "2025-01-23" },
    ],
  },
  {
    id: "res-2",
    query: "Mejores prácticas de CI/CD para monorepos",
    status: "published",
    title: "Mejores prácticas de CI/CD para monorepos",
    overview: "Los monorepos requieren estrategias de CI/CD específicas para evitar builds innecesarios y mantener tiempos de pipeline cortos. Las herramientas como Turborepo, Nx y Bazel permiten ejecutar solo los targets afectados por cada cambio.",
    fullContent: `## Mejores prácticas de CI/CD para monorepos\n\n### Desafíos principales\n\nLos monorepos presentan desafíos únicos para CI/CD:\n- Builds completos pueden tomar mucho tiempo\n- No todos los cambios afectan todos los paquetes\n- Las dependencias entre paquetes deben estar bien definidas\n\n### Herramientas recomendadas\n\n**Turborepo**\n- Remote caching integrado\n- Ejecución paralela de tasks\n- Detección automática de paquetes afectados\n\n**Nx**\n- Computation caching avanzado\n- Affected command para ejecutar solo lo necesario\n- Plugins para frameworks populares\n\n### Estrategias clave\n\n1. **Affected-only builds**: Ejecuta pipelines solo para paquetes modificados\n2. **Remote caching**: Comparte cache de builds entre desarrolladores y CI\n3. **Paralelización**: Ejecuta tests y builds independientes en paralelo\n4. **Pipeline as code**: Define pipelines en archivos del repo\n5. **Changesets**: Usa herramientas como changesets para versioning automático`,
    sources: [
      { title: "Turborepo - Monorepo Build System", url: "https://turbo.build/repo/docs" },
      { title: "Nx - Smart Monorepos", url: "https://nx.dev/concepts/affected" },
      { title: "GitHub Blog - CI/CD for Monorepos", url: "https://github.blog/engineering/ci-cd" },
    ],
    topic: "DevOps",
    timestamp: "2025-01-22T10:15:00Z",
    level: "deep",
    hypothesis: "Turborepo + remote caching puede reducir tiempos de CI en >50% para monorepos medianos",
    impactNote: "Implementar en el proyecto actual para reducir tiempos de deploy",
    relatedTopics: ["DevOps", "Arquitectura"],
    learningsGenerated: [
      { content: "Turborepo reduce builds un 70% con remote caching habilitado", date: "2025-01-22" },
      { content: "Los affected builds solo procesan paquetes con cambios en su grafo de dependencias", date: "2025-01-22" },
      { content: "Changesets automatiza versioning y changelogs en monorepos", date: "2025-01-22" },
    ],
  },
  {
    id: "res-3",
    query: "Técnicas de productividad para desarrolladores remotos",
    status: "completed",
    title: "Técnicas de productividad para desarrolladores remotos",
    overview: "Los desarrolladores remotos enfrentan desafíos únicos como aislamiento, distracciones del hogar y dificultad para establecer límites. Las técnicas más efectivas combinan time-blocking, rituales de transición y comunicación asíncrona intencional.",
    fullContent: `## Técnicas de productividad para desarrolladores remotos\n\n### El desafío del trabajo remoto\n\nTrabajar desde casa presenta ventajas pero también desafíos específicos:\n- Falta de separación entre trabajo y vida personal\n- Distracciones del entorno doméstico\n- Reuniones excesivas que fragmentan el tiempo\n\n### Técnicas probadas\n\n**1. Time-blocking estricto**\n- Bloques de 2-3 horas para deep work\n- No reuniones antes de las 11am\n- Bloque fijo para comunicación asíncrona\n\n**2. Rituales de transición**\n- "Commute simulado": caminata de 10 min\n- Cambio de ropa como señal mental\n- Apagar el monitor al terminar\n\n**3. Comunicación asíncrona intencional**\n- Documenta decisiones por escrito\n- Usa Loom para explicaciones complejas\n- Responde en lotes, no en tiempo real\n\n**4. Pomodoro adaptado**\n- 50 min trabajo / 10 min descanso\n- Usa apps como Focus Bear o Raycast`,
    sources: [
      { title: "Cal Newport - Deep Work for Remote Developers", url: "https://calnewport.com/deep-work" },
      { title: "Basecamp - Guide to Internal Communication", url: "https://basecamp.com/guides" },
      { title: "Huberman Lab - Optimizing Workspace", url: "https://hubermanlab.com/workspace" },
    ],
    topic: "Productividad",
    timestamp: "2025-01-21T09:45:00Z",
    level: "moderate",
    hypothesis: "Time-blocking + rituales de transición puede aumentar las horas de deep work de 2 a 4 diarias",
    impactNote: "Implementar en mi rutina diaria para medir impacto en output",
    relatedTopics: ["Productividad", "Salud & Bienestar"],
    learningsGenerated: [
      { content: "El time-blocking de 90 minutos maximiza el estado de flow", date: "2025-01-21" },
      { content: "Los rituales de transición ayudan a separar contextos mentales", date: "2025-01-21" },
      { content: "Batch processing de comunicación reduce context switching un 40%", date: "2025-01-21" },
    ],
  },
  {
    id: "res-4",
    query: "Patrones de diseño para microservicios event-driven",
    status: "processing",
    title: "Patrones de diseño para microservicios event-driven",
    overview: "",
    fullContent: "",
    sources: [],
    topic: "Arquitectura",
    timestamp: "2025-01-24T16:00:00Z",
    level: "deep",
    hypothesis: "Event sourcing + CQRS es más escalable que REST para comunicación entre servicios",
    impactNote: "",
    relatedTopics: ["Arquitectura", "DevOps"],
    learningsGenerated: [],
  },
];

const topicColors: Record<string, string> = {
  "Salud & Bienestar": "bg-green-100 text-green-800",
  "DevOps": "bg-blue-100 text-blue-800",
  "Productividad": "bg-purple-100 text-purple-600",
  "Arquitectura": "bg-amber-100 text-amber-600",
  "UX/UI": "bg-red-100 text-red-800",
  "IA & ML": "bg-yellow-100 text-yellow-800",
};

export default function ResearchPage() {
  const [researches, setResearches] = useState<ResearchResult[]>(initialResearches);
  const [selectedResearch, setSelectedResearch] = useState<ResearchResult | null>(null);
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hypothesis, setHypothesis] = useState("");
  const [level, setLevel] = useState<"surface" | "moderate" | "deep">("moderate");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [reflection, setReflection] = useState("");
  const [saveOption, setSaveOption] = useState("note");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedResearch(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const newResearch: ResearchResult = {
      id: crypto.randomUUID(),
      query: query.trim(),
      status: "processing",
      title: query.trim(),
      overview: "",
      fullContent: "",
      sources: [],
      topic: selectedTopic || "General",
      timestamp: new Date().toISOString(),
      level,
      hypothesis: hypothesis.trim(),
      impactNote: "",
      relatedTopics: selectedTopic ? [selectedTopic] : [],
      learningsGenerated: [],
    };
    setResearches([newResearch, ...researches]);
    setQuery("");
    setSelectedTopic("");
    setSelectedProject("");
    setHypothesis("");
    setLevel("moderate");
    setShowAdvanced(false);
  }

  const activeResearches = researches.filter(r => r.status === "processing");
  const completedResearches = researches.filter(r => r.status !== "processing").filter(r => {
    const matchTopic = filterTopic === "all" || r.topic === filterTopic;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchTopic && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Investigación Externa
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Investiga cualquier tema con Perplexity Pro y guarda los resultados en tu Second Brain
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6 rounded-xl border bg-card p-4 space-y-3">
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="¿Qué quieres investigar? (ej: Mejores frameworks de testing para React en 2025)"
          className="w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />
        <div className="flex flex-wrap items-center gap-3">
          <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2 text-sm">
            <option value="">Tema (opcional)</option>
            {topicOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2 text-sm">
            <option value="">Proyecto (opcional)</option>
            {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-3.5 w-3.5" />
            Opciones avanzadas
            <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
          <button type="submit" disabled={!query.trim()} className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <Search className="h-4 w-4" />
            Investigar
          </button>
        </div>
        {/* Advanced Options */}
        {showAdvanced && (
          <div className="border-t pt-3 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Hipótesis inicial</label>
              <input type="text" value={hypothesis} onChange={e => setHypothesis(e.target.value)} placeholder="¿Qué crees que vas a encontrar?" className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nivel de profundidad</label>
              <select value={level} onChange={e => setLevel(e.target.value as "surface" | "moderate" | "deep")} className="rounded-lg border bg-transparent px-3 py-2 text-sm">
                <option value="surface">Superficial - Visión general rápida</option>
                <option value="moderate">Moderado - Balance entre amplitud y profundidad</option>
                <option value="deep">Profundo - Análisis exhaustivo con múltiples fuentes</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Active Researches */}
      {activeResearches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Investigaciones en curso</h2>
          <div className="space-y-2">
            {activeResearches.map(research => (
              <div key={research.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{research.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Procesando con Perplexity Pro...</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${topicColors[research.topic] || "bg-gray-100 text-gray-800"}`}>{research.topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterTopic("all")} className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${filterTopic === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>Todos</button>
          {topicOptions.map(t => (
            <button key={t} onClick={() => setFilterTopic(t)} className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${filterTopic === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>{t}</button>
          ))}
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border bg-transparent px-2.5 py-1 text-xs">
          <option value="all">Todos los estados</option>
          <option value="completed">Completada</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicada</option>
        </select>
      </div>

      {/* Completed Researches */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Investigaciones completadas ({completedResearches.length})
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {completedResearches.map(research => (
            <button key={research.id} onClick={() => setSelectedResearch(research)} className="rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{research.title}</h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${topicColors[research.topic] || "bg-gray-100 text-gray-800"}`}>{research.topic}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{research.overview}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><ExternalLink className="h-3 w-3" />{research.sources.length} fuentes</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${research.status === "published" ? "bg-green-100 text-green-800" : research.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>{research.status === "published" ? "Publicada" : research.status === "draft" ? "Borrador" : "Completada"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(research.timestamp).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedResearch && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={() => setSelectedResearch(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col border-l bg-background shadow-2xl">
              {/* Panel Header */}
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${topicColors[selectedResearch.topic] || "bg-gray-100 text-gray-800"}`}>{selectedResearch.topic}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">{selectedResearch.level}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{selectedResearch.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedResearch.timestamp).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={() => setSelectedResearch(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto p-5 space-y-5">
                {/* Overview */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Resumen</p>
                  <p className="text-sm leading-relaxed">{selectedResearch.overview}</p>
                </div>

                {/* Hypothesis */}
                {selectedResearch.hypothesis && (
                  <div className="rounded-xl border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">💡 Hipótesis</p>
                    <p className="text-sm italic">{selectedResearch.hypothesis}</p>
                  </div>
                )}

                {/* Full Content */}
                <div className="prose prose-sm max-w-none">
                  {selectedResearch.fullContent.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) return <h2 key={i} className="text-base font-bold mt-4 mb-2">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold mt-3 mb-1.5">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-sm font-semibold mt-2">{line.replace(/\*\*/g, "")}</p>;
                    if (line.startsWith("- ")) return <li key={i} className="text-sm text-muted-foreground ml-4 list-disc">{line.replace("- ", "")}</li>;
                    if (/^\d+\.\s/.test(line)) return <li key={i} className="text-sm text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>;
                    if (line.startsWith("```")) return <div key={i} className="rounded bg-muted px-3 py-1 text-xs font-mono my-1">{line.replace(/```\w*/, "")}</div>;
                    if (line.trim() === "") return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm leading-relaxed text-foreground/80">{line}</p>;
                  })}
                </div>

                {/* Sources */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fuentes ({selectedResearch.sources.length})</p>
                  <div className="space-y-2">
                    {selectedResearch.sources.map((source, i) => (
                      <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors">
                        <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Learnings Generated */}
                {selectedResearch.learningsGenerated.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sparkles className="h-3 w-3" />Aprendizajes generados ({selectedResearch.learningsGenerated.length})</p>
                    <div className="space-y-1.5">
                      {selectedResearch.learningsGenerated.map((l, i) => (
                        <div key={i} className="rounded-lg border p-2.5 flex items-start gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm">{l.content}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{l.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reflexión personal */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Reflexión personal</p>
                  <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="¿Qué significa esto para ti? ¿Cómo lo puedes aplicar?" className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
                </div>
              </div>

              {/* Panel Footer */}
              <div className="border-t p-4 flex flex-col gap-2">
                {saveSuccess && (
                  <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
                    ✓ {saveSuccess}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <select value={saveOption} onChange={e => setSaveOption(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-sm">
                    <option value="note">Guardar como Nota</option>
                    <option value="draft">Guardar como Borrador</option>
                    <option value="publish">Publicar en Brain</option>
                  </select>
                  <button
                    disabled={saving}
                    onClick={async () => {
                      if (!selectedResearch) return;
                      setSaving(true);
                      setSaveSuccess(null);
                      try {
                        const content = [selectedResearch.fullContent, reflection ? `\n\n## Reflexión\n\n${reflection}` : ""].join("");
                        await fetch("/api/knowledge", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: selectedResearch.title,
                            content,
                            type: saveOption === "draft" ? "RESEARCH_DRAFT" : "RESEARCH",
                            status: saveOption === "publish" ? "PUBLISHED" : saveOption === "draft" ? "DRAFT" : "COMPLETED",
                            tags: selectedResearch.relatedTopics,
                            metadata: {
                              overview: selectedResearch.overview,
                              sources: selectedResearch.sources,
                              hypothesis: selectedResearch.hypothesis,
                              level: selectedResearch.level,
                              learnings: selectedResearch.learningsGenerated.map(l => l.content),
                              sourceResearchId: selectedResearch.id,
                            },
                          }),
                        });
                        // Update local status
                        const newStatus = saveOption === "publish" ? "published" : saveOption === "draft" ? "draft" : "completed";
                        setResearches(prev => prev.map(r => r.id === selectedResearch.id ? { ...r, status: newStatus as any } : r));
                        setSaveSuccess(
                          saveOption === "publish" ? "Publicada en Second Brain" :
                          saveOption === "draft" ? "Guardada como borrador" :
                          "Guardada como nota en Brain"
                        );
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    {saving ? "Guardando..." : saveOption === "note" ? "Guardar como Nota" : saveOption === "draft" ? "Guardar Borrador" : "Publicar"}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
