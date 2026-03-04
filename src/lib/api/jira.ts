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

  if (!jiraBaseUrl || !jiraToken || !jiraEmail) {
    console.warn("[Jira] Missing credentials — returning mock data");
    return MOCK_ISSUES;
  }

  const jql = encodeURIComponent('assignee = currentUser() AND status = "In Progress" ORDER BY updated DESC');

  const res = await fetch(`/api/jira/search?jql=${jql}&fields=summary,status,updated`, {
    headers: {
      Authorization: `Basic ${btoa(`${jiraEmail}:${jiraToken}`)}`,
      "Content-Type": "application/json",
      "x-proxy-target": jiraBaseUrl,
    },
  });

  if (!res.ok) {
    console.error(`[Jira] ${res.status} ${res.statusText}`);
    throw new Error(`Jira API error: ${res.status}`);
  }

  const data = await res.json();

  return (data.issues ?? []).map((issue: any) => ({
    key: issue.key,
    summary: issue.fields?.summary ?? "",
    status: issue.fields?.status?.name ?? "Unknown",
    updated: new Date(issue.fields?.updated).toLocaleString(),
  }));
}
