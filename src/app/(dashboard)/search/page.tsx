"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, FileText, CheckSquare, Video, FolderOpen, X, Calendar, Flag, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type EntityType = "note" | "task" | "meeting" | "project";

interface SearchResult {
  id: string;
  entityType: EntityType;
  title: string;
  score: number;
  snippet: string;
  detail: NoteDetail | TaskDetail | MeetingDetail | ProjectDetail;
}

interface NoteDetail {
  type: "note";
  content: string;
  updatedAt: string;
}

interface TaskDetail {
  type: "task";
  name: string;
  description: string;
  status: string;
  priority: string;
  project?: string;
}

interface MeetingDetail {
  type: "meeting";
  title: string;
  date: string;
  duration: number;
  summary?: string;
  project?: string;
}

interface ProjectDetail {
  type: "project";
  name: string;
  description: string;
  taskCount: number;
  progress: number;
}

const allResults: SearchResult[] = [
  { id: "r1", entityType: "note", title: "Arquitectura del Sistema", score: 0.97, snippet: "El sistema sigue una arquitectura de microservicios con comunicacion asincrona via eventos...", detail: { type: "note", content: "## Vision General\n\nEl sistema sigue una arquitectura de [[Microservicios]] con comunicacion asincrona via eventos.\n\nBase de datos principal: [[PostgreSQL]] con extensiones para busqueda vectorial.\n\nEl [[API Gateway]] maneja autenticacion, rate limiting y routing.", updatedAt: "2025-01-10" } },
  { id: "r2", entityType: "note", title: "Microservicios", score: 0.91, snippet: "Patron de microservicios con API Gateway y comunicacion por eventos entre servicios...", detail: { type: "note", content: "## Patron de Microservicios\n\nCada servicio tiene su propia base de datos.\n\nInfraestructura: [[Docker]], [[Kubernetes]], [[API Gateway]].\n\nServicios: Auth, Task, Notification, Search.", updatedAt: "2025-01-09" } },
  { id: "r3", entityType: "note", title: "PostgreSQL", score: 0.88, snippet: "PostgreSQL como DB principal con pgvector para embeddings de busqueda semantica...", detail: { type: "note", content: "## PostgreSQL como DB Principal\n\nUsamos [[pgvector]] para embeddings (1536 dims).\nORM: [[Prisma]] con migraciones automaticas.\n\nPool: 20 conexiones, 2 replicas de lectura.", updatedAt: "2025-01-08" } },
  { id: "r4", entityType: "task", title: "Disenar wireframes del dashboard", score: 0.82, snippet: "Crear mockups en Figma para la nueva arquitectura de componentes del dashboard...", detail: { type: "task", name: "Disenar wireframes del dashboard", description: "Crear mockups de alta fidelidad en Figma para todas las vistas del dashboard, incluyendo responsive mobile.", status: "Completado", priority: "Alta", project: "MVP Plataforma" } },
  { id: "r5", entityType: "meeting", title: "Review de Diseno UI", score: 0.78, snippet: "Discusion sobre la arquitectura visual y sistema de diseno para la plataforma...", detail: { type: "meeting", title: "Review de Diseno UI", date: "2025-01-15 15:00", duration: 30, project: "MVP Plataforma" } },
  { id: "r6", entityType: "project", title: "MVP Plataforma v1.0", score: 0.76, snippet: "Primera version del producto con funcionalidades core de gestion de tareas y proyectos...", detail: { type: "project", name: "MVP Plataforma v1.0", description: "Primera version del producto con funcionalidades core de gestion de tareas, proyectos y autenticacion.", taskCount: 6, progress: 67 } },
  { id: "r7", entityType: "task", title: "Implementar autenticacion OAuth2", score: 0.74, snippet: "Integrar con Google y GitHub para autenticacion segura de usuarios...", detail: { type: "task", name: "Implementar autenticacion OAuth2", description: "Integrar con Google y GitHub como providers. Incluir refresh tokens y session management.", status: "En progreso", priority: "Alta", project: "MVP Plataforma" } },
  { id: "r8", entityType: "note", title: "Guia de Onboarding", score: 0.72, snippet: "Onboarding para nuevos desarrolladores: entender la arquitectura del sistema...", detail: { type: "note", content: "## Onboarding para Nuevos Desarrolladores\n\n### Paso 1: Entender la [[Arquitectura del Sistema]]\n### Paso 2: Setup con [[Microservicios]] y Docker\n### Paso 3: Schema de [[PostgreSQL]]", updatedAt: "2025-01-05" } },
  { id: "r9", entityType: "meeting", title: "Kickoff Integracion Meet", score: 0.69, snippet: "Definicion del alcance de la integracion con Google Meet y calendar sync...", detail: { type: "meeting", title: "Kickoff Integracion Meet", date: "2025-01-02 14:00", duration: 60, summary: "Se definio el alcance de la integracion con Google Meet. Enfoque incremental comenzando con calendar sync.", project: "Integracion Google Meet" } },
  { id: "r10", entityType: "task", title: "Configurar pipeline CI/CD", score: 0.66, snippet: "GitHub Actions para deploy automatico y testing continuo en la arquitectura...", detail: { type: "task", name: "Configurar pipeline CI/CD", description: "GitHub Actions para deploy automatico a staging y produccion con tests y linting.", status: "Pendiente", priority: "Media", project: "MVP Plataforma" } },
  { id: "r11", entityType: "note", title: "Ideas de Producto", score: 0.63, snippet: "Brainstorming basado en UX Research: dashboard personalizable, roadmap visual...", detail: { type: "note", content: "## Brainstorming Q1 2025\n\nBasado en [[UX Research]] del Q4:\n- Dashboard personalizable\n- [[Roadmap]] visual\n- AI-powered prioritization\n- [[Integraciones]] con Slack, GitHub, Figma", updatedAt: "2025-01-06" } },
  { id: "r12", entityType: "task", title: "Optimizar queries de base de datos", score: 0.61, snippet: "Agregar indices y revisar query plans para PostgreSQL en produccion...", detail: { type: "task", name: "Optimizar queries de base de datos", description: "Agregar indices compuestos para queries frecuentes. Revisar query plans con EXPLAIN ANALYZE.", status: "Pendiente", priority: "Baja" } },
  { id: "r13", entityType: "meeting", title: "Retrospectiva Sprint 11", score: 0.58, snippet: "Revision de logros del sprint 11, identificacion de cuellos de botella...", detail: { type: "meeting", title: "Retrospectiva Sprint 11", date: "2025-01-07 11:00", duration: 45, summary: "Se completaron 8 de 10 tareas. Cuellos de botella en code review. Decisiones: limitar PRs a 400 lineas.", project: "MVP Plataforma" } },
  { id: "r14", entityType: "project", title: "Integracion Google Meet", score: 0.55, snippet: "Conectar con Google Calendar y Meet para reuniones automaticas y notas...", detail: { type: "project", name: "Integracion Google Meet", description: "Conectar con Google Calendar y Meet para crear reuniones automaticas, generar notas y extraer action items.", taskCount: 4, progress: 25 } },
  { id: "r15", entityType: "task", title: "Escribir documentacion de API", score: 0.52, snippet: "Swagger/OpenAPI specs para todos los endpoints REST del backend...", detail: { type: "task", name: "Escribir documentacion de API", description: "Generar Swagger/OpenAPI specs para todos los endpoints REST del backend.", status: "Revision", priority: "Media", project: "MVP Plataforma" } },
];

