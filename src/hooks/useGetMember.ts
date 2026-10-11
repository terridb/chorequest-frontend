import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../api/client.ts";
import type {HouseholdMember} from "../types/household.ts";

export function useGetMember(memberId: string | undefined) {
    return useQuery({
        queryKey: ["member", memberId],
        queryFn: () =>
            apiClient.get<HouseholdMember>(`/api/members/${memberId}`).then(res => res.data),
        enabled: !!memberId,
    })
}
