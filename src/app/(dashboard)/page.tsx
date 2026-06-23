"use client";
import Link from "next/link";
import {
  CheckSquare,
  FolderKanban,
  Video,
  Brain,
  Search,
  Bot,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";

const modules = [
  {
    href: "/tasks",
    label: "Tareas",
    description: "Lista, Kanban y calendario",
    icon: CheckSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    stat: "12 pendientes",
  },
  {
    href: "/projects",
    label: "Proyectos",
    description: "Seguimiento de progreso",
    icon: FolderKanban,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    stat: "3 activos",
  },
  {
    href: "/meetings",
    label: "Reuniones",
    description: "Google Meet + resúmenes IA",
    icon: Video,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    stat: "2 esta semana",
  },
  {
    href: "/brain",
    label: "Second Brain",
    description: "Notas + grafo de conocimiento",
    icon: Brain,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    stat: "8 notas",
  },
  {
    href: "/search",
    label: "Búsqueda",
    description: "Búsqueda semántica con IA",
    icon: Search,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    stat: "Todo indexado",
  },
];

const recentActivity = [
  { text: "Tarea 'Diseñar API' completada", time: "hace 2h", type: "task" },
  { text: "Reunión 'Sprint Review' procesada", time: "hace 4h", type: "meeting" },
  { text: "Nota 'Arquitectura v2' actualizada", time: "hace 6h", type: "note" },
  { text: "Proyecto 'MVP' progreso 67%", time: "hace 1d", type: "project" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido de vuelta</h1>
        <p className="mt-1 text-muted-foreground">
          Aquí tienes un resumen de tu actividad reciente.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckSquare className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Tareas hoy</span>
          </div>
          <p className="mt-2 text-2xl font-bold">5</p>
          <p className="text-xs text-muted-foreground">3 completadas</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Progreso</span>
          </div>
          <p className="mt-2 text-2xl font-bold">67%</p>
          <p className="text-xs text-muted-foreground">proyecto actual</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Video className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Reuniones</span>
          </div>
          <p className="mt-2 text-2xl font-bold">2</p>
          <p className="text-xs text-muted-foreground">esta semana</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Notas</span>
          </div>
          <p className="mt-2 text-2xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">3 conexiones nuevas</p>
        </div>
      </div>

      {/* Modules grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Módulos</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {modules.map(({ href, label, description, icon: Icon, iconBg, iconColor, stat }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <h3 className="font-medium group-hover:text-primary">{label}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{stat}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row: Activity + AI Assistant */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 font-semibold">Actividad reciente</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary/60" />
                <div className="flex-1">
                  <p className="text-sm">{item.text}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Asistente IA</h3>
              <p className="text-xs text-muted-foreground">Multi-agente con planificación y RAG</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">Sugerencias:</p>
            <div className="flex flex-wrap gap-2">
              {["Planificar sprint", "Resumir reunión", "Buscar en notas"].map((s) => (
                <span key={s} className="rounded-full border px-3 py-1 text-xs hover:bg-accent cursor-pointer transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="¿En qué puedo ayudarte?"
              className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
