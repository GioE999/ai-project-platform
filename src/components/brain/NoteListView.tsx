"use client";

interface Note {
  id: string;
  title: string;
  updatedAt: string;
}

export function NoteListView({ notes, onSelect }: { notes: Note[]; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelect(note.id)}
          className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent"
        >
          <h4 className="font-medium">{note.title}</h4>
          <p className="text-xs text-muted-foreground">
            {new Date(note.updatedAt).toLocaleDateString("es")}
          </p>
        </button>
      ))}
    </div>
  );
}
