import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Goal, GoalRequest} from "../../types/goal.ts";
import {apiClient} from "../../api/client.ts";

export function useCreateGoal(householdId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: GoalRequest) =>
            apiClient.post<Goal>(`/api/households/${householdId}/goals`, input).then(res => res.data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["goal", householdId]}),
    })
}
