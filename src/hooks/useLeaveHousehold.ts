import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../api/client.ts";

export function useLeaveHousehold(householdId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (memberId: string) =>
            apiClient.delete(`/api/members/${memberId}`),
        onSuccess: (_data, memberId) => {
            queryClient.removeQueries({queryKey: ["member", memberId]});
            queryClient.removeQueries({queryKey: ["household", householdId]});
            queryClient.removeQueries({queryKey: ["assignments", householdId]});
            queryClient.removeQueries({queryKey: ["goal", householdId]});
            return queryClient.invalidateQueries({queryKey: ["me"]});
        }
    })
}
