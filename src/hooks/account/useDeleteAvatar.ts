import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {User} from "../../types/user.ts";

export function useDeleteAvatar(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            apiClient.delete<User>(`/api/users/${userId}/avatar`).then(res => res.data),
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            return queryClient.invalidateQueries({queryKey: ["household"]});
        },
    })
}
