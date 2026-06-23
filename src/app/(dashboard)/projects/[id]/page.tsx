"use client";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";

export default function ProjectDetailPage() {
  const project = { id: "", name: "Loading...", tasks: [] }; // TODO: fetch
  return <ProjectDetailView project={project} />;
}
