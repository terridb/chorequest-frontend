import {isAxiosError} from "axios";

// The backend returns Spring ProblemDetails, so its message lives in `detail`
export function getErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError<{ detail?: string }>(error) && error.response?.data?.detail) {
        return error.response.data.detail;
    }
    return fallback;
}
