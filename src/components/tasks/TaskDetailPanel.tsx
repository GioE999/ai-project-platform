"use client";
import { useState, useEffect, useRef } from "react";
import { X, Send, Calendar, Flag, Clock, Pencil, Check, MessageSquare, History, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TaskStatus, Priority } from "@/types";

interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  projectId?: string;
}

interface Message {
  id: string;
  content: string;
  author: string;
  authorType: "user" | "agent";
  createdAt: string;
}

const statusOptions: { value: TaskStatus; label: string; color: string; dot: string }[] = [
  { value: "pending", label: "Pendiente", color: "bg-gray-100 text-gray-800 border-gray-200", dot: "bg-gray-400" },
  { value: "in_progress", label: "En progreso", color: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500" },
  { value: "review", label: "Revisión", color: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-amber-500" },
  { value: "blocked", label: "Bloqueado", color: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500" },
  { value: "completed", label: "Completado", color: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500" },
];

const priorityOptions: { value: Priority; label: string; icon: string }[] = [
  { value: "high", label: "Alta", icon: "🔴" },
  { value: "medium", label: "Media", icon: "🟡" },
  { value: "low", label: "Baja", icon: "🟢" },
];

const sampleMessages: Message[] = [
  { id: "m1", content: "He empezado con los wireframes. Comparto el link de Figma cuando tenga el draft inicial.", author: "Carlos", authorType: "user", createdAt: "2025-01-08T10:30:00" },
  { id: "m2", content: "Recuerda incluir la vista mobile desde el inicio.", author: "Ana", authorType: "user", createdAt: "2025-01-08T11:15:00" },
  { id: "m3", content: "Basado en el contexto del proyecto, sugiero usar un layout de 3 columnas con sidebar colapsable para desktop. Esto mejorará la navegación según patrones similares en tu base de conocimiento.", author: "AI Assistant", authorType: "agent", createdAt: "2025-01-08T11:20:00" },
];

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskDetailPanel({ task, onClose, onUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "conversation" | "activity">("details");
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setEditName(task.name);
      setEditDesc(task.description);
      setActiveTab("details");
    }
  }, [task?.id]);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingDesc && descRef.current) descRef.current.focus();
  }, [editingDesc]);

  function saveName() {
    if (task && editName.trim()) {
      onUpdate(task.id, { name: editName.trim() });
      setEditingName(false);
    }
  }

  function saveDesc() {
    if (task) {
      onUpdate(task.id, { description: editDesc });
      setEditingDesc(false);
    }
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: crypto.randomUUID(), content: newMessage, author: "Tú", authorType: "user", createdAt: new Date().toISOString() }]);
    setNewMessage("");
  }

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={onClose} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l bg-background shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b px-5 py-4">
              <div className="flex-1 min-w-0 pr-4">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input ref={nameRef} value={editName} onChange={e => setEditName(e.target.value)} onBlur={saveName} onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }} className="flex-1 rounded-md border bg-transparent px-2 py-1 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary" />
                    <button onClick={saveName} className="rounded p-1 text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button onClick={() => setEditingName(true)} className="group flex items-center gap-2 text-left">
                    <h2 className="text-lg font-semibold leading-tight">{task.name}</h2>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-1">Creada {new Date(task.createdAt).toLocaleDateString("es", { day: "numeric", month: "short" })}</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors" aria-label="Cerrar panel"><X className="h-5 w-5" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-5 bg-muted/30">
              {([
                { id: "details" as const, label: "Detalles", icon: Settings2 },
                { id: "conversation" as const, label: "Conversación", icon: MessageSquare },
                { id: "activity" as const, label: "Actividad", icon: History },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="panelTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "details" && (
                <div className="p-5 space-y-5">
                  {/* Description - Editable */}
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descripción</label>
                    {editingDesc ? (
                      <div className="mt-1.5">
                        <textarea ref={descRef} value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                        <div className="mt-1.5 flex gap-2">
                          <button onClick={saveDesc} className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90">Guardar</button>
                          <button onClick={() => { setEditDesc(task.description); setEditingDesc(false); }} className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-muted/80">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setEditingDesc(true)} className="mt-1.5 w-full text-left group">
                        <p className="text-sm text-foreground/80 leading-relaxed">{task.description || <span className="text-muted-foreground italic">Click para agregar descripción...</span>}</p>
                        <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Click para editar</span>
                      </button>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {statusOptions.map(opt => (
                        <button key={opt.value} onClick={() => onUpdate(task.id, { status: opt.value })} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${task.status === opt.value ? `${opt.color} shadow-sm scale-105` : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                          <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</label>
                    <div className="mt-2 flex gap-2">
                      {priorityOptions.map(opt => (
                        <button key={opt.value} onClick={() => onUpdate(task.id, { priority: opt.value })} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${task.priority === opt.value ? "border-primary/40 bg-primary/5 shadow-sm" : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                          <span>{opt.icon}</span>{opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due Date - Editable */}
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha límite</label>
                    <div className="mt-1.5">
                      <input type="date" value={task.dueDate ? task.dueDate.slice(0, 10) : ""} onChange={e => onUpdate(task.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })} className="rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>

                  {/* Project Assignment */}
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proyecto</label>
                    <select value={task.projectId || ""} onChange={e => onUpdate(task.id, { projectId: e.target.value || undefined })} className="mt-1.5 w-full rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Sin proyecto</option>
                      <option value="p1">MVP Plataforma v1.0</option>
                      <option value="p2">Integración Google Meet</option>
                      <option value="p3">Sistema de Notificaciones</option>
                    </select>
                  </div>

                  {/* Metadata */}
                  <div className="rounded-xl bg-muted/30 border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" />Creada</span><span>{new Date(task.createdAt).toLocaleString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
                    <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1.5"><Flag className="h-3 w-3" />ID</span><span className="font-mono text-muted-foreground">{task.id.slice(0, 8)}</span></div>
                  </div>
                </div>
              )}

              {activeTab === "conversation" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-auto p-5 space-y-3">
                    {messages.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Sin mensajes aún. Inicia la conversación.</p>}
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.author === "Tú" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.authorType === "agent" ? "bg-primary/5 border border-primary/20 rounded-bl-md" : msg.author === "Tú" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-semibold ${msg.authorType === "agent" ? "text-primary" : msg.author === "Tú" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.authorType === "agent" ? "🤖 AI" : msg.author}</span>
                            <span className={`text-[10px] ${msg.author === "Tú" ? "text-primary-foreground/50" : "text-muted-foreground"}`}>{new Date(msg.createdAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className="border-t p-3 flex gap-2 bg-muted/20">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escribe un mensaje o pregunta a la IA..." className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <button type="submit" className="rounded-xl bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 transition-colors"><Send className="h-4 w-4" /></button>
                  </form>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="p-5">
                  <div className="space-y-4">
                    {[
                      { action: "Estado cambiado a 'En progreso'", time: "hace 2h", user: "Carlos" },
                      { action: "Descripción actualizada", time: "hace 4h", user: "Carlos" },
                      { action: "Prioridad cambiada a 'Alta'", time: "hace 1d", user: "Ana" },
                      { action: "Asignada al proyecto 'MVP Plataforma'", time: "hace 2d", user: "Ana" },
                      { action: "Tarea creada", time: "hace 3d", user: "Carlos" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        {i < 4 && <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />}
                        <div className="mt-1 h-3.5 w-3.5 rounded-full border-2 border-primary/40 bg-background shrink-0 z-10" />
                        <div>
                          <p className="text-sm">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.user} · {item.time}</p>
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
  );
}
