import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { VenueImage } from "@/entities/venue";

export interface VenuePayload {
    name: string;
    address_line?: string;
    city?: string;
    state?: string;
    zip?: string;
    capacity?: number;
    status?: string;
    description?: string;
    images?: File[];
}

function toFormData(payload: VenuePayload): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return;
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
        }
    });

    payload.images?.forEach((file) => formData.append("images[]", file));

    return formData;
}

export function useCreateVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: VenuePayload) =>
            api.post("/venues", toFormData(payload), { headers: { "Content-Type": undefined } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
        meta: { skipGlobalError: true },
    });
}

export function useUpdateVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Omit<VenuePayload, "images"> }) =>
            api.put(`/venues/${id}`, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
        meta: { skipGlobalError: true },
    });
}

export function useDeleteVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/venues/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
    });
}

export function useAddVenueImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ venueId, file }: { venueId: number; file: File }) => {
            const formData = new FormData();
            formData.append("image", file);
            return api.post<{ data: VenueImage }>(`/venues/${venueId}/images`, formData, {
                headers: { "Content-Type": undefined },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
        meta: { skipGlobalError: true },
    });
}

export function useDeleteVenueImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ venueId, imageId }: { venueId: number; imageId: number }) =>
            api.delete(`/venues/${venueId}/images/${imageId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
    });
}

export function useSetPrimaryVenueImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ venueId, imageId }: { venueId: number; imageId: number }) =>
            api.patch(`/venues/${venueId}/images/${imageId}/primary`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
    });
}
