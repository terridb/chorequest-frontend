import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";

export function useDeleteTask(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId: string) =>
            apiClient.delete(`/api/tasks/${taskId}`),
        onSuccess: (_data, taskId) => {
            queryClient.removeQueries({queryKey: ["task", taskId]});
            void queryClient.invalidateQueries({queryKey: ["assignments", householdId]});
        }
    })
}
