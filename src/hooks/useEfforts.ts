import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../api/client.ts";
import type {EffortDetail} from "../types/task.ts";

export function useEfforts() {
    return useQuery({
        queryKey: ["efforts"],
        queryFn: () =>
            apiClient.get<EffortDetail[]>(`/api/efforts`).then(res => res.data),
        staleTime: Infinity,
    });
}
