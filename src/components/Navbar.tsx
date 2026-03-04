import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Lab", path: "/lab" },
  { label: "Chat", path: "/chat" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-primary" />
        <h1 className="text-lg font-bold tracking-tight">Monarch Run Dashboard</h1>
        <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">alpha</span>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <StatusIndicator label="Clusters" value="—" status="unknown" />
        <StatusIndicator label="Offline" value="—" status="unknown" />
        <StatusIndicator label="Kuber" status="unknown" />
        <StatusIndicator label="Vault" status="unknown" />
        <StatusIndicator label="AWX" status="unknown" />
      </div>

      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          to="/settings"
          className={`ml-1 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </header>
  );
}
