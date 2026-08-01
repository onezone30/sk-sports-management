import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Role } from "../model/types";

export function useRoles() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Role[] }>("/roles");
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // roles change rarely; overrides the 1-min global default
    });
}
