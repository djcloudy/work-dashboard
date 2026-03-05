import { getSettings } from "@/lib/settings";

export interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  updated: string;
}

const MOCK_ISSUES: JiraIssue[] = [
  { key: "PROJ-101", summary: "Update caching strategy for API gateway", status: "In Progress", updated: "3/4/2026, 9:15:12 AM" },
  { key: "PROJ-98", summary: "Investigate flaky integration tests", status: "In Progress", updated: "3/3/2026, 10:03:39 AM" },
  { key: "PROJ-85", summary: "Set up staging environment for new service", status: "In Progress", updated: "2/6/2026, 11:48:15 AM" },
];

export async function fetchJiraInProgress(): Promise<JiraIssue[]> {
  const { jiraBaseUrl, jiraEmail, jiraToken } = getSettings();
  const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (!jiraBaseUrl || !jiraToken || !jiraEmail || !isDev) {
    if (jiraBaseUrl && jiraToken && !isDev) {
      console.warn("[Jira] API calls only work via Vite proxy (localhost). Showing mock data in preview.");
    } else {
      console.warn("[Jira] Missing credentials — returning mock data");
    }
    return MOCK_ISSUES;
  }

  const jql = encodeURIComponent('assignee = currentUser() AND status = "In Progress" ORDER BY updated DESC');
  const url = `/api/jira/search?jql=${jql}&fields=summary,status,updated`;
  console.log(`[Jira] Fetching via proxy: ${url}`);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${jiraEmail}:${jiraToken}`)}`,
        "Content-Type": "application/json",
        "x-proxy-target": jiraBaseUrl,
      },
    });
  } catch (err) {
    console.error("[Jira] Network error:", err);
    throw new Error(`Jira network error: ${(err as Error).message}`);
  }

  console.log(`[Jira] Response: ${res.status} ${res.statusText}`);

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Jira] Error body:`, body);
    throw new Error(`Jira API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`[Jira] Received ${data.issues?.length ?? 0} issues`);

  return (data.issues ?? []).map((issue: any) => ({
    key: issue.key,
    summary: issue.fields?.summary ?? "",
    status: issue.fields?.status?.name ?? "Unknown",
    updated: new Date(issue.fields?.updated).toLocaleString(),
  }));
}
