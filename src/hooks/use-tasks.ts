"use client";
import { useState, useEffect, useCallback } from "react";
import type { TaskStatus, Priority } from "@/types";

interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  projectId?: string;
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

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data: { name: string; description?: string; projectId?: string }) => {
    const res = await fetch("/api/tasks", { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Failed to create task");
    const task = await res.json();
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateStatus = async (id: string, status: TaskStatus) => {
    const res = await fetch(`/api/tasks/${id}/status`, { method: "PATCH", headers: getAuthHeaders(), body: JSON.stringify({ status }) });
    if (!res.ok) throw new Error("Failed to update status");
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  return { tasks, loading, error, fetchTasks, createTask, updateStatus };
}
