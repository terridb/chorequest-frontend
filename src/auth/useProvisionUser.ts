import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {apiClient} from "../api/client.ts";

function useProvisionUser() {
    const {isAuthenticated, user} = useAuth0();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        apiClient.post("/api/users/me", {
            firstName: user?.given_name ?? user?.name,
            lastName: user?.family_name,
            avatarUrl: user?.picture,
        }).catch((error) => {
            console.error("Failed to provision user", error);
        });
    }, [isAuthenticated, user]);
}

export default useProvisionUser;
