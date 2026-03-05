import { getSettings } from "@/lib/settings";

export interface TodoistTask {
  id: string;
  content: string;
  description: string;
  priority: number;
  due: string | null;
  url: string;
}

const MOCK_TASKS: TodoistTask[] = [
  { id: "1", content: "Review Q1 infrastructure budget", description: "", priority: 4, due: "2026-03-05", url: "#" },
  { id: "2", content: "Update runbook for failover procedure", description: "", priority: 3, due: "2026-03-06", url: "#" },
  { id: "3", content: "Schedule 1:1 with platform team lead", description: "", priority: 2, due: null, url: "#" },
];

export async function fetchTodoistTasks(): Promise<TodoistTask[]> {
  const { todoistToken } = getSettings();

  if (!todoistToken) {
    console.warn("[Todoist] Missing token — returning mock data");
    return MOCK_TASKS;
  }

  // Use Vite proxy in local dev, direct URL otherwise
  const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const url = isDev ? "/api/todoist/tasks" : "https://api.todoist.com/rest/v2/tasks";
  console.log(`[Todoist] Fetching ${url} (isDev=${isDev})`);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${todoistToken}` },
    });
  } catch (err) {
    console.error("[Todoist] Network/CORS error:", err);
    throw new Error(`Todoist network error: ${(err as Error).message}`);
  }

  console.log(`[Todoist] Response: ${res.status} ${res.statusText}, content-type: ${res.headers.get("content-type")}`);

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Todoist] Error body:`, body);
    throw new Error(`Todoist API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`[Todoist] Received ${Array.isArray(data) ? data.length : "non-array"} tasks`);

  return (data ?? []).map((task: any) => ({
    id: task.id,
    content: task.content ?? "",
    description: task.description ?? "",
    priority: task.priority ?? 1,
    due: task.due?.date ?? null,
    url: task.url ?? "#",
  }));
}
