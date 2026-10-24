import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {User, UserInput} from "../../types/user.ts";

export function useUpdateProfile(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: Omit<UserInput, 'avatar'>) =>
            apiClient.patch<User>(`/api/users/${userId}`, input).then(res => res.data),
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            return queryClient.invalidateQueries({queryKey: ["household"]});
        },
    })
}
