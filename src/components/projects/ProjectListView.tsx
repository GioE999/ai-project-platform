"use client";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description?: string;
  progress?: { percentage: number };
}

export function ProjectListView({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="block rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{project.name}</h3>
              {project.description && (
                <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
              )}
            </div>
            {project.progress && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${project.progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{project.progress.percentage}%</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
