import type {ReactNode} from "react";
import {Auth0Provider, type AppState} from "@auth0/auth0-react";
import {useNavigate} from "react-router";

function Auth0ProviderWithNavigate({children}: { children: ReactNode }) {
    const navigate = useNavigate();

    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    const onRedirectCallback = (appState?: AppState) => {
        navigate(appState?.returnTo ?? window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience,
                scope: "openid profile email offline_access",
            }}
            onRedirectCallback={onRedirectCallback}
            cacheLocation="localstorage"
            useRefreshTokens={true}
            useRefreshTokensFallback={true}
        >
            {children}
        </Auth0Provider>
    );
}

export default Auth0ProviderWithNavigate;
