import useCurrentUser from "../auth/useCurrentUser.ts";

export function useCurrentHouseholdId() {
    const {data: me} = useCurrentUser();

    return me?.householdIds[0];
}