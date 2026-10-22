import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {HouseholdInvite} from "../../types/invite.ts";

export function useGetCurrentInvite(householdId: string | undefined, enabled = true) {
    return useQuery({
        queryKey: ["invite", householdId],
        queryFn: () =>
            apiClient.get<HouseholdInvite | "">(`/api/households/${householdId}/invites/current`)
                .then(res => res.data || null),
        enabled: !!householdId && enabled,
    })
}
