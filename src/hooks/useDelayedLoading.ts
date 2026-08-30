import { useEffect, useState } from "react";

export function useDelayedLoading(isLoading: boolean, delayMs = 200): boolean {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setShowSpinner(false);
            return;
        }

        const timeout = setTimeout(() => setShowSpinner(true), delayMs);
        return () => clearTimeout(timeout);
    }, [isLoading, delayMs]);

    return showSpinner;
}
