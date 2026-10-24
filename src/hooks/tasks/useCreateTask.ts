import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Task, TaskInput} from "../../types/task.ts";
import {apiClient} from "../../api/client.ts";

export function useCreateTask(householdId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: TaskInput) =>
            apiClient.post<Task>(`/api/households/${householdId}/tasks`, input).then(res => res.data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["assignments", householdId]}),
    })
}
