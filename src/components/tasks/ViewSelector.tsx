"use client";
import { motion } from "framer-motion";
import { useAppStore } from "@/hooks/stores";
import { List, LayoutGrid, Calendar } from "lucide-react";

export function ViewSelector() {
  const { activeView, setActiveView } = useAppStore();

  const views = [
    { id: "list" as const, label: "Lista", icon: List },
    { id: "kanban" as const, label: "Kanban", icon: LayoutGrid },
    { id: "calendar" as const, label: "Calendario", icon: Calendar },
  ];

  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveView(id)}
          className="relative rounded-md px-3 py-1.5 text-sm"
        >
          {activeView === id && (
            <motion.div
              layoutId="activeView"
              className="absolute inset-0 rounded-md bg-background shadow-sm"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
