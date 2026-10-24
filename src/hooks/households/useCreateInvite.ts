import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {HouseholdInvite} from "../../types/invite.ts";

export function useCreateInvite(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            apiClient.post<HouseholdInvite>(`/api/households/${householdId}/invites`).then(res => res.data),
        onSuccess: (invite) => queryClient.setQueryData(["invite", householdId], invite),
    })
}
