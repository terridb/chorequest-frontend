import {type ReactNode, useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import Spinner from "../components/ui/spinner/Spinner.tsx";
import useCurrentUser from "./useCurrentUser.ts";
import "./RequireAuth.css";

function RequireAuth({children}: { children: ReactNode }) {
    const {isAuthenticated, isLoading, loginWithRedirect} = useAuth0();

    const {data: me, isError} = useCurrentUser();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect({
                appState: {returnTo: window.location.pathname},
            });
        }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    if (isError) {
        return (
            <div className="auth-loading">
                <p>Couldn't load your account. Please refresh the page.</p>
            </div>
        );
    }

    if (!isAuthenticated || !me) {
        return (
            <div className="auth-loading">
                <Spinner/>
            </div>
        );
    }

    return <>{children}</>;
}

export default RequireAuth;
