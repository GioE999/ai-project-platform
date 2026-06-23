import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  activeView: "list" | "kanban" | "calendar" | "graph";
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: AppState["activeView"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  activeView: "list",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
}));
