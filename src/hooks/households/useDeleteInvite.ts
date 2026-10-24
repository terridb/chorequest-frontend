import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";

export function useDeleteInvite(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (inviteId: string) =>
            apiClient.delete(`/api/households/${householdId}/invites/${inviteId}`),
        onSuccess: () => queryClient.setQueryData(["invite", householdId], null),
    })
}
