"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare, FolderKanban, Video, Brain, Search, LayoutDashboard,
  Bot, Repeat, Tag, MessageSquare, Globe, TrendingUp, BarChart3, Network,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  label: string | null;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/tasks", label: "Tareas", icon: CheckSquare },
      { href: "/projects", label: "Proyectos", icon: FolderKanban },
      { href: "/meetings", label: "Reuniones", icon: Video },
      { href: "/routines", label: "Rutinas", icon: Repeat },
    ],
  },
  {
    label: "🧠 HyperBrain",
    items: [
      { href: "/brain", label: "Second Brain", icon: Brain },
      { href: "/brain/topics", label: "Temas", icon: Tag },
      { href: "/brain/research", label: "Investigar", icon: Globe },
      { href: "/brain/chat", label: "Chat IA", icon: MessageSquare },
      { href: "/brain/graph", label: "Grafo", icon: Network },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/routines/insights", label: "Insights Rutinas", icon: TrendingUp },
      { href: "/insights", label: "Insights Globales", icon: BarChart3 },
      { href: "/search", label: "Búsqueda", icon: Search },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || (href !== "/brain" && pathname.startsWith(href));
  }

  return (
    <aside className="flex w-60 flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold tracking-tight">AI Platform</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-3 space-y-4">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            U
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">Usuario</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
