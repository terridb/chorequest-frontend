import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Task, TaskPatchInput} from "../../types/task.ts";
import {apiClient} from "../../api/client.ts";

export function useUpdateTask(householdId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, ...input}: TaskPatchInput & { taskId: string }) =>
            apiClient.patch<Task>(`/api/tasks/${taskId}`, input).then(res => res.data),
        // Open assignments embed their task, so they need refreshing as well
        onSuccess: (task) => Promise.all([
            queryClient.invalidateQueries({queryKey: ["task", task.id]}),
            queryClient.invalidateQueries({queryKey: ["assignments", householdId]}),
        ])
    })
}
