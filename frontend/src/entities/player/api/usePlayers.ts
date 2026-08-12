import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Paginated } from "@/shared/api/types";
import type { Player } from "../model/types";

interface UsePlayersParams {
    page?: number;
    search?: string;
}

export function usePlayers({ page = 1, search }: UsePlayersParams = {}) {
    return useQuery({
        queryKey: ["players", { page, search }],
        queryFn: async () => {
            const { data } = await api.get<Paginated<Player>>("/players", {
                params: { page, search: search || undefined },
            });
            return data;
        },
        // Keeps the current page's rows on screen while the next page loads,
        // instead of flashing an empty table on every page/search change.
        placeholderData: keepPreviousData,
    });
}
