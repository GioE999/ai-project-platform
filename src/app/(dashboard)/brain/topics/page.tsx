"use client";
import { useState, useEffect } from "react";
import { Plus, X, Tag } from "lucide-react";
import { TopicsGrid } from "@/components/brain/TopicsGrid";
import { TopicEcosystemPanel } from "@/components/brain/TopicEcosystemPanel";
import type { Topic } from "@/types/topics";
import type { TopicEcosystem } from "@/types/knowledge";

const fallbackTopics: Topic[] = [
  { id: "t1", name: "Arquitectura", slug: "arquitectura", color: "bg-blue-100 text-blue-800", icon: "🏗️", noteCount: 3, taskCount: 2, meetingCount: 1, researchCount: 1, projectCount: 0, routineCount: 0, learningCount: 0 },
  { id: "t2", name: "Productividad", slug: "productividad", color: "bg-green-100 text-green-800", icon: "⚡", noteCount: 2, taskCount: 4, meetingCount: 2, researchCount: 1, projectCount: 0, routineCount: 0, learningCount: 0 },
  { id: "t3", name: "DevOps", slug: "devops", color: "bg-purple-100 text-purple-800", icon: "🔧", noteCount: 2, taskCount: 3, meetingCount: 0, researchCount: 1, projectCount: 0, routineCount: 0, learningCount: 0 },
  { id: "t4", name: "UX/UI", slug: "ux-ui", color: "bg-amber-100 text-amber-800", icon: "🎨", noteCount: 2, taskCount: 2, meetingCount: 1, researchCount: 0, projectCount: 0, routineCount: 0, learningCount: 0 },
  { id: "t5", name: "Salud & Bienestar", slug: "salud-bienestar", color: "bg-green-100 text-green-800", icon: "🧘", noteCount: 1, taskCount: 0, meetingCount: 0, researchCount: 1, projectCount: 0, routineCount: 2, learningCount: 4 },
  { id: "t6", name: "IA & ML", slug: "ia-ml", color: "bg-yellow-100 text-yellow-800", icon: "🤖", noteCount: 0, taskCount: 0, meetingCount: 0, researchCount: 0, projectCount: 0, routineCount: 0, learningCount: 0 },
];

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>(fallbackTopics);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [ecosystem, setEcosystem] = useState<TopicEcosystem | null>(null);

  useEffect(() => {
    fetch("/api/topics").then(r => r.ok ? r.json() : null).then(data => {
      if (data && data.length > 0) setTopics(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedTopic) { setEcosystem(null); return; }
    fetch(`/api/topics/${selectedTopic.id}/ecosystem`).then(r => r.ok ? r.json() : null).then(data => {
      if (data) setEcosystem(data);
    }).catch(() => {
      setEcosystem({
        topic: { ...selectedTopic, lifeArea: "PERSONAL" as const, createdAt: new Date().toISOString(), researchCount: selectedTopic.researchCount || 0, projectCount: selectedTopic.projectCount || 0, routineCount: selectedTopic.routineCount || 0, taskCount: selectedTopic.taskCount || 0, meetingCount: selectedTopic.meetingCount || 0, noteCount: selectedTopic.noteCount || 0, learningCount: selectedTopic.learningCount || 0, checklistCount: 0, guideCount: 0, journalCount: 0, resourceCount: 0 },
        researches: [], notes: [], checklists: [], guides: [], journals: [], recipes: [], resources: [], tasks: [], projects: [], routines: [], meetings: [], learnings: [],
      });
    });
  }, [selectedTopic]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setSelectedTopic(null); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleCreateTopic(data: { name: string; icon: string }) {
    const t: Topic = { id: crypto.randomUUID(), name: data.name, slug: data.name.toLowerCase().replace(/\s+/g, "-"), icon: data.icon, noteCount: 0, taskCount: 0, meetingCount: 0, researchCount: 0, projectCount: 0, routineCount: 0, learningCount: 0 };
    setTopics([...topics, t]);
    fetch("/api/topics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tag className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Temas</h1>
          <p className="text-xs text-muted-foreground">{topics.length} temas · Organiza tu conocimiento por categorías</p>
        </div>
      </div>

      <TopicsGrid
        topics={topics}
        selectedTopicId={selectedTopic?.id || null}
        onSelectTopic={t => setSelectedTopic(t.id === selectedTopic?.id ? null : t)}
        onCreateTopic={handleCreateTopic}
      />

      {ecosystem && selectedTopic && (
        <TopicEcosystemPanel ecosystem={ecosystem} />
      )}
    </div>
  );
}
