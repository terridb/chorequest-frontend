import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../api/client.ts";
import type {Task} from "../types/task.ts";

export function useGetTask(taskId: string | undefined) {
    return useQuery({
        queryKey: ["task", taskId],
        queryFn: () =>
            apiClient.get<Task>(`/api/tasks/${taskId}`).then(res => res.data),
        enabled: !!taskId,
    })
}
