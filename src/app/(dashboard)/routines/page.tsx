"use client";
import { useState, useEffect } from "react";
import { Plus, X, Play, CheckCircle2, Circle, Clock, Pencil, Check, Timer, BarChart3, Sparkles, Brain } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type RoutineCategory = "MORNING" | "EVENING" | "WORKOUT" | "SKINCARE" | "CUSTOM";
type ExecutionStatus = "COMPLETED" | "PARTIAL" | "SKIPPED";
type TrainingPhase = "v1" | "v2" | "v3" | "deload";

interface RoutineStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  completed?: boolean;
}

interface RoutineExecution {
  id: string;
  date: string;
  status: ExecutionStatus;
  notes?: string;
}

interface Routine {
  id: string;
  name: string;
  category: RoutineCategory;
  description?: string;
  isActive: boolean;
  daysOfWeek: string[];
  timeWindow?: string;
  steps: RoutineStep[];
  executions: RoutineExecution[];
  phase?: TrainingPhase;
}

const categoryConfig: Record<RoutineCategory, { label: string; emoji: string; color: string; topicSlug: string }> = {
  MORNING: { label: "Mañana", emoji: "🌅", color: "bg-amber-100 text-amber-800", topicSlug: "productividad-sistemas" },
  EVENING: { label: "Noche", emoji: "🌙", color: "bg-purple-100 text-purple-800", topicSlug: "salud-bienestar" },
  WORKOUT: { label: "Ejercicio", emoji: "💪", color: "bg-red-100 text-red-800", topicSlug: "salud-bienestar" },
  SKINCARE: { label: "Skincare", emoji: "✨", color: "bg-green-100 text-green-800", topicSlug: "salud-bienestar" },
  CUSTOM: { label: "Custom", emoji: "⚡", color: "bg-blue-100 text-blue-800", topicSlug: "productividad-sistemas" },
};

