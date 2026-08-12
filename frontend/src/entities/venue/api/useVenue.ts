import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Venue } from "../model/types";

export function useVenue(id: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["venues", id],
        queryFn: async () => {
            const { data } = await api.get<{ data: Venue }>(`/venues/${id}`);
            return data.data;
        },
        enabled: options?.enabled ?? true,
    });
}
