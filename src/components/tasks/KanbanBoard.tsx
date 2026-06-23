"use client";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { TaskStatus } from "@/types";

interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  priority: string;
}

const columns: { id: TaskStatus; label: string }[] = [
  { id: "pending", label: "Pendiente" },
  { id: "in_progress", label: "En Progreso" },
  { id: "review", label: "Revisión" },
  { id: "blocked", label: "Bloqueado" },
  { id: "completed", label: "Completado" },
];

export function KanbanBoard({
  tasks,
  onStatusChange,
}: {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (columns.some((col) => col.id === newStatus)) {
      onStatusChange(taskId, newStatus);
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-5 gap-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="rounded-lg bg-muted/50 p-3">
              <h3 className="mb-3 text-sm font-semibold">{col.label}</h3>
              <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2" id={col.id}>
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-md border bg-card p-2 text-sm shadow-sm"
                    >
                      {task.name}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
