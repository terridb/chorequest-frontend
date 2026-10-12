import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate.tsx";

const MAX_RETRIES = 3;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                const status = isAxiosError(error) ? error.response?.status : undefined;
                if (status && status >= 400 && status < 500) return false;
                return failureCount < MAX_RETRIES;
            },
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router>
                <Auth0ProviderWithNavigate>
                    <App/>
                </Auth0ProviderWithNavigate>
            </Router>
        </QueryClientProvider>
    </StrictMode>
)
