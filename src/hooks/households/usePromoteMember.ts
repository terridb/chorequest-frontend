import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {HouseholdMember} from "../../types/household.ts";

export function usePromoteMember(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (memberId: string) =>
            apiClient.post<HouseholdMember>(`/api/members/${memberId}/promote`).then(res => res.data),
        onSuccess: (member) => Promise.all([
            queryClient.invalidateQueries({queryKey: ["member", member.id]}),
            queryClient.invalidateQueries({queryKey: ["household", householdId]}),
        ])
    })
}