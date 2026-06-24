"use client";
import { useState, useEffect, useRef } from "react";
import { Search, FileText, FlaskConical, Lightbulb, FolderOpen, Activity, X, ArrowRight } from "lucide-react";

interface CommandPaletteProps {
  onAction: (action: string, payload?: any) => void;
  topicName?: string;
  notes?: { id: string; title: string }[];
}

interface Command {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  group: string;
}

const commands: Command[] = [
  { id: "new-note", label: "Crear nota de Brain", icon: FileText, shortcut: "N", group: "Crear" },
  { id: "new-research", label: "Nueva investigación", icon: FlaskConical, shortcut: "R", group: "Crear" },
  { id: "new-learning", label: "Agregar aprendizaje", icon: Lightbulb, shortcut: "L", group: "Crear" },
  { id: "new-idea", label: "Capturar idea", icon: Lightbulb, shortcut: "I", group: "Crear" },
  { id: "open-graph", label: "Abrir grafo de conocimiento", icon: FolderOpen, shortcut: "G", group: "Navegar" },
  { id: "open-research", label: "Ir a investigaciones", icon: FlaskConical, shortcut: "⇧R", group: "Navegar" },
  { id: "filter-draft", label: "Filtrar: solo borradores", icon: Activity, group: "Filtrar" },
  { id: "filter-published", label: "Filtrar: solo publicados", icon: Activity, group: "Filtrar" },
  { id: "filter-all", label: "Mostrar todo", icon: Activity, group: "Filtrar" },
];

export function CommandPalette({ onAction, topicName, notes = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery("");
        setSelectedIdx(0);
      }
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSelectedIdx(0);
    }
  }, [open]);

  if (!open) return null;

  // Merge commands with note titles for "open" functionality
  const noteCommands: Command[] = notes
    .filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(n => ({
      id: `open-note-${n.id}`,
      label: n.title,
      icon: FileText,
      group: "Abrir nota",
    }));

  const allCommands = [
    ...commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())),
    ...noteCommands,
  ];

  // Group commands
  const groups: Record<string, Command[]> = {};
  allCommands.forEach(cmd => {
    if (!groups[cmd.group]) groups[cmd.group] = [];
    groups[cmd.group].push(cmd);
  });

  function execute(cmd: Command) {
    if (cmd.id.startsWith("open-note-")) {
      onAction("open-note", cmd.id.replace("open-note-", ""));
    } else if (cmd.id === "open-graph") {
      window.location.href = "/brain/graph";
    } else if (cmd.id === "open-research") {
      window.location.href = "/brain/research";
    } else {
      onAction(cmd.id);
    }
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, allCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && allCommands[selectedIdx]) {
      e.preventDefault();
      execute(allCommands[selectedIdx]);
    }
  }

  let flatIdx = 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed top-[18%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg rounded-xl border bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder={topicName ? `Acciones para "${topicName}"...` : "Escribe un comando o nombre de nota..."}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-auto p-2">
          {Object.entries(groups).map(([group, cmds]) => (
            <div key={group} className="mb-2">
              <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{group}</p>
              {cmds.map(cmd => {
                const Icon = cmd.icon;
                const idx = flatIdx++;
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/50"}`}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-left truncate">{cmd.label}</span>
                    {cmd.shortcut && <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">⌘{cmd.shortcut}</kbd>}
                    {cmd.id.startsWith("open-note-") && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          ))}
          {allCommands.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Sin resultados para "{query}"</p>}
        </div>
      </div>
    </>
  );
}
