import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {TaskAssignment} from "../../types/task.ts";

export function useSkipAssignment(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assignmentId: string) =>
            apiClient.post<TaskAssignment>(`/api/assignments/${assignmentId}/skip`).then(res => res.data),
        onSuccess: (newAssignment, assignmentId) => {
            queryClient.setQueryData<TaskAssignment[]>(
                ["assignments", householdId],
                assignments => assignments?.map(assignment => assignment.id === assignmentId ? newAssignment : assignment),
            );
            void queryClient.invalidateQueries({queryKey: ["assignments", householdId]});
            void queryClient.invalidateQueries({queryKey: ["taskHistory", newAssignment.task.id]});
        }
    })
}
