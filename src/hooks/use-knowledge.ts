import { useState, useCallback } from "react";
import type { KnowledgeNote, CreateKnowledgeNoteInput, KnowledgeNoteType } from "@/types/knowledge";

export function useKnowledge() {
  const [loading, setLoading] = useState(false);

  const createNote = useCallback(async (data: CreateKnowledgeNoteInput): Promise<KnowledgeNote | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return res.json();
    } finally {
      setLoading(false);
    }
  }, []);

  const createFromEntity = useCallback(async (opts: {
    entityType: "task" | "project" | "meeting" | "routine";
    entityId: string;
    title: string;
    content: string;
    topicId?: string;
    noteType?: KnowledgeNoteType;
    tags?: string[];
  }): Promise<KnowledgeNote | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge/from-entity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });
      if (!res.ok) return null;
      return res.json();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByTopic = useCallback(async (topicId: string): Promise<KnowledgeNote[]> => {
    const res = await fetch(`/api/knowledge?topicId=${topicId}`);
    if (!res.ok) return [];
    return res.json();
  }, []);

  const fetchGraph = useCallback(async (topicId?: string) => {
    const url = topicId ? `/api/knowledge/graph?topicId=${topicId}` : "/api/knowledge/graph";
    const res = await fetch(url);
    if (!res.ok) return { nodes: [], edges: [] };
    return res.json();
  }, []);

  return { createNote, createFromEntity, fetchByTopic, fetchGraph, loading };
}
