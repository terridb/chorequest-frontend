import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../api/client.ts";
import type {Goal} from "../types/goal.ts";

export function useGetCurrentGoal(householdId: string | undefined) {
    return useQuery({
        queryKey: ["goal", householdId],
        // The API sends an empty body when there is no current goal
        queryFn: () =>
            apiClient.get<Goal | null>(`/api/households/${householdId}/goals/current`).then(res => res.data || null),
        enabled: !!householdId,
    })
}
