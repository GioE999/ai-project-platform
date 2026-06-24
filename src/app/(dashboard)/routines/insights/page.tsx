"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Target, Flame, Calendar, Brain, Sparkles, AlertCircle, BookOpen } from "lucide-react";

type CompletionStatus = "complete" | "partial" | "missed";
type TrendDirection = "up" | "down" | "stable";

interface RoutineInsight {
  id: string;
  name: string;
  emoji: string;
  adherence: number;
  trend: TrendDirection;
  totalExecutions: number;
  weeklyData: number[];
  recommendation: string;
}

interface WeeklyCell {
  day: string;
  week: number;
  status: CompletionStatus;
}

interface AIRecommendation {
  id: string;
  type: "warning" | "success" | "suggestion" | "insight";
  message: string;
}

interface KnowledgeGap {
  topic: string;
  noteCount: number;
  suggestion: string;
}

const routineInsights: RoutineInsight[] = [
  {
    id: "r1",
    name: "Rutina de Mañana",
    emoji: "🌅",
    adherence: 80,
    trend: "up",
    totalExecutions: 16,
    weeklyData: [70, 75, 80, 95],
    recommendation: "Excelente progresión. Mantén este ritmo y en 2 semanas podrías llegar al 90%.",
  },
  {
    id: "r2",
    name: "Entrenamiento Full Body",
    emoji: "💪",
    adherence: 67,
    trend: "down",
    totalExecutions: 8,
    weeklyData: [100, 67, 67, 33],
    recommendation: "Tu adherencia está bajando. Considera reducir a 2x semana o acortar la sesión los viernes.",
  },
  {
    id: "r3",
    name: "Skincare Noche",
    emoji: "✨",
    adherence: 100,
    trend: "stable",
    totalExecutions: 28,
    weeklyData: [100, 100, 100, 100],
    recommendation: "Perfecto. 4 semanas consecutivas al 100%. Esta rutina está completamente integrada en tu vida.",
  },
  {
    id: "r4",
    name: "Deep Work Session",
    emoji: "⚡",
    adherence: 50,
    trend: "up",
    totalExecutions: 10,
    weeklyData: [20, 40, 60, 80],
    recommendation: "Gran mejora semana a semana. La tendencia es positiva, sigue así.",
  },
];

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const heatmapData: WeeklyCell[] = [
  // Week 1
  { day: "Lun", week: 1, status: "complete" }, { day: "Mar", week: 1, status: "complete" },
  { day: "Mié", week: 1, status: "partial" }, { day: "Jue", week: 1, status: "complete" },
  { day: "Vie", week: 1, status: "missed" }, { day: "Sáb", week: 1, status: "complete" },
  { day: "Dom", week: 1, status: "missed" },
  // Week 2
  { day: "Lun", week: 2, status: "complete" }, { day: "Mar", week: 2, status: "complete" },
  { day: "Mié", week: 2, status: "complete" }, { day: "Jue", week: 2, status: "partial" },
  { day: "Vie", week: 2, status: "missed" }, { day: "Sáb", week: 2, status: "complete" },
  { day: "Dom", week: 2, status: "partial" },
  // Week 3
  { day: "Lun", week: 3, status: "complete" }, { day: "Mar", week: 3, status: "complete" },
  { day: "Mié", week: 3, status: "complete" }, { day: "Jue", week: 3, status: "complete" },
  { day: "Vie", week: 3, status: "partial" }, { day: "Sáb", week: 3, status: "complete" },
  { day: "Dom", week: 3, status: "complete" },
  // Week 4
  { day: "Lun", week: 4, status: "complete" }, { day: "Mar", week: 4, status: "complete" },
  { day: "Mié", week: 4, status: "complete" }, { day: "Jue", week: 4, status: "complete" },
  { day: "Vie", week: 4, status: "complete" }, { day: "Sáb", week: 4, status: "complete" },
  { day: "Dom", week: 4, status: "partial" },
];

const aiRecommendations: AIRecommendation[] = [
  {
    id: "ai-1",
    type: "warning",
    message: "Tu adherencia baja los viernes. Considera una versión corta de la rutina para ese día.",
  },
  {
    id: "ai-2",
    type: "success",
    message: "Llevas 5 días consecutivos completando Skincare Noche. ¡Gran consistencia!",
  },
  {
    id: "ai-3",
    type: "suggestion",
    message: "El entrenamiento Full Body tiene 67% de adherencia. ¿Quieres reducir a 2x semana?",
  },
  {
    id: "ai-4",
    type: "insight",
    message: "Tu Deep Work session funciona mejor cuando completas la rutina de mañana primero.",
  },
];