const initialRoutines: Routine[] = [
  {
    id: "r1", name: "Rutina de Mañana", category: "MORNING", description: "Ritual matutino para empezar el día con energía y claridad mental.", isActive: true,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie"], timeWindow: "morning",
    steps: [
      { id: "s1", order: 1, title: "Despertar sin alarma (o suave)", estimatedMinutes: 5 },
      { id: "s2", order: 2, title: "Vaso de agua con limón", estimatedMinutes: 2 },
      { id: "s3", order: 3, title: "Journaling: 3 intenciones del día", estimatedMinutes: 5 },
      { id: "s4", order: 4, title: "Stretching / Yoga suave", estimatedMinutes: 10 },
      { id: "s5", order: 5, title: "Skincare básico (limpiador + protector solar)", estimatedMinutes: 5 },
      { id: "s6", order: 6, title: "Desayuno nutritivo", estimatedMinutes: 15 },
    ],
    executions: [
      { id: "e1", date: "2025-01-20", status: "COMPLETED" },
      { id: "e2", date: "2025-01-21", status: "COMPLETED" },
      { id: "e3", date: "2025-01-22", status: "PARTIAL", notes: "Salté el yoga" },
      { id: "e4", date: "2025-01-23", status: "COMPLETED" },
      { id: "e5", date: "2025-01-24", status: "SKIPPED", notes: "Reunión temprano" },
    ],
  },
  {
    id: "r2", name: "Fuerza V1: Full Body A", category: "WORKOUT", description: "Meses 0–3. Sentadilla, Press Banca, Remo, Plancha. Semana impar: A-B-A / Semana par: B-A-B.", isActive: true, phase: "v1",
    daysOfWeek: ["Lun", "Mié", "Vie"], timeWindow: "morning",
    steps: [
      { id: "s7", order: 1, title: "Calentamiento: 5 min cardio suave + movilidad articular", estimatedMinutes: 8 },
      { id: "s7b", order: 2, title: "Activación: puentes de cadera + band pulls", estimatedMinutes: 3 },
      { id: "s7c", order: 3, title: "Series de activación: 1-2 series al 40-50% del peso", estimatedMinutes: 3 },
      { id: "s8", order: 4, title: "Sentadilla con barra 3x8-10 (60-65% 1RM) — 2 min descanso", estimatedMinutes: 10 },
      { id: "s9", order: 5, title: "Press banca con barra 3x8-10 (60-65% 1RM) — 2 min descanso", estimatedMinutes: 10 },
      { id: "s10", order: 6, title: "Remo con barra inclinado 3x8-10 (60-65% 1RM) — 2 min descanso", estimatedMinutes: 10 },
      { id: "s11", order: 7, title: "Plancha frontal 3x30s — 1 min descanso", estimatedMinutes: 5 },
      { id: "s12", order: 8, title: "Enfriamiento: estiramientos estáticos 30s/posición", estimatedMinutes: 5 },
      { id: "s13", order: 9, title: "Respiración profunda / down-regulate", estimatedMinutes: 3 },
    ],
    executions: [
      { id: "e6", date: "2025-01-20", status: "COMPLETED" },
      { id: "e7", date: "2025-01-22", status: "COMPLETED" },
      { id: "e8", date: "2025-01-24", status: "PARTIAL", notes: "Solo upper body" },
    ],
  },
  {
    id: "r2b", name: "Fuerza V1: Full Body B", category: "WORKOUT", description: "Meses 0–3. Peso muerto, Press militar, Jalón, Zancadas. Semana impar: A-B-A / Semana par: B-A-B.", isActive: true, phase: "v1",
    daysOfWeek: ["Lun", "Mié", "Vie"], timeWindow: "morning",
    steps: [
      { id: "s30", order: 1, title: "Calentamiento: 5 min cardio suave + movilidad articular", estimatedMinutes: 8 },
      { id: "s31", order: 2, title: "Activación: puentes de cadera + band pulls", estimatedMinutes: 3 },
      { id: "s32", order: 3, title: "Series de activación: 1-2 series al 40-50% del peso", estimatedMinutes: 3 },
      { id: "s33", order: 4, title: "Peso muerto con barra 3x6-8 (60-65% 1RM) — 3 min descanso", estimatedMinutes: 12 },
      { id: "s34", order: 5, title: "Press militar con mancuernas 3x8-10 (60-65% 1RM) — 2 min descanso", estimatedMinutes: 10 },
      { id: "s35", order: 6, title: "Jalón al pecho o dominadas asistidas 3x8-10 — 2 min descanso", estimatedMinutes: 10 },
      { id: "s36", order: 7, title: "Zancadas con peso corporal 3x10 c/pierna — 1.5 min descanso", estimatedMinutes: 8 },
      { id: "s37", order: 8, title: "Enfriamiento: estiramientos estáticos 30s/posición", estimatedMinutes: 5 },
      { id: "s38", order: 9, title: "Respiración profunda / down-regulate", estimatedMinutes: 3 },
    ],
    executions: [],
  },
  {
    id: "r2c", name: "Fuerza V2: Upper", category: "WORKOUT", description: "Meses 3–8. Press banca, Remo, Press militar, Dominadas, Bíceps, Tríceps. 70–80% 1RM.", isActive: true, phase: "v2",
    daysOfWeek: ["Lun", "Jue"], timeWindow: "morning",
    steps: [
      { id: "s40", order: 1, title: "Calentamiento: cardio + movilidad + activación escapular", estimatedMinutes: 10 },
      { id: "s41", order: 2, title: "Press de banca con barra 4x6-8 (75-80% 1RM) — 3 min", estimatedMinutes: 15 },
      { id: "s42", order: 3, title: "Remo con barra inclinado 4x6-8 (75-80% 1RM) — 3 min", estimatedMinutes: 15 },
      { id: "s43", order: 4, title: "Press militar con barra 3x8-10 (70-75% 1RM) — 2 min", estimatedMinutes: 10 },
      { id: "s44", order: 5, title: "Dominadas (peso corporal/lastradas) 3x6-10 — 2 min", estimatedMinutes: 10 },
      { id: "s45", order: 6, title: "Curl bíceps con barra 3x10-12 — 90s", estimatedMinutes: 7 },
      { id: "s46", order: 7, title: "Extensión tríceps cable 3x10-12 — 90s", estimatedMinutes: 7 },
      { id: "s47", order: 8, title: "Enfriamiento: estiramientos + respiración", estimatedMinutes: 6 },
    ],
    executions: [],
  },
  {
    id: "r2d", name: "Fuerza V2: Lower", category: "WORKOUT", description: "Meses 3–8. Sentadilla, RDL, Prensa, Curl isquio, Pantorrillas, Core. 70–85% 1RM.", isActive: true, phase: "v2",
    daysOfWeek: ["Mar", "Vie"], timeWindow: "morning",
    steps: [
      { id: "s50", order: 1, title: "Calentamiento: cardio + movilidad cadera + activación glúteos", estimatedMinutes: 10 },
      { id: "s51", order: 2, title: "Sentadilla con barra 4x5-8 (75-85% 1RM) — 3 min", estimatedMinutes: 15 },
      { id: "s52", order: 3, title: "Peso muerto rumano 4x8-10 (70-75% 1RM) — 2.5 min", estimatedMinutes: 12 },
      { id: "s53", order: 4, title: "Prensa de piernas 3x10-12 (70% 1RM) — 2 min", estimatedMinutes: 10 },
      { id: "s54", order: 5, title: "Curl isquiotibiales 3x10-12 — 90s", estimatedMinutes: 7 },
      { id: "s55", order: 6, title: "Elevaciones pantorrilla de pie 4x12-15 — 60s", estimatedMinutes: 7 },
      { id: "s56", order: 7, title: "Core: rueda abdominal 3x8-10 — 60s", estimatedMinutes: 5 },
      { id: "s57", order: 8, title: "Enfriamiento: estiramientos + respiración", estimatedMinutes: 6 },
    ],
    executions: [],
  },
  {
    id: "r2e", name: "Fuerza V3: Push", category: "WORKOUT", description: "Meses 8+. Press banca, Inclinado, Militar, Laterales, Fondos, Tríceps. 80-87% 1RM.", isActive: true, phase: "v3",
    daysOfWeek: ["Lun", "Vie"], timeWindow: "morning",
    steps: [
      { id: "s60", order: 1, title: "Calentamiento: cardio + movilidad + activación escapular", estimatedMinutes: 10 },
      { id: "s61", order: 2, title: "Press banca con barra 5x4-6 (80-87% 1RM) — 3-4 min", estimatedMinutes: 20 },
      { id: "s62", order: 3, title: "Press inclinado mancuernas 4x8-10 (70-75% 1RM) — 2.5 min", estimatedMinutes: 12 },
      { id: "s63", order: 4, title: "Press militar sentado barra 4x6-8 (78-83% 1RM) — 3 min", estimatedMinutes: 15 },
      { id: "s64", order: 5, title: "Elevaciones laterales 4x12-15 — 60-90s", estimatedMinutes: 8 },
      { id: "s65", order: 6, title: "Fondos paralelas lastrados 3x8-12 — 2 min", estimatedMinutes: 8 },
      { id: "s66", order: 7, title: "Extensión tríceps overhead 3x10-12 — 90s", estimatedMinutes: 7 },
      { id: "s67", order: 8, title: "Enfriamiento: estiramientos + respiración", estimatedMinutes: 6 },
    ],
    executions: [],
  },
  {
    id: "r2f", name: "Fuerza V3: Pull", category: "WORKOUT", description: "Meses 8+. Peso muerto, Dominadas lastradas, Remo Pendlay, Cable, Curls. 82-90% 1RM.", isActive: true, phase: "v3",
    daysOfWeek: ["Mar", "Sáb"], timeWindow: "morning",
    steps: [
      { id: "s70", order: 1, title: "Calentamiento: cardio + movilidad + activación dorsal", estimatedMinutes: 10 },
      { id: "s71", order: 2, title: "Peso muerto convencional 5x3-5 (82-90% 1RM) — 4-5 min", estimatedMinutes: 22 },
      { id: "s72", order: 3, title: "Dominadas lastradas 4x6-8 — 3 min", estimatedMinutes: 14 },
      { id: "s73", order: 4, title: "Remo Pendlay 4x5-7 (78-83% 1RM) — 3 min", estimatedMinutes: 14 },
      { id: "s74", order: 5, title: "Remo polea horizontal 3x10-12 — 2 min", estimatedMinutes: 8 },
      { id: "s75", order: 6, title: "Curl barra EZ 4x8-10 (70-75% 1RM) — 90s", estimatedMinutes: 8 },
      { id: "s76", order: 7, title: "Curl martillo alterno 3x10 c/brazo — 90s", estimatedMinutes: 7 },
      { id: "s77", order: 8, title: "Enfriamiento: estiramientos + respiración", estimatedMinutes: 6 },
    ],
    executions: [],
  },
  {
    id: "r2g", name: "Fuerza V3: Legs", category: "WORKOUT", description: "Meses 8+. Sentadilla, RDL, Prensa, Extensiones, Curl, Pantorrillas, Hip thrust. 83-90% 1RM.", isActive: true, phase: "v3",
    daysOfWeek: ["Mié"], timeWindow: "morning",
    steps: [
      { id: "s80", order: 1, title: "Calentamiento: cardio + movilidad cadera + activación glúteos", estimatedMinutes: 10 },
      { id: "s81", order: 2, title: "Sentadilla con barra 5x3-5 (83-90% 1RM) — 4 min", estimatedMinutes: 20 },
      { id: "s82", order: 3, title: "Peso muerto rumano 4x8-10 (75-80% 1RM) — 3 min", estimatedMinutes: 14 },
      { id: "s83", order: 4, title: "Prensa piernas 4x8-12 (75% 1RM) — 2.5 min", estimatedMinutes: 12 },
      { id: "s84", order: 5, title: "Extensión cuádriceps 3x12-15 — 90s", estimatedMinutes: 7 },
      { id: "s85", order: 6, title: "Curl isquiotibiales 3x12-15 — 90s", estimatedMinutes: 7 },
      { id: "s86", order: 7, title: "Elevación pantorrilla 5x15-20 — 60s", estimatedMinutes: 8 },
      { id: "s87", order: 8, title: "Hip thrust barra 4x8-10 (75-80% 1RM) — 2 min", estimatedMinutes: 10 },
      { id: "s88", order: 9, title: "Enfriamiento: estiramientos + respiración", estimatedMinutes: 6 },
    ],
    executions: [],
  },
  {
    id: "r2h", name: "Deload: Full Body Ligero", category: "WORKOUT", description: "Semana de recuperación cada 4–6 semanas. Volumen 50%, peso 60–70%. Mismos movimientos, sin fallo.", isActive: true, phase: "deload",
    daysOfWeek: ["Lun", "Mié", "Vie"], timeWindow: "morning",
    steps: [
      { id: "sd1", order: 1, title: "Calentamiento: 5 min cardio suave + movilidad completa", estimatedMinutes: 8 },
      { id: "sd2", order: 2, title: "Sentadilla 2x8 al 60% del peso habitual — foco en técnica perfecta", estimatedMinutes: 6 },
      { id: "sd3", order: 3, title: "Press banca / militar 2x8 al 60% — tempo lento (3-1-2)", estimatedMinutes: 6 },
      { id: "sd4", order: 4, title: "Remo / Jalón 2x8 al 60% — conexión mente-músculo", estimatedMinutes: 6 },
      { id: "sd5", order: 5, title: "Core: plancha 2x30s + respiración diafragmática", estimatedMinutes: 4 },
      { id: "sd6", order: 6, title: "Estiramientos prolongados 45s/posición + foam roller", estimatedMinutes: 10 },
    ],
    executions: [],
  },
  {
    id: "r3", name: "Skincare Noche", category: "SKINCARE", description: "Rutina de cuidado facial antes de dormir. Limpiar, tratar, hidratar.", isActive: true,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"], timeWindow: "evening",
    steps: [
      { id: "s14", order: 1, title: "Doble limpieza (aceite + gel)", estimatedMinutes: 3 },
      { id: "s15", order: 2, title: "Tónico / Esencia", estimatedMinutes: 1 },
      { id: "s16", order: 3, title: "Sérum (retinol o niacinamida)", estimatedMinutes: 1 },
      { id: "s17", order: 4, title: "Crema hidratante", estimatedMinutes: 1 },
      { id: "s18", order: 5, title: "Contorno de ojos", estimatedMinutes: 1 },
    ],
    executions: [
      { id: "e9", date: "2025-01-20", status: "COMPLETED" },
      { id: "e10", date: "2025-01-21", status: "COMPLETED" },
      { id: "e11", date: "2025-01-22", status: "COMPLETED" },
      { id: "e12", date: "2025-01-23", status: "COMPLETED" },
      { id: "e13", date: "2025-01-24", status: "COMPLETED" },
    ],
  },
  {
    id: "r4", name: "Deep Work Session", category: "CUSTOM", description: "Bloque de trabajo profundo sin distracciones. Ideal para coding o escritura.", isActive: true,
    daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie"], timeWindow: "morning",
    steps: [
      { id: "s19", order: 1, title: "Cerrar redes sociales y notificaciones", estimatedMinutes: 2 },
      { id: "s20", order: 2, title: "Definir objetivo de la sesión", estimatedMinutes: 3 },
      { id: "s21", order: 3, title: "Pomodoro 1 (25 min foco)", estimatedMinutes: 25 },
      { id: "s22", order: 4, title: "Descanso corto (5 min)", estimatedMinutes: 5 },
      { id: "s23", order: 5, title: "Pomodoro 2 (25 min foco)", estimatedMinutes: 25 },
      { id: "s24", order: 6, title: "Revisión: qué logré, qué sigue", estimatedMinutes: 5 },
    ],
    executions: [
      { id: "e14", date: "2025-01-22", status: "COMPLETED" },
      { id: "e15", date: "2025-01-23", status: "COMPLETED" },
    ],
  },
];

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [activeTab, setActiveTab] = useState<"steps" | "execute" | "stats">("steps");
  const [showForm, setShowForm] = useState(false);
  const [executingSteps, setExecutingSteps] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: "", category: "CUSTOM" as RoutineCategory, description: "" });
  const [trainingPhase, setTrainingPhase] = useState<TrainingPhase>("v1");

  // V1 alternation: week-based A-B-A / B-A-B pattern
  const currentWeekNumber = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const isOddWeek = currentWeekNumber % 2 === 1;
  // Odd week: A-B-A (Mon=A, Wed=B, Fri=A) | Even week: B-A-B (Mon=B, Wed=A, Fri=B)
  const todayDayIndex = new Date().getDay(); // 0=Sun, 1=Mon... 5=Fri
  const v1TodayRoutine: "A" | "B" | null = (() => {
    if (![1, 3, 5].includes(todayDayIndex)) return null; // Not a training day
    const daySlot = todayDayIndex === 1 ? 0 : todayDayIndex === 3 ? 1 : 2; // Mon=0, Wed=1, Fri=2
    const pattern = isOddWeek ? ["A", "B", "A"] : ["B", "A", "B"];
    return pattern[daySlot] as "A" | "B";
  })();

  // Filter: show non-workout routines always + only workouts matching selected phase
  const visibleRoutines = routines.filter(r => !r.phase || r.phase === trainingPhase);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedRoutine(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function addRoutine(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const r: Routine = { id: crypto.randomUUID(), name: form.name, category: form.category, description: form.description, isActive: true, daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie"], steps: [], executions: [] };
    setRoutines([...routines, r]);
    setForm({ name: "", category: "CUSTOM", description: "" });
    setShowForm(false);
  }

  function toggleStep(stepId: string) {
    setExecutingSteps(prev => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  }

  function completeExecution() {
    if (!selectedRoutine) return;
    const totalSteps = selectedRoutine.steps.length;
    const completedSteps = executingSteps.size;
    const status: ExecutionStatus = completedSteps === totalSteps ? "COMPLETED" : completedSteps > 0 ? "PARTIAL" : "SKIPPED";
    const exec: RoutineExecution = { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), status };
    setRoutines(routines.map(r => r.id === selectedRoutine.id ? { ...r, executions: [...r.executions, exec] } : r));
    setSelectedRoutine({ ...selectedRoutine, executions: [...selectedRoutine.executions, exec] });
    setExecutingSteps(new Set());
    setActiveTab("stats");
  }

  function getAdherence(r: Routine) {
    if (r.executions.length === 0) return 0;
    const completed = r.executions.filter(e => e.status === "COMPLETED").length;
    return Math.round((completed / r.executions.length) * 100);
  }

  function getTotalMinutes(steps: RoutineStep[]) {
    return steps.reduce((acc, s) => acc + (s.estimatedMinutes || 0), 0);
  }

  const tabs = [
    { id: "steps" as const, label: "Pasos", icon: CheckCircle2 },
    { id: "execute" as const, label: "Ejecutar", icon: Play },
    { id: "stats" as const, label: "Estadísticas", icon: BarChart3 },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rutinas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{visibleRoutines.length} visibles · {routines.reduce((acc, r) => acc + r.executions.length, 0)} ejecuciones totales</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Nueva Rutina"}
        </button>
      </div>

      {/* Training Phase Selector */}
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Fase de entrenamiento:</span>
          <div className="flex gap-1">
            <button onClick={() => setTrainingPhase("v1")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${trainingPhase === "v1" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>V1 · Principiante (0–3m)</button>
            <button onClick={() => setTrainingPhase("v2")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${trainingPhase === "v2" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>V2 · Intermedio (3–8m)</button>
            <button onClick={() => setTrainingPhase("v3")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${trainingPhase === "v3" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>V3 · Avanzado (8m+)</button>
            <button onClick={() => setTrainingPhase("deload")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${trainingPhase === "deload" ? "bg-amber-500 text-white" : "bg-muted hover:bg-muted/80"}`}>💤 Deload</button>
          </div>
        </div>
        {trainingPhase === "v1" && v1TodayRoutine && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs">
            <span className="font-medium text-primary">Hoy toca:</span> Full Body {v1TodayRoutine} (Semana {currentWeekNumber} — {isOddWeek ? "A-B-A" : "B-A-B"})
          </div>
        )}
        {trainingPhase === "deload" && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            💤 <span className="font-medium">Semana de Deload:</span> Volumen al 50%, peso al 60–70%. Mismos movimientos, menos carga. Recuperación activa del SNC.
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={addRoutine} className="mb-6 rounded-xl border bg-card p-4 space-y-3">
          <input type="text" placeholder="Nombre de la rutina" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as RoutineCategory })} className="rounded-lg border bg-transparent px-3 py-2 text-sm">
              {Object.entries(categoryConfig).map(([key, cfg]) => <option key={key} value={key}>{cfg.emoji} {cfg.label}</option>)}
            </select>
            <input type="text" placeholder="Descripción (opcional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Crear Rutina</button>
        </form>
      )}

      {/* Routine Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleRoutines.map(routine => {
          const cfg = categoryConfig[routine.category];
          const adherence = getAdherence(routine);
          const totalMin = getTotalMinutes(routine.steps);
          return (
            <button key={routine.id} onClick={() => { setSelectedRoutine(routine); setActiveTab("steps"); setExecutingSteps(new Set()); }} className="rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{cfg.emoji}</span>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{routine.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{routine.description}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{routine.steps.length} pasos</span>
                <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{totalMin} min</span>
                <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{adherence}% adherencia</span>
                <Link href={`/brain?topic=${cfg.topicSlug}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-primary hover:underline">
                  <Brain className="h-3 w-3" />Brain
                </Link>
              </div>
              <div className="mt-2 flex gap-1">
                {routine.daysOfWeek.map(d => <span key={d} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium">{d}</span>)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedRoutine && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={() => setSelectedRoutine(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l bg-background shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryConfig[selectedRoutine.category].emoji}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{selectedRoutine.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedRoutine.description}</p>
                    <Link href={`/brain?topic=${categoryConfig[selectedRoutine.category].topicSlug}`} className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-primary hover:underline">
                      <Brain className="h-3 w-3" />Ver conocimiento relacionado en Brain
                    </Link>
                  </div>
                </div>
                <button onClick={() => setSelectedRoutine(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b px-5 bg-muted/30">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <tab.icon className="h-3.5 w-3.5" />{tab.label}
                    {activeTab === tab.id && <motion.div layoutId="routineTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                {activeTab === "steps" && (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{selectedRoutine.steps.length} pasos · {getTotalMinutes(selectedRoutine.steps)} min total</p>
                    </div>
                    <div className="space-y-2">
                      {selectedRoutine.steps.map((step, i) => (
                        <div key={step.id} className="flex items-start gap-3 rounded-lg border p-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{step.title}</p>
                            {step.description && <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>}
                          </div>
                          {step.estimatedMinutes && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0"><Clock className="h-3 w-3" />{step.estimatedMinutes}m</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {selectedRoutine.daysOfWeek.map(d => <span key={d} className="rounded bg-muted px-2 py-1 text-xs font-medium">{d}</span>)}
                    </div>
                  </div>
                )}

                {activeTab === "execute" && (
                  <div className="p-5 space-y-4">
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
                      <p className="text-sm font-medium">Modo Ejecución</p>
                      <p className="text-xs text-muted-foreground">Marca cada paso al completarlo</p>
                    </div>
                    <div className="space-y-2">
                      {selectedRoutine.steps.map(step => (
                        <button key={step.id} onClick={() => toggleStep(step.id)} className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${executingSteps.has(step.id) ? "bg-green-100 border-green-200" : "hover:bg-accent/50"}`}>
                          {executingSteps.has(step.id) ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> : <Circle className="h-5 w-5 text-gray-400 shrink-0" />}
                          <span className={`text-sm ${executingSteps.has(step.id) ? "line-through text-muted-foreground" : "font-medium"}`}>{step.title}</span>
                          {step.estimatedMinutes && <span className="ml-auto text-xs text-muted-foreground">{step.estimatedMinutes}m</span>}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">{executingSteps.size}/{selectedRoutine.steps.length} completados</p>
                      <button onClick={completeExecution} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Finalizar Ejecución</button>
                    </div>
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border p-3 text-center">
                        <p className="text-2xl font-bold">{selectedRoutine.executions.length}</p>
                        <p className="text-[10px] text-muted-foreground">Ejecuciones</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{getAdherence(selectedRoutine)}%</p>
                        <p className="text-[10px] text-muted-foreground">Adherencia</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center">
                        <p className="text-2xl font-bold">{selectedRoutine.executions.filter(e => e.status === "COMPLETED").length}</p>
                        <p className="text-[10px] text-muted-foreground">Completas</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Historial reciente</h3>
                      <div className="space-y-1.5">
                        {selectedRoutine.executions.slice(-7).reverse().map(exec => (
                          <div key={exec.id} className="flex items-center justify-between rounded-lg border p-2.5">
                            <span className="text-xs">{exec.date}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${exec.status === "COMPLETED" ? "bg-green-100 text-green-800" : exec.status === "PARTIAL" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                              {exec.status === "COMPLETED" ? "✅ Completa" : exec.status === "PARTIAL" ? "⚡ Parcial" : "⏭️ Omitida"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {getAdherence(selectedRoutine) < 70 && (
                      <div className="rounded-xl bg-amber-100 border border-amber-200 p-3">
                        <p className="text-xs font-medium text-amber-800 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />Sugerencia IA</p>
                        <p className="text-xs text-amber-700 mt-1">Tu adherencia está por debajo del 70%. Considera reducir la cantidad de pasos o ajustar el horario para mejorar la consistencia.</p>
                      </div>
                    )}
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
