"use client";
import { useState } from "react";
import { ViewSelector } from "@/components/tasks/ViewSelector";
import { useAppStore } from "@/hooks/stores";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { Plus, X, Flag } from "lucide-react";
import type { TaskStatus, Priority } from "@/types";

interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
}

const today = new Date();
const fmt = (d: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + d);
  return date.toISOString();
};

const initialTasks: Task[] = [
  { id: "1", name: "Diseñar wireframes del dashboard", description: "Crear mockups de alta fidelidad en Figma para todas las vistas del dashboard, incluyendo responsive mobile.", status: "completed", priority: "high", dueDate: fmt(-3), createdAt: fmt(-10) },
  { id: "2", name: "Implementar autenticación OAuth2", description: "Integrar con Google y GitHub como providers. Incluir refresh tokens y session management.", status: "in_progress", priority: "high", dueDate: fmt(2), createdAt: fmt(-7) },
  { id: "3", name: "Configurar pipeline CI/CD", description: "GitHub Actions para deploy automático a staging y producción con tests y linting.", status: "pending", priority: "medium", dueDate: fmt(5), createdAt: fmt(-5) },
  { id: "4", name: "Escribir documentación de API", description: "Generar Swagger/OpenAPI specs para todos los endpoints REST del backend.", status: "review", priority: "medium", dueDate: fmt(1), createdAt: fmt(-4) },
  { id: "5", name: "Corregir bug en formulario de registro", description: "La validación de email falla con dominios .co y .io. El regex actual es demasiado restrictivo.", status: "blocked", priority: "high", dueDate: fmt(0), createdAt: fmt(-2) },
  { id: "6", name: "Optimizar queries de base de datos", description: "Agregar índices compuestos para las queries más frecuentes. Revisar query plans con EXPLAIN ANALYZE.", status: "pending", priority: "low", dueDate: fmt(8), createdAt: fmt(-6) },
  { id: "7", name: "Crear componente de notificaciones", description: "Sistema de toast notifications y push notifications con service worker.", status: "in_progress", priority: "medium", dueDate: fmt(3), createdAt: fmt(-3) },
  { id: "8", name: "Diseñar sistema de permisos", description: "RBAC con roles customizables por proyecto. Definir granularidad de permisos.", status: "pending", priority: "high", dueDate: fmt(6), createdAt: fmt(-1) },
];

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-gray-100 text-gray-800" },
  in_progress: { label: "En progreso", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completado", color: "bg-green-100 text-green-800" },
  blocked: { label: "Bloqueado", color: "bg-red-100 text-red-800" },
  review: { label: "Revisión", color: "bg-yellow-100 text-yellow-800" },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  high: { label: "Alta", color: "text-red-600" },
  medium: { label: "Media", color: "text-amber-600" },
  low: { label: "Baja", color: "text-green-600" },
};

export default function TasksPage() {
  const { activeView } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "status">("createdAt");
  const [form, setForm] = useState({ name: "", description: "", priority: "medium" as Priority, dueDate: "" });

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(), name: form.name, description: form.description,
      status: "pending", priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setForm({ name: "", description: "", priority: "medium", dueDate: "" });
    setShowForm(false);
  }

  function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === "priority") { const o = { high: 0, medium: 1, low: 2 }; return o[a.priority] - o[b.priority]; }
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Kanban columns
  const columns: { id: TaskStatus; label: string }[] = [
    { id: "pending", label: "Pendiente" }, { id: "in_progress", label: "En Progreso" },
    { id: "review", label: "Revisión" }, { id: "blocked", label: "Bloqueado" }, { id: "completed", label: "Completado" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tareas</h1>
        <div className="flex items-center gap-3">
          <ViewSelector />
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancelar" : "Agregar Tarea"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addTask} className="mb-6 rounded-xl border bg-card p-4 space-y-3">
          <input type="text" placeholder="Nombre de la tarea" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Descripción (opcional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-3">
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })} className="rounded-md border bg-transparent px-3 py-2 text-sm">
              <option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option>
            </select>
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="rounded-md border bg-transparent px-3 py-2 text-sm" />
            <button type="submit" className="ml-auto rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Crear</button>
          </div>
        </form>
      )}

      {/* List View */}
      {activeView === "list" && (
        <div>
          <div className="mb-3 flex gap-2">
            {(["createdAt", "priority", "status"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className={`rounded-md px-3 py-1 text-xs transition-colors ${sortBy === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {s === "createdAt" ? "Fecha" : s === "priority" ? "Prioridad" : "Estado"}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            {sorted.map(task => (
              <button key={task.id} onClick={() => setSelectedTask(task)} className="w-full flex items-center justify-between rounded-lg border bg-card p-3 text-left hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <Flag className={`h-3.5 w-3.5 shrink-0 ${priorityConfig[task.priority].color}`} />
                  <span className="font-medium text-sm truncate">{task.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded px-2 py-0.5 text-xs ${statusConfig[task.status].color}`}>
                    {statusConfig[task.status].label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kanban View */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-5 gap-3">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="rounded-lg bg-muted/40 p-2.5">
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{col.label} ({colTasks.length})</h3>
                <div className="space-y-1.5">
                  {colTasks.map(task => (
                    <button key={task.id} onClick={() => setSelectedTask(task)} className="w-full rounded-lg border bg-card p-2.5 text-left text-sm hover:shadow-md transition-shadow">
                      <span className="font-medium text-xs">{task.name}</span>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Flag className={`h-3 w-3 ${priorityConfig[task.priority].color}`} />
                        <span className="text-[10px] text-muted-foreground">{priorityConfig[task.priority].label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar View */}
      {activeView === "calendar" && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{today.toLocaleDateString("es", { month: "long", year: "numeric" })}</h3>
          <div className="grid grid-cols-7 gap-1">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
              <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
            {Array.from({ length: new Date(today.getFullYear(), today.getMonth(), 1).getDay() }, (_, i) => (
              <div key={`b-${i}`} className="p-2" />
            ))}
            {Array.from({ length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() }, (_, i) => {
              const day = i + 1;
              const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayTasks = tasks.filter(t => t.dueDate?.slice(0, 10) === dateStr);
              return (
                <div key={day} className="min-h-[60px] rounded border p-1">
                  <span className={`text-xs ${day === today.getDate() ? "font-bold text-primary" : ""}`}>{day}</span>
                  {dayTasks.map(t => (
                    <button key={t.id} onClick={() => setSelectedTask(t)} className="mt-0.5 w-full truncate rounded bg-primary/10 px-1 text-[10px] text-left hover:bg-primary/20">
                      {t.name}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(taskId, updates) => {
          setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
          if (selectedTask?.id === taskId) setSelectedTask({ ...selectedTask, ...updates });
        }}
      />
    </div>
  );
}
