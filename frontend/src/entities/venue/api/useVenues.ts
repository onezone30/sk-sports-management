import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Venue } from "../model/types";

export function useVenues() {
    return useQuery({
        queryKey: ["venues"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Venue[] }>("/venues");
            return data.data;
        },
    });
}
