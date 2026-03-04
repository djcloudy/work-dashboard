// Secure localStorage wrapper for API tokens
// In production, tokens should be stored server-side. This is for local dev/testing.

const STORAGE_KEY = "monarch_run_settings";

export interface AppSettings {
  jiraBaseUrl: string;
  jiraToken: string;
  jiraEmail: string;
  githubToken: string;
  githubOrg: string;
  todoistToken: string;
  togglToken: string;
  togglWorkspaceId: string;
  grafanaUrl: string;
  grafanaToken: string;
  n8nChatUrl: string;
}

const defaults: AppSettings = {
  jiraBaseUrl: "",
  jiraToken: "",
  jiraEmail: "",
  githubToken: "",
  githubOrg: "",
  todoistToken: "",
  togglToken: "",
  togglWorkspaceId: "",
  grafanaUrl: "",
  grafanaToken: "",
  n8nChatUrl: "",
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearSettings(): void {
  localStorage.removeItem(STORAGE_KEY);
}
