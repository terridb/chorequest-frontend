import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {TaskHistoryEntry} from "../../types/task.ts";

export function useGetTaskHistory(taskId: string | undefined) {
    return useQuery({
        queryKey: ["taskHistory", taskId],
        queryFn: () =>
            apiClient.get<TaskHistoryEntry[]>(`/api/tasks/${taskId}/history`).then(res => res.data),
        enabled: !!taskId,
    })
}
