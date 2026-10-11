import {useAuth0} from "@auth0/auth0-react";
import {apiClient} from "../api/client.ts";
import {useQuery} from "@tanstack/react-query";
import type {User} from "../types/user.ts";

// Set by the post-login Action in Auth0 from the first-name form shown after sign-up
const FIRST_NAME_CLAIM = 'https://chorequest/first_name';

function useCurrentUser() {
    const {isAuthenticated, user} = useAuth0();

    return useQuery({
        queryKey: ["me"],
        queryFn: () =>
            apiClient.post<User>("/api/users/me", {
                firstName: user?.[FIRST_NAME_CLAIM] ?? user?.given_name ?? user?.name,
                lastName: user?.family_name,
                avatarUrl: user?.picture,
            }).then(res => res.data),
        enabled: isAuthenticated,
        staleTime: Infinity,
    })
}

export default useCurrentUser;
