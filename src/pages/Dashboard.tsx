import { ExternalLink, Clock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { useJiraInProgress, useGitHubReviews, useTodoistTasks } from "@/hooks/use-api";

function priorityLabel(p: number) {
  if (p >= 4) return "🔴";
  if (p >= 3) return "🟠";
  if (p >= 2) return "🟡";
  return "⚪";
}

export default function Dashboard() {
  const jira = useJiraInProgress();
  const github = useGitHubReviews();
  const todoist = useTodoistTasks();

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Jira */}
        <DashboardCard title="Jira — In Progress">
          <QueryState query={jira} emptyMsg="No in-progress stories.">
            {(issues) => (
              <div className="space-y-4">
                {issues.map((item) => (
                  <div key={item.key} className="group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.key} — {item.summary}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.updated} · Status: {item.status}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </QueryState>
        </DashboardCard>

        {/* Todoist */}
        <DashboardCard title="Todoist — Today">
          <QueryState query={todoist} emptyMsg="No tasks for today. 🎉">
            {(tasks) => (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {priorityLabel(task.priority)} {task.content}
                        </p>
                        {task.due && (
                          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Due: {task.due}
                          </p>
                        )}
                      </div>
                      <a href={task.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </QueryState>
        </DashboardCard>

        {/* GitHub */}
        <DashboardCard title="GitHub — Reviews Needed">
          <QueryState query={github} emptyMsg="No reviews pending.">
            {(prs) => (
              <div className="space-y-4">
                {prs.map((pr, i) => (
                  <div key={i} className="group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{pr.title}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-mono">{pr.repo}</span>
                          <span>by {pr.author}</span>
                          <span>{pr.date}</span>
                        </p>
                      </div>
                      <a href={pr.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </QueryState>
        </DashboardCard>
      </div>

      <footer className="mt-10 text-xs text-muted-foreground">
        Data refreshes every 5 minutes. Configure tokens in Settings. Mock data shown when tokens are missing.
      </footer>
    </div>
  );
}

/* Reusable render-prop wrapper for query states */
function QueryState<T>({
  query,
  emptyMsg,
  children,
}: {
  query: { data?: T[]; isLoading: boolean; isError: boolean; error: unknown };
  emptyMsg: string;
  children: (data: T[]) => React.ReactNode;
}) {
  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }
  if (query.isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        {(query.error as Error)?.message ?? "Failed to load data"}
      </div>
    );
  }
  if (!query.data?.length) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4" /> {emptyMsg}
      </div>
    );
  }
  return <>{children(query.data)}</>;
}
