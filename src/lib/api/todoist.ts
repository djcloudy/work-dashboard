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

  // Todoist goes through the Vite proxy to avoid CORS
  const res = await fetch("/api/todoist/tasks?filter=today|overdue", {
    headers: {
      Authorization: `Bearer ${todoistToken}`,
    },
  });

  if (!res.ok) {
    console.error(`[Todoist] ${res.status} ${res.statusText}`);
    throw new Error(`Todoist API error: ${res.status}`);
  }

  const data = await res.json();

  return (data ?? []).map((task: any) => ({
    id: task.id,
    content: task.content ?? "",
    description: task.description ?? "",
    priority: task.priority ?? 1,
    due: task.due?.date ?? null,
    url: task.url ?? "#",
  }));
}
