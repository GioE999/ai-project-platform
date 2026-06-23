"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

interface NoteEditorProps {
  initialContent?: string;
  title?: string;
  onSave: (data: { title: string; content: string }) => void;
}

export function NoteEditor({ initialContent = "", title: initialTitle = "", onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  function handleSave() {
    if (!editor) return;
    const content = editor.getText();
    onSave({ title, content });
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b p-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la nota..."
          className="w-full bg-transparent text-lg font-semibold placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <EditorContent editor={editor} />
      <div className="flex justify-end border-t p-3">
        <button
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
