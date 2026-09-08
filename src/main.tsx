import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate.tsx";

const queryClient = new QueryClient();

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
