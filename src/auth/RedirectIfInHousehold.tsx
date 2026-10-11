import {type ReactNode} from "react";
import {Navigate} from "react-router";
import useCurrentUser from "./useCurrentUser.ts";

function RedirectIfInHousehold({children}: { children: ReactNode }) {
    const {data: me} = useCurrentUser();

    if (me && me.householdIds.length > 0) {
        return <Navigate to="/quests" replace/>;
    }

    return <>{children}</>;
}

export default RedirectIfInHousehold;
