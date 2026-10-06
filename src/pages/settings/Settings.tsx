import {useAuth0} from "@auth0/auth0-react";

function Settings() {
    const {user, logout} = useAuth0();

    return (
        <div>
            {user && <p>Logged in as {user.name}</p>}
            <button onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>
                Log out
            </button>
        </div>
    );
}

export default Settings;
