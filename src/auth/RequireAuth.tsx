import {type ReactNode, useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import Spinner from "../components/spinner/Spinner.tsx";
import useApiAuth from "./useApiAuth.ts";
import useProvisionUser from "./useProvisionUser.ts";
import "./RequireAuth.css";

function RequireAuth({children}: { children: ReactNode }) {
    const {isAuthenticated, isLoading, loginWithRedirect} = useAuth0();

    useApiAuth();
    useProvisionUser();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect({
                appState: {returnTo: window.location.pathname},
            });
        }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    if (!isAuthenticated) {
        return (
            <div className="auth-loading">
                <Spinner/>
            </div>
        );
    }

    return <>{children}</>;
}

export default RequireAuth;