const knowledgeGaps: KnowledgeGap[] = [
  { topic: "Nutrición", noteCount: 1, suggestion: "Investiga sobre macros y meal prep para complementar tu rutina de entrenamiento." },
  { topic: "Meditación", noteCount: 0, suggestion: "Añadir una práctica de mindfulness podría mejorar tu adherencia general." },
  { topic: "Recuperación", noteCount: 1, suggestion: "Documenta técnicas de recuperación activa para optimizar tus días de descanso." },
];

const statusColors: Record<CompletionStatus, string> = {
  complete: "bg-green-500",
  partial: "bg-yellow-400",
  missed: "bg-gray-200",
};

const recommendationStyles: Record<string, { bg: string; icon: typeof Sparkles; color: string }> = {
  warning: { bg: "bg-amber-50 border-amber-200", icon: AlertCircle, color: "text-amber-600" },
  success: { bg: "bg-green-50 border-green-200", icon: Flame, color: "text-green-600" },
  suggestion: { bg: "bg-blue-50 border-blue-200", icon: Sparkles, color: "text-blue-600" },
  insight: { bg: "bg-purple-50 border-purple-200", icon: Brain, color: "text-purple-600" },
};

export default function RoutineInsightsPage() {
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);

  const totalExecutions = routineInsights.reduce((acc, r) => acc + r.totalExecutions, 0);
  const overallAdherence = Math.round(routineInsights.reduce((acc, r) => acc + r.adherence, 0) / routineInsights.length);
  const bestStreak = 28;
  const mostConsistent = routineInsights.reduce((best, r) => r.adherence > best.adherence ? r : best);

  function getTrendIcon(trend: TrendDirection) {
    if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-600" />;
    return <Minus className="h-3.5 w-3.5 text-gray-500" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Insights de Rutinas
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Análisis basado en tus últimas 4 semanas
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{totalExecutions}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Ejecuciones totales</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{overallAdherence}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Adherencia global</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{bestStreak}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Mejor racha (días)</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-lg font-bold">{mostConsistent.emoji}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Más consistente</p>
        </div>
      </div>

      {/* Per-Routine Breakdown */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Desglose por rutina
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {routineInsights.map(routine => (
            <div
              key={routine.id}
              onClick={() => setSelectedRoutine(selectedRoutine === routine.id ? null : routine.id)}
              className="rounded-xl border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{routine.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold">{routine.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{routine.totalExecutions} ejecuciones</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {getTrendIcon(routine.trend)}
                  <span className="text-lg font-bold">{routine.adherence}%</span>
                </div>
              </div>

              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-12 mb-2">
                {routine.weeklyData.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className={`w-full rounded-sm transition-all ${value >= 80 ? "bg-green-500" : value >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-[8px] text-muted-foreground">S{i + 1}</span>
                  </div>
                ))}
              </div>

              {selectedRoutine === routine.id && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    {routine.recommendation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Heatmap */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Mapa de calor semanal
        </h2>
        <div className="rounded-xl border bg-card p-4">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-[10px] text-muted-foreground" />
            {weekDays.map(day => (
              <div key={day} className="text-[10px] text-muted-foreground text-center font-medium">{day}</div>
            ))}
          </div>
          {/* Weeks */}
          {[1, 2, 3, 4].map(week => (
            <div key={week} className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-[10px] text-muted-foreground flex items-center">S{week}</div>
              {weekDays.map(day => {
                const cell = heatmapData.find(c => c.week === week && c.day === day);
                return (
                  <div
                    key={`${week}-${day}`}
                    className={`h-7 rounded-md ${cell ? statusColors[cell.status] : "bg-gray-100"}`}
                    title={`${day} S${week}: ${cell?.status || "N/A"}`}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-green-500" />
              <span className="text-[10px] text-muted-foreground">Completo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-yellow-400" />
              <span className="text-[10px] text-muted-foreground">Parcial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-gray-200" />
              <span className="text-[10px] text-muted-foreground">Omitido</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Recomendaciones IA
        </h2>
        <div className="space-y-2">
          {aiRecommendations.map(rec => {
            const style = recommendationStyles[rec.type];
            const Icon = style.icon;
            return (
              <div key={rec.id} className={`flex items-start gap-3 rounded-xl border p-3.5 ${style.bg}`}>
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.color}`} />
                <p className="text-sm">{rec.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Knowledge Gaps */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          Knowledge Gaps
        </h2>
        <div className="space-y-2">
          {knowledgeGaps.map(gap => (
            <div key={gap.topic} className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 shrink-0">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">{gap.topic}</h4>
                  <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-medium">
                    {gap.noteCount} {gap.noteCount === 1 ? "nota" : "notas"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{gap.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
