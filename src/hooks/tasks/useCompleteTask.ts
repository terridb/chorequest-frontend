import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TaskAssignment, TaskCompletion, TaskCompletionInput} from "../../types/task.ts";
import {apiClient} from "../../api/client.ts";

export function useCompleteTask(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({assignmentId, ...input}: TaskCompletionInput & { assignmentId: string }) =>
            apiClient.post<TaskCompletion>(`/api/assignments/${assignmentId}/completions`, input).then(res => res.data),
        onSuccess: (_completion, {assignmentId}) => {
            queryClient.setQueryData<TaskAssignment[]>(
                ["assignments", householdId],
                assignments => assignments?.filter(assignment => assignment.id !== assignmentId),
            );
            void queryClient.invalidateQueries({queryKey: ["assignments", householdId]});
            void queryClient.invalidateQueries({queryKey: ["goal", householdId]});
            void queryClient.invalidateQueries({queryKey: ["household", householdId]});
        }
    })
}
