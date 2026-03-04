import { getSettings } from "@/lib/settings";

export interface GitHubPR {
  title: string;
  repo: string;
  author: string;
  date: string;
  url: string;
}

const MOCK_PRS: GitHubPR[] = [
  { title: "update blackbox exporter configmap to a Secret", repo: "one-thd/prometheus-operator", author: "BXR5130_thdgit", date: "3/2/2026, 10:34:17 AM", url: "#" },
  { title: "adding recovery steps for when upgrade fails", repo: "one-thd/monarch-run-ansible-code", author: "BXR5130_thdgit", date: "2/5/2026, 1:40:13 PM", url: "#" },
];

export async function fetchGitHubReviewRequests(): Promise<GitHubPR[]> {
  const { githubToken, githubOrg } = getSettings();

  if (!githubToken) {
    console.warn("[GitHub] Missing token — returning mock data");
    return MOCK_PRS;
  }

  // GitHub API supports CORS — call directly
  const query = githubOrg
    ? `org:${githubOrg} is:pr is:open review-requested:@me`
    : "is:pr is:open review-requested:@me";

  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&per_page=20`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    console.error(`[GitHub] ${res.status} ${res.statusText}`);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();

  return (data.items ?? []).map((item: any) => {
    // Extract owner/repo from repository_url
    const repoParts = (item.repository_url ?? "").split("/").slice(-2);
    return {
      title: item.title,
      repo: repoParts.join("/"),
      author: item.user?.login ?? "unknown",
      date: new Date(item.updated_at).toLocaleString(),
      url: item.html_url ?? "#",
    };
  });
}
