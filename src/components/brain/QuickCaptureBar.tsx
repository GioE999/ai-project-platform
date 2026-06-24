"use client";
import { useState } from "react";
import { Lightbulb, Send } from "lucide-react";

interface QuickCaptureBarProps {
  activeTopic?: string;
  onCapture?: (data: { content: string; type: string; topic?: string }) => void;
}

export function QuickCaptureBar({ activeTopic, onCapture }: QuickCaptureBarProps) {
  const [value, setValue] = useState("");
  const [type, setType] = useState("learning");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onCapture?.({ content: value.trim(), type, topic: activeTopic });
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5">
      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={activeTopic ? `Captura rápida en "${activeTopic}"...` : "Captura un aprendizaje rápido..."}
        className="flex-1 bg-transparent text-sm focus:outline-none"
      />
      <select value={type} onChange={e => setType(e.target.value)} className="rounded border bg-transparent px-2 py-1 text-[10px] text-muted-foreground">
        <option value="learning">💡 Aprendizaje</option>
        <option value="note">📝 Nota</option>
        <option value="idea">💭 Idea</option>
      </select>
      <button type="submit" disabled={!value.trim()} className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-colors">
        <Send className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
