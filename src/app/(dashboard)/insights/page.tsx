"use client";
import { useState } from "react";
import { BarChart3, CheckSquare, FileText, Video, Repeat, TrendingUp, Bot, Sparkles, Lightbulb, Activity } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: typeof CheckSquare;
  color: string;
  suffix?: string;
}

interface DayActivity {
  day: string;
  value: number;
}

interface TopicDistribution {
  topic: string;
  count: number;
  color: string;
}

interface KnowledgeArea {
  area: string;
  strength: number;
}

interface AgentAction {
  id: string;
  agent: string;
  action: string;
  timestamp: string;
  agentColor: string;
}

interface ImprovementArea {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const statsCards: StatCard[] = [
  { label: "Tareas completadas", value: 23, icon: CheckSquare, color: "bg-blue-100 text-blue-800" },
  { label: "Notas creadas", value: 12, icon: FileText, color: "bg-green-100 text-green-800" },
  { label: "Reuniones", value: 8, icon: Video, color: "bg-purple-100 text-purple-600" },
  { label: "Rutinas completadas", value: 45, icon: Repeat, color: "bg-amber-100 text-amber-600" },
];

const weeklyActivity: DayActivity[] = [
  { day: "Lun", value: 85 },
  { day: "Mar", value: 92 },
  { day: "Mié", value: 78 },
  { day: "Jue", value: 95 },
  { day: "Vie", value: 60 },
  { day: "Sáb", value: 30 },
  { day: "Dom", value: 20 },
];

const topicDistribution: TopicDistribution[] = [
  { topic: "Arquitectura", count: 8, color: "bg-blue-500" },
  { topic: "Productividad", count: 6, color: "bg-green-500" },
  { topic: "DevOps", count: 5, color: "bg-purple-500" },
  { topic: "UX/UI", count: 4, color: "bg-amber-500" },
  { topic: "Salud & Bienestar", count: 3, color: "bg-red-500" },
  { topic: "IA & ML", count: 2, color: "bg-cyan-500" },
];

const knowledgeAreas: KnowledgeArea[] = [
  { area: "Backend", strength: 90 },
  { area: "Frontend", strength: 75 },
  { area: "DevOps", strength: 60 },
  { area: "UX/UI", strength: 45 },
  { area: "Data", strength: 35 },
  { area: "Mobile", strength: 20 },
];

const recentAgentActions: AgentAction[] = [
  {
    id: "a1",
    agent: "BrainAgent",
    action: "Clasificó 'PostgreSQL Optimization' en tema Arquitectura",
    timestamp: "2025-01-24T15:30:00Z",
    agentColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "a2",
    agent: "RoutineAgent",
    action: "Sugirió reducir pasos en Deep Work",
    timestamp: "2025-01-24T14:15:00Z",
    agentColor: "bg-green-100 text-green-800",
  },
  {
    id: "a3",
    agent: "ResearchAgent",
    action: "Completó investigación sobre CI/CD para monorepos",
    timestamp: "2025-01-24T12:00:00Z",
    agentColor: "bg-purple-100 text-purple-600",
  },
  {
    id: "a4",
    agent: "TaskAgent",
    action: "Creó 3 tareas desde action items de Sprint Planning",
    timestamp: "2025-01-24T10:45:00Z",
    agentColor: "bg-amber-100 text-amber-600",
  },
  {
    id: "a5",
    agent: "BrainAgent",
    action: "Generó conexiones entre notas de Microservicios y Event Sourcing",
    timestamp: "2025-01-23T16:20:00Z",
    agentColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "a6",
    agent: "RoutineAgent",
    action: "Detectó patrón: productividad +30% después de rutina matutina",
    timestamp: "2025-01-23T11:00:00Z",
    agentColor: "bg-green-100 text-green-800",
  },
];

const improvementAreas: ImprovementArea[] = [
  {
    id: "imp-1",
    title: "Viernes es tu día más débil",
    description: "Tu actividad baja un 40% los viernes. Considera planificar tareas más ligeras o versiones cortas de tus rutinas para cerrar la semana.",
    priority: "high",
  },
  {
    id: "imp-2",
    title: "Pocas notas sobre Mobile",
    description: "Solo tienes 1 nota sobre desarrollo móvil. Si es un área de interés, considera investigar frameworks cross-platform como React Native o Flutter.",
    priority: "medium",
  },
  {
    id: "imp-3",
    title: "Reuniones sin action items",
    description: "3 de tus últimas 8 reuniones no generaron tareas. Asegúrate de definir next steps claros al final de cada meeting.",
    priority: "medium",
  },
  {
    id: "imp-4",
    title: "Deep Work infrautilizado",
    description: "Tu sesión de Deep Work tiene solo 50% de adherencia pero es cuando más produces. Prioriza proteger estos bloques.",
    priority: "high",
  },
];

const priorityStyles: Record<string, string> = {
  high: "border-red-200 bg-red-50",
  medium: "border-amber-200 bg-amber-50",
  low: "border-blue-200 bg-blue-50",
};

const priorityBadge: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-600",
  low: "bg-blue-100 text-blue-800",
};

export default function InsightsPage() {
  const [activeSection] = useState("all");
  const maxTopicCount = Math.max(...topicDistribution.map(t => t.count));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Panorama general de tu productividad y conocimiento
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {statsCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}{stat.suffix}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label} este mes</p>
            </div>
          );
        })}
      </div>

      {/* Activity Graph + Topic Distribution */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
        {/* Weekly Activity */}
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary" />
            Actividad semanal
          </h3>
          <div className="flex items-end gap-2 h-32">
            {weeklyActivity.map(day => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-muted-foreground font-medium">{day.value}%</span>
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${day.value}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            Distribución de contenido por tema
          </h3>
          <div className="space-y-2.5">
            {topicDistribution.map(topic => (
              <div key={topic.topic} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{topic.topic}</span>
                  <span className="text-[10px] text-muted-foreground">{topic.count} items</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${topic.color} transition-all`}
                    style={{ width: `${(topic.count / maxTopicCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge Coverage */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" />
          Knowledge Coverage
        </h2>
        <div className="rounded-xl border bg-card p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {knowledgeAreas.map(area => (
              <div key={area.area} className="text-center">
                <div className="relative mx-auto h-16 w-16 mb-2">
                  {/* Background circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-muted" />
                  {/* Progress circle (approximation using conic gradient) */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(var(--color-primary) ${area.strength * 3.6}deg, transparent ${area.strength * 3.6}deg)`,
                      mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 4px))",
                      WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 4px))",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{area.strength}%</span>
                  </div>
                </div>
                <p className="text-xs font-medium">{area.area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Agent Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5" />
          Acciones recientes de agentes
        </h2>
        <div className="rounded-xl border bg-card divide-y">
          {recentAgentActions.map(action => (
            <div key={action.id} className="flex items-start gap-3 p-3.5">
              <div className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${action.agentColor}`}>
                {action.agent}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{action.action}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(action.timestamp).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Areas of Improvement */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" />
          Áreas de mejora
        </h2>
        <div className="space-y-2">
          {improvementAreas.map(area => (
            <div key={area.id} className={`rounded-xl border p-4 ${priorityStyles[area.priority]}`}>
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{area.title}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityBadge[area.priority]}`}>
                      {area.priority === "high" ? "Alta" : area.priority === "medium" ? "Media" : "Baja"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{area.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
