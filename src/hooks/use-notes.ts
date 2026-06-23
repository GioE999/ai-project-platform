"use client";
import { useState, useEffect, useCallback } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notes", { headers: getAuthHeaders() });
      if (res.ok) setNotes(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const createNote = async (data: { title: string; content: string }) => {
    const res = await fetch("/api/notes", { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Failed to create note");
    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const updateNote = async (id: string, data: { title?: string; content?: string }) => {
    const res = await fetch(`/api/notes/${id}`, { method: "PATCH", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Failed to update note");
    const updated = await res.json();
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  return { notes, loading, fetchNotes, createNote, updateNote };
}
