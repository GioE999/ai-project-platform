"use client";
import { useState, useEffect, useCallback } from "react";

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects", { headers: getAuthHeaders() });
      if (res.ok) setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (data: { name: string; description?: string }) => {
    const res = await fetch("/api/projects", { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Failed to create project");
    const project = await res.json();
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  return { projects, loading, fetchProjects, createProject };
}
