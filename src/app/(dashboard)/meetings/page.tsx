"use client";
import { useState, useEffect } from "react";
import { Plus, X, Video, Clock, Calendar, Users, Sparkles, Settings2, Pencil, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Meeting {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  status: "scheduled" | "completed";
  meetUrl: string;
  project?: string;
  participants: { name: string; initials: string; color: string }[];
  summary?: { overview: string; decisions: string[]; actionItems: string[] };
}

const today = new Date();
const fmtDate = (daysOffset: number, hour = 10, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const initialMeetings: Meeting[] = [
  {
    id: "m1", title: "Sprint Planning #12", scheduledAt: fmtDate(1, 10), duration: 60, status: "scheduled",
    meetUrl: "https://meet.google.com/abc-defg-hij", project: "MVP Plataforma",
    participants: [
      { name: "Carlos Mendoza", initials: "CM", color: "bg-blue-100 text-blue-800" },
      { name: "Ana García", initials: "AG", color: "bg-purple-100 text-purple-600" },
      { name: "Pedro Ruiz", initials: "PR", color: "bg-green-100 text-green-800" },
      { name: "María López", initials: "ML", color: "bg-amber-100 text-amber-600" },
    ],
  },
  {
    id: "m2", title: "Review de Diseño UI", scheduledAt: fmtDate(3, 15), duration: 30, status: "scheduled",
    meetUrl: "https://meet.google.com/xyz-uvwx-rst", project: "MVP Plataforma",
    participants: [
      { name: "Ana García", initials: "AG", color: "bg-purple-100 text-purple-600" },
      { name: "María López", initials: "ML", color: "bg-amber-100 text-amber-600" },
      { name: "Luis Torres", initials: "LT", color: "bg-red-100 text-red-800" },
    ],
  },
  {
    id: "m3", title: "1:1 con Ana", scheduledAt: fmtDate(5, 11), duration: 30, status: "scheduled",
    meetUrl: "https://meet.google.com/one-onon-ana",
    participants: [
      { name: "Carlos Mendoza", initials: "CM", color: "bg-blue-100 text-blue-800" },
      { name: "Ana García", initials: "AG", color: "bg-purple-100 text-purple-600" },
    ],
  },
  {
    id: "m4", title: "Retrospectiva Sprint 11", scheduledAt: fmtDate(-5, 11), duration: 45, status: "completed",
    meetUrl: "https://meet.google.com/ret-rosp-11x", project: "MVP Plataforma",
    participants: [
      { name: "Carlos Mendoza", initials: "CM", color: "bg-blue-100 text-blue-800" },
      { name: "Ana García", initials: "AG", color: "bg-purple-100 text-purple-600" },
      { name: "Pedro Ruiz", initials: "PR", color: "bg-green-100 text-green-800" },
    ],
    summary: {
      overview: "El equipo revisó los logros del sprint 11. Se completaron 8 de 10 tareas planificadas. Se identificaron cuellos de botella en el proceso de code review que afectan la velocidad del equipo.",
      decisions: [
        "Limitar PRs a máximo 400 líneas para facilitar revisiones",
        "Agregar linting automático en pre-commit hooks",
        "Rotar el rol de reviewer principal semanalmente",
      ],
      actionItems: [
        "Configurar pre-commit hooks con ESLint y Prettier - Carlos",
        "Documentar guía de code review para el equipo - Ana",
        "Crear dashboard de métricas del sprint en Grafana - Pedro",
      ],
    },
  },
  {
    id: "m5", title: "Kickoff Integración Meet", scheduledAt: fmtDate(-10, 14), duration: 60, status: "completed",
    meetUrl: "https://meet.google.com/kof-meet-int", project: "Integración Google Meet",
    participants: [
      { name: "Carlos Mendoza", initials: "CM", color: "bg-blue-100 text-blue-800" },
      { name: "Luis Torres", initials: "LT", color: "bg-red-100 text-red-800" },
      { name: "María López", initials: "ML", color: "bg-amber-100 text-amber-600" },
      { name: "Pedro Ruiz", initials: "PR", color: "bg-green-100 text-green-800" },
    ],
    summary: {
      overview: "Se definió el alcance de la integración con Google Meet. El equipo acordó un enfoque incremental comenzando con calendar sync antes de abordar grabación y transcripción automática.",
      decisions: [
        "Usar OAuth2 con scopes mínimos para mayor seguridad",
        "Implementar calendar sync antes que recording",
        "Priorizar UX de vinculación de cuenta como primer milestone",
      ],
      actionItems: [
        "Crear spike técnico de OAuth con Google Workspace - Luis",
        "Diseñar flujo UX de vinculación de cuenta - María",
        "Investigar límites y quotas de Google Calendar API - Carlos",
      ],
    },
  },
];

const projectOptions = ["MVP Plataforma", "Integración Google Meet", "Sistema de Notificaciones"];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [showForm, setShowForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "summary" | "participants">("details");
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [form, setForm] = useState({ title: "", date: "", duration: "30", project: "" });

  const upcoming = meetings.filter(m => m.status === "scheduled").sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = meetings.filter(m => m.status === "completed").sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  useEffect(() => {
    if (selectedMeeting) {
      setEditTitle(selectedMeeting.title);
      setActiveTab("details");
    }
  }, [selectedMeeting?.id]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedMeeting(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function addMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      title: form.title,
      scheduledAt: new Date(form.date).toISOString(),
      duration: parseInt(form.duration),
      status: "scheduled",
      meetUrl: `https://meet.google.com/${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`,
      project: form.project || undefined,
      participants: [{ name: "Carlos Mendoza", initials: "CM", color: "bg-blue-100 text-blue-800" }],
    };
    setMeetings([...meetings, newMeeting]);
    setForm({ title: "", date: "", duration: "30", project: "" });
    setShowForm(false);
  }

  function updateMeeting(id: string, updates: Partial<Meeting>) {
    setMeetings(meetings.map(m => m.id === id ? { ...m, ...updates } : m));
    if (selectedMeeting?.id === id) setSelectedMeeting({ ...selectedMeeting, ...updates });
  }

  function saveTitle() {
    if (selectedMeeting && editTitle.trim()) {
      updateMeeting(selectedMeeting.id, { title: editTitle.trim() });
      setEditingTitle(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function formatDateLong(iso: string) {
    return new Date(iso).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const tabs = [
    { id: "details" as const, label: "Detalles", icon: Settings2 },
    { id: "summary" as const, label: "Resumen IA", icon: Sparkles },
    { id: "participants" as const, label: "Participantes", icon: Users },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reuniones</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{upcoming.length} próximas · {past.length} completadas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Programar Reunión"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addMeeting} className="mb-6 rounded-xl border bg-card p-4 space-y-3">
          <input type="text" placeholder="Título de la reunión" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-3">
            <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="rounded-lg border bg-transparent px-3 py-2 text-sm">
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </select>
            <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm">
              <option value="">Sin proyecto</option>
              {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Programar</button>
        </form>
      )}

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Próximas</h2>
        <div className="space-y-2">
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No hay reuniones próximas</p>}
          {upcoming.map(m => (
            <button key={m.id} onClick={() => setSelectedMeeting(m)} className="w-full rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{m.title}</h3>
                  <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(m.scheduledAt)}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800">{m.duration} min</span>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">Programada</span>
                    {m.project && <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-600">{m.project}</span>}
                  </div>
                </div>
                <a href={m.meetUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1.5 text-sm text-green-700 hover:bg-green-200 shrink-0">
                  <Video className="h-4 w-4" />Unirse
                </a>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Past */}
      <section>
        <h2 className="mb-3 text-lg font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />Pasadas</h2>
        <div className="space-y-2">
          {past.map(m => (
            <button key={m.id} onClick={() => setSelectedMeeting(m)} className="w-full rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{m.title}</h3>
                  <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                    <span>{formatDate(m.scheduledAt)}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800">{m.duration} min</span>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">Completada</span>
                    {m.project && <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-600">{m.project}</span>}
                  </div>
                </div>
                {m.summary && (
                  <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs text-primary shrink-0">
                    <Sparkles className="h-3 w-3" />Resumen disponible
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedMeeting && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={() => setSelectedMeeting(null)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l bg-background shadow-2xl">

              {/* Header */}
              <div className="flex items-start justify-between border-b px-5 py-4">
                <div className="flex-1 min-w-0 pr-4">
                  {editingTitle ? (
                    <div className="flex items-center gap-2">
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)} onBlur={saveTitle} onKeyDown={e => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }} className="flex-1 rounded-md border bg-transparent px-2 py-1 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                      <button onClick={saveTitle} className="rounded p-1 text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingTitle(true)} className="group flex items-center gap-2 text-left">
                      <h2 className="text-lg font-semibold leading-tight">{selectedMeeting.title}</h2>
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{formatDateLong(selectedMeeting.scheduledAt)}</p>
                </div>
                <button onClick={() => setSelectedMeeting(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors" aria-label="Cerrar panel"><X className="h-5 w-5" /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b px-5 bg-muted/30">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {activeTab === tab.id && <motion.div layoutId="meetingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                {activeTab === "details" && (
                  <div className="p-5 space-y-5">
                    {/* Date & Time */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha y hora</label>
                      <p className="mt-1.5 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDateLong(selectedMeeting.scheduledAt)}
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Duración</label>
                      <p className="mt-1.5 text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {selectedMeeting.duration} minutos
                      </p>
                    </div>

                    {/* Meet URL */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Enlace de Meet</label>
                      <a href={selectedMeeting.meetUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex items-center gap-2 text-sm text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                        {selectedMeeting.meetUrl}
                      </a>
                    </div>

                    {/* Project */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proyecto</label>
                      <select value={selectedMeeting.project || ""} onChange={e => updateMeeting(selectedMeeting.id, { project: e.target.value || undefined })} className="mt-1.5 w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Sin proyecto</option>
                        {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
                      <div className="mt-2 flex gap-2">
                        {([{ value: "scheduled" as const, label: "Programada", color: "bg-blue-100 text-blue-800" }, { value: "completed" as const, label: "Completada", color: "bg-green-100 text-green-800" }]).map(opt => (
                          <button key={opt.value} onClick={() => updateMeeting(selectedMeeting.id, { status: opt.value })} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${selectedMeeting.status === opt.value ? `${opt.color} border-current shadow-sm` : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="rounded-xl bg-muted/30 border p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Users className="h-3 w-3" />Participantes</span>
                        <span>{selectedMeeting.participants.length} personas</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Video className="h-3 w-3" />ID</span>
                        <span className="font-mono text-muted-foreground">{selectedMeeting.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "summary" && (
                  <div className="p-5 space-y-5">
                    {selectedMeeting.status === "scheduled" ? (
                      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
                        <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">El resumen se generará automáticamente después de la reunión</p>
                        <p className="text-xs text-muted-foreground mt-1">Incluirá overview, decisiones y action items</p>
                      </div>
                    ) : selectedMeeting.summary ? (
                      <>
                        <div>
                          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" />Resumen General</h3>
                          <p className="text-sm text-foreground/80 leading-relaxed">{selectedMeeting.summary.overview}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Decisiones</h3>
                          <ul className="space-y-2">
                            {selectedMeeting.summary.decisions.map((d, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm">
                                <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                                <span className="text-foreground/80">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Action Items</h3>
                          <ul className="space-y-2">
                            {selectedMeeting.summary.actionItems.map((a, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm">
                                <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                                <span className="text-foreground/80">{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
                        <p className="text-sm text-muted-foreground">No se generó resumen para esta reunión</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "participants" && (
                  <div className="p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Participantes ({selectedMeeting.participants.length})</h3>
                    <div className="space-y-2">
                      {selectedMeeting.participants.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${p.color}`}>
                            {p.initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{i === 0 ? "Organizador" : "Participante"}</p>
                          </div>
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
