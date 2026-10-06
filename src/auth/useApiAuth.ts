import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {apiClient} from "../api/client.ts";

function useApiAuth() {
    const {getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        const interceptorId = apiClient.interceptors.request.use(async (config) => {
            const token = await getAccessTokenSilently();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        return () => apiClient.interceptors.request.eject(interceptorId);
    }, [getAccessTokenSilently]);
}

export default useApiAuth;
