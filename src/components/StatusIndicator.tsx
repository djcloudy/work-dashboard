interface StatusIndicatorProps {
  label: string;
  value?: string | number;
  status?: "ok" | "warning" | "error" | "unknown";
}

const statusColors: Record<string, string> = {
  ok: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  unknown: "bg-muted-foreground",
};

export function StatusIndicator({ label, value, status = "unknown" }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm">
      <span className={`h-2 w-2 rounded-full ${statusColors[status]} animate-pulse-dot`} />
      <span className="text-muted-foreground">{label}</span>
      {value !== undefined && (
        <>
          <span className="text-muted-foreground">:</span>
          <span className="font-semibold text-foreground">{value}</span>
        </>
      )}
    </div>
  );
}
