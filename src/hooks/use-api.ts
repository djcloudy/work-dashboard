import { useQuery } from "@tanstack/react-query";
import { fetchJiraInProgress } from "@/lib/api/jira";
import { fetchGitHubReviewRequests } from "@/lib/api/github";
import { fetchTodoistTasks } from "@/lib/api/todoist";

export function useJiraInProgress() {
  return useQuery({
    queryKey: ["jira", "in-progress"],
    queryFn: fetchJiraInProgress,
    refetchInterval: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}

export function useGitHubReviews() {
  return useQuery({
    queryKey: ["github", "reviews"],
    queryFn: fetchGitHubReviewRequests,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useTodoistTasks() {
  return useQuery({
    queryKey: ["todoist", "tasks"],
    queryFn: fetchTodoistTasks,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  });
}
