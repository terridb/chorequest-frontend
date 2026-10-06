import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../api/client.ts";
import type {TaskAssignment} from "../types/task.ts";

export function useGetAssignments(householdId: string | undefined) {
    return useQuery({
        queryKey: ["assignments", householdId],
        queryFn: () =>
            apiClient.get<TaskAssignment[]>(`/api/households/${householdId}/assignments/open`).then(res => res.data),
        enabled: !!householdId,
    })
}