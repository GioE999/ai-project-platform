"use client";
import { useState, useEffect } from "react";
import { Globe, Search, X, ExternalLink, FileText, Loader2, Clock, Tag, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchSource {
  title: string;
  url: string;
}

interface ResearchResult {
  id: string;
  query: string;
  status: "processing" | "completed";
  title: string;
  overview: string;
  fullContent: string;
  sources: ResearchSource[];
  topic: string;
  timestamp: string;
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
    fullContent: `## Entrenamiento de fuerza 3x semana para principiantes

### Principios fundamentales

El entrenamiento de fuerza tres veces por semana es la frecuencia óptima para principiantes porque permite 48 horas de recuperación entre sesiones. Los estudios muestran que esta frecuencia maximiza las adaptaciones neuromusculares sin generar fatiga excesiva.

### Programas recomendados

**Starting Strength (Mark Rippetoe)**
- Enfoque en 5 movimientos básicos
- Progresión lineal simple
- 3 sets x 5 reps para la mayoría de ejercicios

**StrongLifts 5x5**
- Alterna entre Workout A y B
- 5 sets x 5 reps
- Incremento de 2.5kg por sesión

### Estructura recomendada

**Día A:**
- Sentadillas 3x5
- Press banca 3x5
- Remo con barra 3x5

**Día B:**
- Sentadillas 3x5
- Press militar 3x5
- Peso muerto 1x5

### Consideraciones para principiantes

1. **Técnica primero**: Aprende la forma correcta con peso ligero antes de aumentar carga
2. **Calentamiento**: 5-10 min de cardio suave + movilidad articular
3. **Recuperación**: Dormir 7-8 horas y consumir proteína suficiente (1.6-2.2g/kg)
4. **Progresión**: Aumentar peso solo cuando completes todas las reps con buena técnica

### Errores comunes
- Empezar con demasiado peso
- No llevar registro del progreso
- Saltarse el calentamiento
- Ignorar la nutrición y el descanso`,
    sources: [
      { title: "Starting Strength - Beginner Program", url: "https://startingstrength.com/get-started" },
      { title: "NSCA Guidelines for Beginners", url: "https://www.nsca.com/education/articles/kinetic-select/strength-training-for-beginners" },
      { title: "StrongLifts 5x5 Program", url: "https://stronglifts.com/5x5" },
    ],
    topic: "Salud & Bienestar",
    timestamp: "2025-01-23T14:30:00Z",
  },
  {
    id: "res-2",
    query: "Mejores prácticas de CI/CD para monorepos",
    status: "completed",
    title: "Mejores prácticas de CI/CD para monorepos",
    overview: "Los monorepos requieren estrategias de CI/CD específicas para evitar builds innecesarios y mantener tiempos de pipeline cortos. Las herramientas como Turborepo, Nx y Bazel permiten ejecutar solo los targets afectados por cada cambio. La clave está en definir correctamente las dependencias entre paquetes.",
    fullContent: `## Mejores prácticas de CI/CD para monorepos

### Desafíos principales

Los monorepos presentan desafíos únicos para CI/CD:
- Builds completos pueden tomar mucho tiempo
- No todos los cambios afectan todos los paquetes
- Las dependencias entre paquetes deben estar bien definidas

### Herramientas recomendadas

**Turborepo**
- Remote caching integrado
- Ejecución paralela de tasks
- Detección automática de paquetes afectados

**Nx**
- Computation caching avanzado
- Affected command para ejecutar solo lo necesario
- Plugins para frameworks populares

**Bazel**
- Máximo control sobre el grafo de dependencias
- Builds herméticos y reproducibles
- Ideal para repos muy grandes

### Estrategias clave

1. **Affected-only builds**: Ejecuta pipelines solo para paquetes modificados
2. **Remote caching**: Comparte cache de builds entre desarrolladores y CI
3. **Paralelización**: Ejecuta tests y builds independientes en paralelo
4. **Pipeline as code**: Define pipelines en archivos del repo, no en la UI del CI
5. **Changesets**: Usa herramientas como changesets para versioning automático

### Estructura de pipeline recomendada

\`\`\`yaml
stages:
  - lint (affected only)
  - test (affected only)  
  - build (affected only)
  - deploy (manual trigger para producción)
\`\`\`

### Tips adicionales
- Limita PRs a un paquete cuando sea posible
- Usa pre-commit hooks para lint local
- Implementa trunk-based development
- Configura branch protection con status checks dinámicos`,
    sources: [
      { title: "Turborepo - Monorepo Build System", url: "https://turbo.build/repo/docs" },
      { title: "Nx - Smart Monorepos", url: "https://nx.dev/concepts/affected" },
      { title: "GitHub Blog - CI/CD for Monorepos", url: "https://github.blog/engineering/ci-cd/ci-cd-for-monorepos" },
    ],
    topic: "DevOps",
    timestamp: "2025-01-22T10:15:00Z",
  },
  {
    id: "res-3",
    query: "Técnicas de productividad para desarrolladores remotos",
    status: "completed",
    title: "Técnicas de productividad para desarrolladores remotos",
    overview: "Los desarrolladores remotos enfrentan desafíos únicos como aislamiento, distracciones del hogar y dificultad para establecer límites. Las técnicas más efectivas combinan time-blocking, rituales de transición y comunicación asíncrona intencional. La clave está en diseñar un entorno que favorezca el deep work.",
    fullContent: `## Técnicas de productividad para desarrolladores remotos

### El desafío del trabajo remoto

Trabajar desde casa presenta ventajas pero también desafíos específicos para developers:
- Falta de separación entre trabajo y vida personal
- Distracciones del entorno doméstico
- Reuniones excesivas que fragmentan el tiempo
- Aislamiento social y falta de energía colectiva

### Técnicas probadas

**1. Time-blocking estricto**
- Bloques de 2-3 horas para deep work
- No reuniones antes de las 11am
- Bloque fijo para comunicación asíncrona (Slack, emails)

**2. Rituales de transición**
- "Commute simulado": caminata de 10 min antes y después del trabajo
- Cambio de ropa como señal mental
- Apagar el monitor al terminar la jornada

**3. Método PARA (Projects, Areas, Resources, Archive)**
- Organiza toda la información en 4 categorías
- Reduce la fricción para encontrar lo que necesitas
- Revisión semanal de 30 minutos

**4. Comunicación asíncrona intencional**
- Documenta decisiones por escrito
- Usa Loom para explicaciones complejas
- Responde en lotes, no en tiempo real

**5. Pomodoro adaptado**
- 50 min trabajo / 10 min descanso (para flow states)
- O clásico 25/5 para tareas que requieren más disciplina
- Usa apps como Focus Bear o Raycast

### Diseño del espacio de trabajo
- Monitor externo dedicado solo al trabajo
- Escritorio de pie/sentado
- Luz natural + lámpara de espectro completo
- Auriculares con ANC para señalizar "modo foco"

### Métricas personales
- Horas de deep work por día (objetivo: 4h)
- Ratio reuniones/trabajo profundo
- Tareas completadas vs planificadas`,
    sources: [
      { title: "Cal Newport - Deep Work for Remote Developers", url: "https://calnewport.com/deep-work-in-remote-settings" },
      { title: "Basecamp - Guide to Internal Communication", url: "https://basecamp.com/guides/how-we-communicate" },
      { title: "Huberman Lab - Optimizing Workspace", url: "https://hubermanlab.com/optimize-your-workspace" },
    ],
    topic: "Productividad",
    timestamp: "2025-01-21T09:45:00Z",
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
    };
    setResearches([newResearch, ...researches]);
    setQuery("");
    setSelectedTopic("");
    setSelectedProject("");
  }

  const activeResearches = researches.filter(r => r.status === "processing");
  const completedResearches = researches.filter(r => r.status === "completed");

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
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          >
            <option value="">Tema (opcional)</option>
            {topicOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          >
            <option value="">Proyecto (opcional)</option>
            {projectOptions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!query.trim()}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Search className="h-4 w-4" />
            Investigar
          </button>
        </div>
      </form>

      {/* Active Researches */}
      {activeResearches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Investigaciones en curso
          </h2>
          <div className="space-y-2">
            {activeResearches.map(research => (
              <div key={research.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{research.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Procesando con Perplexity Pro...</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${topicColors[research.topic] || "bg-gray-100 text-gray-800"}`}>
                  {research.topic}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Researches */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Investigaciones completadas ({completedResearches.length})
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {completedResearches.map(research => (
            <button
              key={research.id}
              onClick={() => setSelectedResearch(research)}
              className="rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {research.title}
                </h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${topicColors[research.topic] || "bg-gray-100 text-gray-800"}`}>
                  {research.topic}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{research.overview}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  {research.sources.length} fuentes
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
              onClick={() => setSelectedResearch(null)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col border-l bg-background shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${topicColors[selectedResearch.topic] || "bg-gray-100 text-gray-800"}`}>
                      {selectedResearch.topic}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold">{selectedResearch.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedResearch.timestamp).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedResearch(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto p-5 space-y-5">
                {/* Overview */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Resumen</p>
                  <p className="text-sm leading-relaxed">{selectedResearch.overview}</p>
                </div>

                {/* Full Content */}
                <div className="prose prose-sm max-w-none">
                  {selectedResearch.fullContent.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) return <h2 key={i} className="text-base font-bold mt-4 mb-2">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold mt-3 mb-1.5">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-sm font-semibold mt-2">{line.replace(/\*\*/g, "")}</p>;
                    if (line.startsWith("- ")) return <li key={i} className="text-sm text-muted-foreground ml-4 list-disc">{line.replace("- ", "")}</li>;
                    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) return <li key={i} className="text-sm text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>;
                    if (line.startsWith("```")) return <div key={i} className="rounded bg-muted px-3 py-1 text-xs font-mono my-1">{line.replace(/```\w*/, "")}</div>;
                    if (line.trim() === "") return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm leading-relaxed text-foreground/80">{line}</p>;
                  })}
                </div>

                {/* Sources */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Fuentes ({selectedResearch.sources.length})
                  </p>
                  <div className="space-y-2">
                    {selectedResearch.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="border-t p-4">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 transition-colors">
                  <FileText className="h-4 w-4" />
                  Guardar como Nota en Brain
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
