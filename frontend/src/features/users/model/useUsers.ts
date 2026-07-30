import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/entities/user';

import api from '@/shared/api/client';

export interface UserPayload {
    name: string;
    email: string;
    role_id?: number;
    password?: string;
    permissions?: string[];
}

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await api.get<{ data: User[] }>("/users");
            return data.data;
        }
    })
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