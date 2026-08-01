import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { User } from "../model/types";

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await api.get<{ data: User[] }>("/users");
            return data.data;
        },
    });
}
