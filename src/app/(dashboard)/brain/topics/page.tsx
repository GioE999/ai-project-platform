"use client";
import { useState, useEffect } from "react";
import { Plus, X, Tag, FileText, CheckSquare, Video, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Topic {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  noteCount: number;
  taskCount: number;
  meetingCount: number;
  summary?: string;
}

const initialTopics: Topic[] = [
  { id: "t1", name: "Arquitectura", slug: "arquitectura", color: "bg-blue-100 text-blue-800", icon: "🏗️", noteCount: 3, taskCount: 2, meetingCount: 1, summary: "Conocimiento sobre la arquitectura del sistema: microservicios, API Gateway, PostgreSQL, y patrones de comunicación entre servicios." },
  { id: "t2", name: "Productividad", slug: "productividad", color: "bg-green-100 text-green-800", icon: "⚡", noteCount: 2, taskCount: 4, meetingCount: 2, summary: "Técnicas y herramientas para mejorar productividad: deep work, pomodoro, gestión de energía y rutinas de foco." },
  { id: "t3", name: "DevOps", slug: "devops", color: "bg-purple-100 text-purple-800", icon: "🔧", noteCount: 2, taskCount: 3, meetingCount: 0, summary: "CI/CD, Docker, Kubernetes, monitoreo, y prácticas de infraestructura como código." },
  { id: "t4", name: "UX/UI", slug: "ux-ui", color: "bg-amber-100 text-amber-800", icon: "🎨", noteCount: 2, taskCount: 2, meetingCount: 1, summary: "Diseño de interfaz, experiencia de usuario, research, accesibilidad y sistemas de diseño." },
  { id: "t5", name: "Aprendizaje", slug: "aprendizaje", color: "bg-red-100 text-red-800", icon: "📚", noteCount: 1, taskCount: 1, meetingCount: 0, summary: "Planes de estudio, recursos de aprendizaje, cursos en progreso y notas de libros técnicos." },
  { id: "t6", name: "Salud & Bienestar", slug: "salud-bienestar", color: "bg-green-100 text-green-800", icon: "🧘", noteCount: 1, taskCount: 0, meetingCount: 0, summary: "Ejercicio, nutrición, skincare, sueño y bienestar general. Conectado con rutinas personales." },
];

interface TopicDetail {
  relatedNotes: string[];
  relatedTasks: string[];
  relatedMeetings: string[];
  subtopics: string[];
}

const topicDetails: Record<string, TopicDetail> = {
  t1: { relatedNotes: ["Arquitectura del Sistema", "Microservicios", "PostgreSQL"], relatedTasks: ["Configurar pipeline CI/CD", "Optimizar queries de base de datos"], relatedMeetings: ["Kickoff Integración Meet"], subtopics: ["Microservicios", "Base de datos", "API Design", "Infraestructura"] },
  t2: { relatedNotes: ["Ideas de Producto", "Reunión Sprint 11"], relatedTasks: ["Diseñar wireframes del dashboard", "Crear componente de notificaciones", "Escribir documentación de API", "Diseñar sistema de permisos"], relatedMeetings: ["Sprint Planning #12", "Retrospectiva Sprint 11"], subtopics: ["Deep Work", "Pomodoro", "Gestión del tiempo", "Hábitos"] },
  t3: { relatedNotes: ["Microservicios", "PostgreSQL"], relatedTasks: ["Configurar pipeline CI/CD", "Implementar autenticación OAuth2", "Optimizar queries de base de datos"], relatedMeetings: [], subtopics: ["Docker", "Kubernetes", "CI/CD", "Monitoring"] },
  t4: { relatedNotes: ["Ideas de Producto", "Guía de Onboarding"], relatedTasks: ["Diseñar wireframes del dashboard", "Crear componente de notificaciones"], relatedMeetings: ["Review de Diseño UI"], subtopics: ["Wireframing", "Accessibility", "Design Systems", "User Research"] },
  t5: { relatedNotes: ["Guía de Onboarding"], relatedTasks: ["Escribir documentación de API"], relatedMeetings: [], subtopics: ["Programación", "Cloud", "AI/ML", "Frameworks"] },
  t6: { relatedNotes: ["Ideas de Producto"], relatedTasks: [], relatedMeetings: [], subtopics: ["Ejercicio", "Skincare", "Nutrición", "Sueño"] },
};

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "📌" });

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedTopic(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function addTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const t: Topic = { id: crypto.randomUUID(), name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, "-"), color: "bg-gray-100 text-gray-800", icon: form.icon, noteCount: 0, taskCount: 0, meetingCount: 0 };
    setTopics([...topics, t]);
    setForm({ name: "", icon: "📌" });
    setShowForm(false);
  }

  const detail = selectedTopic ? topicDetails[selectedTopic.id] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Temas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{topics.length} temas · Organiza tu conocimiento por categorías</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Nuevo Tema"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addTopic} className="mb-6 rounded-xl border bg-card p-4 space-y-3">
          <div className="flex gap-3">
            <input type="text" placeholder="Emoji" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-16 rounded-lg border bg-transparent px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="text" placeholder="Nombre del tema" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Crear</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(topic => (
          <button key={topic.id} onClick={() => setSelectedTopic(topic)} className="rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{topic.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{topic.name}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{topic.noteCount}</span>
                  <span className="flex items-center gap-1"><CheckSquare className="h-3 w-3" />{topic.taskCount}</span>
                  <span className="flex items-center gap-1"><Video className="h-3 w-3" />{topic.meetingCount}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Topic Detail Panel */}
      <AnimatePresence>
        {selectedTopic && detail && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={() => setSelectedTopic(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l bg-background shadow-2xl">
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{selectedTopic.icon}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{selectedTopic.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedTopic.noteCount + selectedTopic.taskCount + selectedTopic.meetingCount} elementos asociados</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTopic(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 overflow-auto p-5 space-y-5">
                {/* AI Summary */}
                {selectedTopic.summary && (
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                    <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2"><Sparkles className="h-3.5 w-3.5" />Resumen IA</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selectedTopic.summary}</p>
                  </div>
                )}

                {/* Subtopics */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subtemas detectados</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.subtopics.map((st, i) => (
                      <span key={i} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{st}</span>
                    ))}
                  </div>
                </div>

                {/* Related Notes */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="h-3 w-3" />Notas ({detail.relatedNotes.length})</h3>
                  <div className="space-y-1.5">
                    {detail.relatedNotes.map((note, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border p-2.5 hover:bg-accent/30 transition-colors">
                        <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                        <span className="text-sm">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Tasks */}
                {detail.relatedTasks.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckSquare className="h-3 w-3" />Tareas ({detail.relatedTasks.length})</h3>
                    <div className="space-y-1.5">
                      {detail.relatedTasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border p-2.5 hover:bg-accent/30 transition-colors">
                          <CheckSquare className="h-4 w-4 text-blue-600 shrink-0" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Meetings */}
                {detail.relatedMeetings.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Video className="h-3 w-3" />Reuniones ({detail.relatedMeetings.length})</h3>
                    <div className="space-y-1.5">
                      {detail.relatedMeetings.map((meeting, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border p-2.5 hover:bg-accent/30 transition-colors">
                          <Video className="h-4 w-4 text-amber-600 shrink-0" />
                          <span className="text-sm">{meeting}</span>
                        </div>
                      ))}
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
