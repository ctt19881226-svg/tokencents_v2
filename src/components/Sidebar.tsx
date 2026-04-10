import { Key, BarChart, Play, Book, Settings, LogOut, Activity } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activePage, setActivePage, onLogout }: SidebarProps) {
  const navItems = [
    { id: "keys", icon: Key, label: "API Keys" },
    { id: "usage", icon: BarChart, label: "Usage" },
    { id: "playground", icon: Play, label: "Playground" },
    { id: "docs", icon: Book, label: "Docs" },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#09090b] p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 text-xl font-bold mb-10 text-zinc-100">
        <Activity className="text-indigo-500" />
        <span>TokenCents</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-zinc-800 text-zinc-100" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-zinc-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors">
          <Settings size={18} />
          Settings
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
