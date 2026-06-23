"use client";
import { useState } from "react";
import { Plus, X, ChevronDown, ChevronRight, FolderOpen, CheckCircle2, Circle, Clock, Flag, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TaskStatus = "pending" | "in_progress" | "completed";

interface ProjectTask {
  id: string;
  name: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks: ProjectTask[];
}

const initialProjects: Project[] = [
  {
    id: "p1", name: "MVP Plataforma v1.0", description: "Primera versión del producto con funcionalidades core de gestión de tareas, proyectos y autenticación.",
    createdAt: "2024-11-01",
    tasks: [
      { id: "t1", name: "Diseñar wireframes del dashboard", status: "completed", priority: "high" },
      { id: "t2", name: "Implementar autenticación OAuth2", status: "in_progress", priority: "high" },
      { id: "t3", name: "Configurar pipeline CI/CD", status: "pending", priority: "medium" },
      { id: "t4", name: "Escribir documentación de API", status: "completed", priority: "medium" },
      { id: "t5", name: "Diseñar sistema de permisos", status: "completed", priority: "high" },
      { id: "t6", name: "Corregir bug en formulario de registro", status: "completed", priority: "low" },
    ],
  },
  {
    id: "p2", name: "Integración Google Meet", description: "Conectar con Google Calendar y Meet para crear reuniones automáticas, generar notas y extraer action items.",
    createdAt: "2024-12-10",
    tasks: [
      { id: "t7", name: "Configurar OAuth con Google Workspace", status: "completed", priority: "high" },
      { id: "t8", name: "Crear servicio de calendar sync", status: "in_progress", priority: "high" },
      { id: "t9", name: "Implementar webhook de eventos", status: "pending", priority: "medium" },
      { id: "t10", name: "UI de vinculación de cuenta", status: "pending", priority: "medium" },
    ],
  },
  {
    id: "p3", name: "Sistema de Notificaciones", description: "Push notifications, email digests y notificaciones in-app con prioridades y configuración por usuario.",
    createdAt: "2025-01-05",
    tasks: [
      { id: "t11", name: "Diseñar esquema de notificaciones", status: "pending", priority: "high" },
      { id: "t12", name: "Integrar servicio de email (Resend)", status: "pending", priority: "medium" },
      { id: "t13", name: "Crear componente toast", status: "pending", priority: "low" },
    ],
  },
];

function getProgress(tasks: ProjectTask[]) {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100);
}

const statusIcon = (s: TaskStatus) => {
  if (s === "completed") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (s === "in_progress") return <Clock className="h-4 w-4 text-blue-600" />;
  return <Circle className="h-4 w-4 text-gray-400" />;
};

const priorityColor = { high: "text-red-600", medium: "text-amber-600", low: "text-green-600" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");

  function addProject(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const p: Project = { id: crypto.randomUUID(), name: form.name, description: form.description, createdAt: new Date().toISOString().slice(0, 10), tasks: [] };
    setProjects([...projects, p]);
    setForm({ name: "", description: "" });
    setShowForm(false);
  }

  function addTaskToProject(projectId: string) {
    if (!newTaskName.trim()) return;
    const task: ProjectTask = { id: crypto.randomUUID(), name: newTaskName, status: "pending", priority: newTaskPriority };
    setProjects(projects.map(p => p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p));
    if (selectedProject?.id === projectId) setSelectedProject({ ...selectedProject, tasks: [...selectedProject.tasks, task] });
    setNewTaskName("");
    setNewTaskPriority("medium");
  }

  function toggleTaskStatus(projectId: string, taskId: string) {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.map(t => {
        if (t.id !== taskId) return t;
        const next: TaskStatus = t.status === "pending" ? "in_progress" : t.status === "in_progress" ? "completed" : "pending";
        return { ...t, status: next };
      }) };
    }));
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, tasks: selectedProject.tasks.map(t => {
        if (t.id !== taskId) return t;
        const next: TaskStatus = t.status === "pending" ? "in_progress" : t.status === "in_progress" ? "completed" : "pending";
        return { ...t, status: next };
      }) });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} proyectos · {projects.reduce((acc, p) => acc + p.tasks.length, 0)} tareas total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Nuevo Proyecto"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProject} className="mb-6 rounded-xl border bg-card p-4 space-y-3">
          <input type="text" placeholder="Nombre del proyecto" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea placeholder="Descripción del proyecto..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Crear Proyecto</button>
        </form>
      )}

      {/* Project Cards */}
      <div className="space-y-3">
        {projects.map(project => {
          const progress = getProgress(project.tasks);
          const completed = project.tasks.filter(t => t.status === "completed").length;
          return (
            <button key={project.id} onClick={() => setSelectedProject(project)} className="w-full rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-primary/10 p-2"><FolderOpen className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{project.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Creado {project.createdAt} · {project.tasks.length} tareas</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground w-8">{progress}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{completed}/{project.tasks.length} completadas</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Project Detail Panel */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={() => setSelectedProject(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col border-l bg-background shadow-2xl">
              
              {/* Panel Header */}
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="rounded-lg bg-primary/10 p-2"><FolderOpen className="h-5 w-5 text-primary" /></div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{selectedProject.name}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{selectedProject.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>

              {/* Progress */}
              <div className="px-5 py-3 border-b bg-muted/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">Progreso</span>
                  <span className="text-xs font-semibold">{getProgress(selectedProject.tasks)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${getProgress(selectedProject.tasks)}%` }} />
                </div>
                <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span>✅ {selectedProject.tasks.filter(t => t.status === "completed").length} completadas</span>
                  <span>🔄 {selectedProject.tasks.filter(t => t.status === "in_progress").length} en progreso</span>
                  <span>⏳ {selectedProject.tasks.filter(t => t.status === "pending").length} pendientes</span>
                </div>
              </div>

              {/* Tasks list */}
              <div className="flex-1 overflow-auto px-5 py-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tareas del Proyecto</h3>
                <div className="space-y-1.5">
                  {selectedProject.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 rounded-lg border p-2.5 hover:bg-accent/30 transition-colors">
                      <button onClick={() => toggleTaskStatus(selectedProject.id, task.id)} className="shrink-0">{statusIcon(task.status)}</button>
                      <span className={`flex-1 text-sm ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{task.name}</span>
                      <Flag className={`h-3 w-3 shrink-0 ${priorityColor[task.priority]}`} />
                    </div>
                  ))}
                </div>

                {/* Add task to project */}
                <div className="mt-4 flex gap-2">
                  <input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addTaskToProject(selectedProject.id); }} placeholder="Nueva tarea..." className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as "low"|"medium"|"high")} className="rounded-lg border bg-transparent px-2 py-2 text-xs">
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                  <button onClick={() => addTaskToProject(selectedProject.id)} className="rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="border-t px-5 py-3 bg-muted/20">
                <p className="text-[10px] text-muted-foreground">Creado {selectedProject.createdAt} · Click en el ícono de estado para cambiar: ⚪→🔵→✅</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
