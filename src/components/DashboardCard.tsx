import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
