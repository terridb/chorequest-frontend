import {useEffect, useState} from "react";

export function useDelayedLoading(isLoading: boolean, delayMs = 200): boolean {
    const [isDelayOver, setIsDelayOver] = useState(false);

    useEffect(() => {
        if (!isLoading) return;

        const timeout = setTimeout(() => setIsDelayOver(true), delayMs);
        return () => {
            clearTimeout(timeout);
            setIsDelayOver(false);
        };
    }, [isLoading, delayMs]);

    return isLoading && isDelayOver;
}
