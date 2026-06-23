"use client";

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}

export function ProjectDetailView({ project }: { project: Project }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{project.name}</h2>
      {project.description && (
        <p className="mt-2 text-muted-foreground">{project.description}</p>
      )}
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">Tareas ({project.tasks.length})</h3>
        <div className="space-y-2">
          {project.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
              <span>{task.name}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs">{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
