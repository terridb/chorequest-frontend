import {useMutation} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";

export function useDeleteAccount() {
    return useMutation({
        mutationFn: async ({userId, memberId}: { userId: string, memberId?: string }) => {
            if (memberId) await apiClient.delete(`/api/members/${memberId}`);
            await apiClient.delete(`/api/users/${userId}`);
        },
    })
}
