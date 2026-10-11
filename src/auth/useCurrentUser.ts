import {useAuth0} from "@auth0/auth0-react";
import {apiClient} from "../api/client.ts";
import {useQuery} from "@tanstack/react-query";
import type {User} from "../types/user.ts";

function useCurrentUser() {
    const {isAuthenticated, user} = useAuth0();

    return useQuery({
        queryKey: ["me"],
        queryFn: () =>
            apiClient.post<User>("/api/users/me", {
                firstName: user?.given_name ?? user?.name,
                lastName: user?.family_name,
                avatarUrl: user?.picture,
            }).then(res => res.data),
        enabled: isAuthenticated,
        staleTime: Infinity,
    })
}

export default useCurrentUser;
