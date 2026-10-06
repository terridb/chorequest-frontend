import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TaskCompletion, TaskCompletionInput} from "../types/task.ts";
import {apiClient} from "../api/client.ts";

export function useCompleteTask(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({assignmentId, ...input}: TaskCompletionInput & { assignmentId: string }) =>
            apiClient.post<TaskCompletion>(`/api/assignments/${assignmentId}/completions`, input).then(res => res.data),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({queryKey: ["assignments", householdId]}),
            queryClient.invalidateQueries({queryKey: ["goal", householdId]}),
            queryClient.invalidateQueries({queryKey: ["household", householdId]}),
        ])
    })
}