import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {User} from "../../types/user.ts";

export function useUploadAvatar(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.put<User>(`/api/users/${userId}/avatar`, formData).then(res => res.data);
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            return queryClient.invalidateQueries({queryKey: ["household"]});
        },
    })
}
