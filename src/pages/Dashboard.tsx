import { ExternalLink, Clock } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

const jiraItems = [
  { key: "THDK8S-2939", summary: "Remove Google Captcha Probes", date: "3/4/2026, 9:15:12 AM", status: "In Progress" },
  { key: "THDK8S-2941", summary: "Investigate osquery for change validation", date: "3/3/2026, 10:03:39 AM", status: "In Progress" },
  { key: "THDK8S-2917", summary: "Build Monarch Run Cluster in Equinix", date: "2/6/2026, 11:48:15 AM", status: "In Progress" },
];

const githubPRs = [
  { title: "update blackbox exporter configmap to a Secret", repo: "one-thd/prometheus-operator", author: "BXR5130_thdgit", date: "3/2/2026, 10:34:17 AM" },
  { title: "adding recovery steps for when upgrade fails", repo: "one-thd/monarch-run-ansible-code", author: "BXR5130_thdgit", date: "2/5/2026, 1:40:13 PM" },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Jira */}
        <DashboardCard title="Jira — In Progress">
          <div className="space-y-4">
            {jiraItems.map((item) => (
              <div key={item.key} className="group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {item.key} — {item.summary}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.date} · Status: {item.status}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Todoist */}
        <DashboardCard title="Todoist — Work">
          <p className="text-sm text-muted-foreground">No tasks configured. Add your Todoist token in Settings.</p>
        </DashboardCard>

        {/* GitHub */}
        <DashboardCard title="GitHub — Reviews Needed">
          <div className="space-y-4">
            {githubPRs.map((pr, i) => (
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
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <footer className="mt-10 text-xs text-muted-foreground">
        Built for growth: add providers under /server/services and UI cards in /web/src/components.
      </footer>
    </div>
  );
}
