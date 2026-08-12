import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/shared/api/client";

export interface PlayerPayload {
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    date_of_birth: string;
    gender: string;
    email?: string;
    phone?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
}

export function useCreatePlayer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PlayerPayload) => api.post("/players", payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
        meta: { skipGlobalError: true },
    });
}

export function useUpdatePlayer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PlayerPayload }) => api.put(`/players/${id}`, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
        meta: { skipGlobalError: true },
    });
}

export function useDeletePlayer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/players/${id}`),
        // No skipGlobalError: the 409 "player has recorded stats" message from
        // PlayerInUseException is exactly what should surface via the global
        // toast (see mutationCache.onError in queryClient.ts), same as DeleteUserDialog.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
    });
}
