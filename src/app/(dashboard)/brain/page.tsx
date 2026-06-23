"use client";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Plus, FileText, Link2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const initialNotes: Note[] = [
  { id: "n1", title: "Arquitectura del Sistema", content: "## Visión General\n\nEl sistema sigue una arquitectura de [[Microservicios]] con comunicación asíncrona.\n\nBase de datos principal: [[PostgreSQL]] con extensiones para búsqueda vectorial.\n\n### Componentes\n- API Gateway (Next.js App Router)\n- Servicios backend independientes\n- Cola de mensajes para eventos", updatedAt: "2025-01-10" },
  { id: "n2", title: "Microservicios", content: "## Patrón de Microservicios\n\nCada servicio tiene su propia base de datos y se comunica mediante eventos.\n\nInfraestructura:\n- [[API Gateway]] para routing y auth\n- [[Docker]] para containerización\n- Kubernetes para orquestación\n\n### Servicios actuales\n1. Auth Service\n2. Task Service\n3. Notification Service", updatedAt: "2025-01-09" },
  { id: "n3", title: "PostgreSQL", content: "## PostgreSQL como DB principal\n\nUsamos [[pgvector]] para embeddings de búsqueda semántica.\n\nORM: [[Prisma]] con migraciones automáticas.\n\n### Configuración\n- Pool de conexiones: 20\n- Réplicas de lectura: 2\n- Backups diarios automatizados", updatedAt: "2025-01-08" },
  { id: "n4", title: "Reunión Sprint 11", content: "## Notas de la Reunión\n\nProyecto: [[MVP Plataforma]]\n\n### Temas discutidos\n- Progreso del sprint\n- Blockers identificados\n- Planning para sprint 12\n\n### [[Action Items]]\n- Revisar PRs pendientes\n- Actualizar documentación\n- Preparar demo para stakeholders", updatedAt: "2025-01-07" },
  { id: "n5", title: "Ideas de Producto", content: "## Brainstorming\n\nBasado en [[UX Research]] del Q4:\n\n- Dashboard personalizable\n- Integración con Slack\n- [[Roadmap]] visual estilo timeline\n- AI-powered task prioritization\n- Templates de proyectos\n\n### Prioridad alta\n- Búsqueda semántica (en progreso)\n- Notificaciones inteligentes", updatedAt: "2025-01-06" },
];

function extractWikilinks(content: string): string[] {
  const matches = content.match(/\[\[([^\]]+)\]\]/g);
  return matches ? matches.map(m => m.slice(2, -2)) : [];
}

function getBacklinks(noteTitle: string, notes: Note[]) {
  return notes.filter(n => n.id !== noteTitle && extractWikilinks(n.content).some(link => link.toLowerCase() === noteTitle.toLowerCase()));
}

function renderContentWithLinks(content: string): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, '<span class="text-primary font-medium bg-primary/10 px-1 rounded cursor-pointer">$1</span>');
}

export default function BrainPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedId, setSelectedId] = useState<string>("n1");

  const selectedNote = notes.find(n => n.id === selectedId) || notes[0];
  const backlinks = selectedNote ? getBacklinks(selectedNote.title, notes) : [];
  const wikilinks = selectedNote ? extractWikilinks(selectedNote.content) : [];

  const editor = useEditor({
    extensions: [StarterKit],
    content: selectedNote?.content || "",
    editorProps: { attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4" } },
  });

  useEffect(() => {
    if (editor && selectedNote) {
      editor.commands.setContent(selectedNote.content);
    }
  }, [selectedId, editor, selectedNote]);

  function addNote() {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Nueva Nota",
      content: "Escribe aquí...",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  }

  function saveNote() {
    if (!editor || !selectedNote) return;
    setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content: editor.getHTML(), updatedAt: new Date().toISOString().slice(0, 10) } : n));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Second Brain</h1>
        <button onClick={addNote} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />Nueva Nota
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Note List */}
        <div className="lg:col-span-1 space-y-2">
          {notes.map(note => (
            <button key={note.id} onClick={() => setSelectedId(note.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedId === note.id ? "border-primary bg-primary/5" : "hover:bg-accent"}`}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-medium truncate">{note.title}</h4>
                  <p className="text-xs text-muted-foreground">{note.updatedAt}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Editor + Graph */}
        <div className="lg:col-span-2 space-y-4">
          {selectedNote && (
            <>
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="border-b px-4 py-3 flex items-center justify-between">
                  <h2 className="font-semibold">{selectedNote.title}</h2>
                  <button onClick={saveNote} className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">Guardar</button>
                </div>
                <EditorContent editor={editor} />
              </div>

              {/* Wikilinks and Backlinks */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-4">
                  <h3 className="mb-2 text-sm font-semibold flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" />Enlaces ({wikilinks.length})</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {wikilinks.map((link, i) => (
                      <span key={i} className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">{link}</span>
                    ))}
                    {wikilinks.length === 0 && <p className="text-xs text-muted-foreground">Sin enlaces</p>}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <h3 className="mb-2 text-sm font-semibold">Backlinks ({backlinks.length})</h3>
                  <div className="space-y-1">
                    {backlinks.map(bl => (
                      <button key={bl.id} onClick={() => setSelectedId(bl.id)} className="block text-xs text-primary hover:underline">{bl.title}</button>
                    ))}
                    {backlinks.length === 0 && <p className="text-xs text-muted-foreground">Sin backlinks</p>}
                  </div>
                </div>
              </div>

              {/* Simple Graph Visualization */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">Grafo de Conocimiento</h3>
                <div className="relative h-48 flex items-center justify-center">
                  <div className="absolute rounded-full bg-primary w-14 h-14 flex items-center justify-center text-[10px] text-primary-foreground font-medium text-center leading-tight px-1 shadow-md z-10">
                    {selectedNote.title.split(" ").slice(0, 2).join(" ")}
                  </div>
                  {wikilinks.slice(0, 6).map((link, i) => {
                    const angle = (i * 360) / Math.min(wikilinks.length, 6);
                    const radius = 80;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    return (
                      <div key={i} className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
                        <div className="rounded-full bg-muted border w-12 h-12 flex items-center justify-center text-[9px] text-center leading-tight px-1 font-medium">
                          {link.split(" ").slice(0, 2).join(" ")}
                        </div>
                      </div>
                    );
                  })}
                  {/* Lines from center to nodes */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
                    {wikilinks.slice(0, 6).map((_, i) => {
                      const angle = (i * 360) / Math.min(wikilinks.length, 6);
                      const radius = 80;
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;
                      return <line key={i} x1="50%" y1="50%" x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />;
                    })}
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
