import {type ReactNode} from "react";
import {Navigate} from "react-router";
import {useAuth0} from "@auth0/auth0-react";
import Spinner from "../components/ui/spinner/Spinner.tsx";
import useCurrentUser from "./useCurrentUser.ts";
import "./RequireAuth.css";

function RedirectIfSignedIn({children}: { children: ReactNode }) {
    const {isAuthenticated, isLoading} = useAuth0();
    const {data: me, isPending} = useCurrentUser();

    if (isLoading || (isAuthenticated && isPending)) {
        return (
            <div className="auth-loading">
                <Spinner/>
            </div>
        );
    }

    if (me) {
        return <Navigate to={me.householdIds.length > 0 ? "/quests" : "/join-household"} replace/>;
    }

    return <>{children}</>;
}

export default RedirectIfSignedIn;
