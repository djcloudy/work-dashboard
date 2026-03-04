import { useState } from "react";
import { Save, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardCard } from "@/components/DashboardCard";
import { getSettings, saveSettings, clearSettings, type AppSettings } from "@/lib/settings";
import { toast } from "sonner";

interface FieldDef {
  key: keyof AppSettings;
  label: string;
  placeholder: string;
  secret?: boolean;
}

const groups: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Jira",
    fields: [
      { key: "jiraBaseUrl", label: "Base URL", placeholder: "https://yourorg.atlassian.net" },
      { key: "jiraEmail", label: "Email", placeholder: "you@company.com" },
      { key: "jiraToken", label: "API Token", placeholder: "••••••••", secret: true },
    ],
  },
  {
    title: "GitHub",
    fields: [
      { key: "githubOrg", label: "Organization", placeholder: "my-org" },
      { key: "githubToken", label: "Personal Access Token", placeholder: "ghp_••••••••", secret: true },
    ],
  },
  {
    title: "Todoist",
    fields: [
      { key: "todoistToken", label: "API Token", placeholder: "••••••••", secret: true },
    ],
  },
  {
    title: "Toggl",
    fields: [
      { key: "togglToken", label: "API Token", placeholder: "••••••••", secret: true },
      { key: "togglWorkspaceId", label: "Workspace ID", placeholder: "1234567" },
    ],
  },
  {
    title: "Grafana",
    fields: [
      { key: "grafanaUrl", label: "URL", placeholder: "https://grafana.example.com" },
      { key: "grafanaToken", label: "Service Account Token", placeholder: "glsa_••••••••", secret: true },
    ],
  },
  {
    title: "n8n Agent",
    fields: [
      { key: "n8nChatUrl", label: "Chat Webhook URL", placeholder: "https://n8n.example.com/webhook/chat" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const update = (key: keyof AppSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    toast.success("Settings saved to browser storage.");
  };

  const handleClear = () => {
    clearSettings();
    setSettings(getSettings());
    toast.success("All settings cleared.");
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={handleClear} className="gap-2">
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <DashboardCard key={group.title} title={group.title}>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                  <div className="relative">
                    <Input
                      type={field.secret && !showSecrets[field.key] ? "password" : "text"}
                      placeholder={field.placeholder}
                      value={settings[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                    />
                    {field.secret && (
                      <button
                        type="button"
                        onClick={() => toggleSecret(field.key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSecrets[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Tokens are stored in your browser's localStorage. For production, use server-side environment variables.
      </p>
    </div>
  );
}
