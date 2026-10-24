import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {SimpleTaskCompletion} from "../../types/task.ts";

export function useGetTaskHistory(taskId: string | undefined) {
    return useQuery({
        queryKey: ["taskHistory", taskId],
        queryFn: () =>
            apiClient.get<SimpleTaskCompletion[]>(`/api/tasks/${taskId}/completions`).then(res => res.data),
        enabled: !!taskId,
    })
}