const typeConfig: Record<EntityType, { label: string; icon: typeof FileText; colors: string }> = {
  note: { label: "Nota", icon: FileText, colors: "bg-purple-100 text-purple-600" },
  task: { label: "Tarea", icon: CheckSquare, colors: "bg-blue-100 text-blue-800" },
  meeting: { label: "Reunion", icon: Video, colors: "bg-amber-100 text-amber-600" },
  project: { label: "Proyecto", icon: FolderOpen, colors: "bg-green-100 text-green-800" },
};

type FilterType = "all" | EntityType;

function renderNoteContent(content: string): string {
  return content
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="text-primary font-medium bg-primary/10 px-1 rounded">$1</span>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-3 mb-1.5">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-2 mb-1">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm">$1</li>')
    .replace(/\n/g, '<br/>');
}

export default function SearchPage() {
  const [query, setQuery] = useState("arquitectura");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const filteredResults = useMemo(() => {
    let results = allResults;
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(r => r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q));
    }
    if (filter !== "all") {
      results = results.filter(r => r.entityType === filter);
    }
    return results.sort((a, b) => b.score - a.score);
  }, [query, filter]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedResult(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "Todos" },
    { id: "task", label: "Tareas" },
    { id: "note", label: "Notas" },
    { id: "meeting", label: "Reuniones" },
    { id: "project", label: "Proyectos" },
  ];

  const statusColors: Record<string, string> = {
    "Completado": "bg-green-100 text-green-800",
    "En progreso": "bg-blue-100 text-blue-800",
    "Pendiente": "bg-gray-100 text-gray-800",
    "Bloqueado": "bg-red-100 text-red-800",
    "Revision": "bg-yellow-100 text-yellow-800",
  };

  const priorityColors: Record<string, string> = {
    "Alta": "text-red-600",
    "Media": "text-amber-600",
    "Baja": "text-green-600",
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Busqueda Semantica</h1>

      {/* Search Input */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar en notas, tareas, reuniones y proyectos..." className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      {/* Filter Chips */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{filteredResults.length} resultados encontrados</p>

      {/* Results */}
      <div className="space-y-2">
        {filteredResults.map(result => {
          const config = typeConfig[result.entityType];
          const Icon = config.icon;
          return (
            <button key={result.id} onClick={() => setSelectedResult(result)} className="w-full rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium shrink-0 ${config.colors}`}>
                    <Icon className="h-3 w-3" />{config.label}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{result.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{result.snippet}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">{result.score.toFixed(2)}</span>
              </div>
            </button>
          );
        })}
        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No se encontraron resultados para &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedResult && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={() => setSelectedResult(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l bg-background shadow-2xl">

              {/* Header */}
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${typeConfig[selectedResult.entityType].colors}`}>
                      {(() => { const Icon = typeConfig[selectedResult.entityType].icon; return <Icon className="h-3 w-3" />; })()}
                      {typeConfig[selectedResult.entityType].label}
                    </span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">Score: {selectedResult.score.toFixed(2)}</span>
                  </div>
                  <h2 className="text-lg font-semibold leading-tight">{selectedResult.title}</h2>
                </div>
                <button onClick={() => setSelectedResult(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors" aria-label="Cerrar panel"><X className="h-5 w-5" /></button>
              </div>

              {/* Content by type */}
              <div className="flex-1 overflow-auto p-5">
                {selectedResult.detail.type === "note" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Actualizada: {selectedResult.detail.updatedAt}
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                      <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderNoteContent(selectedResult.detail.content) }} />
                    </div>
                  </div>
                )}

                {selectedResult.detail.type === "task" && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
                      <p className="mt-1 text-sm font-medium">{selectedResult.detail.name}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descripcion</label>
                      <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{selectedResult.detail.description}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
                      <p className="mt-1.5"><span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[selectedResult.detail.status] || "bg-gray-100 text-gray-800"}`}>{selectedResult.detail.status}</span></p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</label>
                      <p className="mt-1.5 flex items-center gap-1.5">
                        <Flag className={`h-4 w-4 ${priorityColors[selectedResult.detail.priority] || ""}`} />
                        <span className="text-sm">{selectedResult.detail.priority}</span>
                      </p>
                    </div>
                    {selectedResult.detail.project && (
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proyecto</label>
                        <p className="mt-1.5"><span className="rounded bg-purple-100 px-2.5 py-1 text-xs text-purple-600 font-medium">{selectedResult.detail.project}</span></p>
                      </div>
                    )}
                  </div>
                )}

                {selectedResult.detail.type === "meeting" && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Titulo</label>
                      <p className="mt-1 text-sm font-medium">{selectedResult.detail.title}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha</label>
                      <p className="mt-1.5 flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {selectedResult.detail.date}
                      </p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Duracion</label>
                      <p className="mt-1.5 text-sm">{selectedResult.detail.duration} minutos</p>
                    </div>
                    {selectedResult.detail.project && (
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proyecto</label>
                        <p className="mt-1.5"><span className="rounded bg-purple-100 px-2.5 py-1 text-xs text-purple-600 font-medium">{selectedResult.detail.project}</span></p>
                      </div>
                    )}
                    {selectedResult.detail.summary ? (
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Sparkles className="h-3 w-3" />Resumen IA</label>
                        <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed rounded-xl bg-primary/5 border p-3">{selectedResult.detail.summary}</p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-center">
                        <p className="text-xs text-muted-foreground">Sin resumen disponible</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedResult.detail.type === "project" && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
                      <p className="mt-1 text-sm font-medium">{selectedResult.detail.name}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descripcion</label>
                      <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{selectedResult.detail.description}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Progreso</label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-muted-foreground">{selectedResult.detail.taskCount} tareas</span>
                          <span className="text-xs font-semibold">{selectedResult.detail.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selectedResult.detail.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
