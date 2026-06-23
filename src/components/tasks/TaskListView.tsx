"use client";
import { useState } from "react";
import type { TaskStatus, Priority } from "@/types";

interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
}

const statusColors: Record<TaskStatus, string> = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
  review: "bg-yellow-100 text-yellow-800",
};

const priorityLabels: Record<Priority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export function TaskListView({ tasks }: { tasks: Task[] }) {
  const [sortBy, setSortBy] = useState<"priority" | "status" | "createdAt">("createdAt");

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["createdAt", "priority", "status"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`rounded-md px-3 py-1 text-xs ${
              sortBy === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {s === "createdAt" ? "Fecha" : s === "priority" ? "Prioridad" : "Estado"}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.map((task) => (
          <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <span className="font-medium">{task.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-xs ${statusColors[task.status]}`}>
                {task.status}
              </span>
              <span className="text-xs text-muted-foreground">{priorityLabels[task.priority]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
