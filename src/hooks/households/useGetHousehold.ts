import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {Household} from "../../types/household.ts";

export function useGetHousehold(householdId: string | undefined) {
    return useQuery({
        queryKey: ["household", householdId],
        queryFn: () =>
            apiClient.get<Household>(`/api/households/${householdId}`).then(res => res.data),
        enabled: !!householdId,
    })
}
