import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/shared/api/client';

export interface UserPayload {
    name: string;
    email: string;
    role_id?: number;
    password?: string;
    permissions?: string[];
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserPayload) => api.post("/users", payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UserPayload }) => api.put(`/users/${id}`, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/users/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
    })
}
