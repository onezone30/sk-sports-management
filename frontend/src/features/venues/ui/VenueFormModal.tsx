import { useState } from "react";
import type { FormEvent } from "react";
import { Star, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { FormField } from "@/shared/components/FormField";
import { Alert } from "@/shared/components/Alert";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Dropzone } from "@/shared/components/Dropzone";
import { useFormErrors } from "@/shared/hooks/useFormErrors";
import { notify } from "@/shared/lib/alerts";
import {
    useCreateVenue,
    useUpdateVenue,
    useAddVenueImage,
    useDeleteVenueImage,
    useSetPrimaryVenueImage,
} from "../model/useVenueMutations";
import { useVenue, type Venue } from "@/entities/venue";

interface VenueFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venue?: Venue | null;
    onSuccess: () => void;
}

const FORM_ID = "venue-form";
const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
];

export function VenueFormModal({ open, onOpenChange, venue, onSuccess }: VenueFormModalProps) {
    const isEditMode = Boolean(venue);

    const [name, setName] = useState(venue?.name ?? "");
    const [addressLine, setAddressLine] = useState(venue?.address_line ?? "");
    const [city, setCity] = useState(venue?.city ?? "");
    const [state, setState] = useState(venue?.state ?? "");
    const [zip, setZip] = useState(venue?.zip ?? "");
    const [capacity, setCapacity] = useState(venue?.capacity ? String(venue.capacity) : "");
    const [status, setStatus] = useState(venue?.status?.value ?? "active");
    const [description, setDescription] = useState(venue?.description ?? "");
    const [newImages, setNewImages] = useState<File[]>([]);

    const { formError, fieldError, handleError, reset } = useFormErrors();

    const { data: liveVenue } = useVenue(venue?.id ?? 0, { enabled: isEditMode });
    const galleryImages = liveVenue?.images ?? venue?.images ?? [];

    const imagesError =
        fieldError("images") ??
        fieldError("image") ??
        Array.from({ length: 8 }, (_, i) => fieldError(`images.${i}`)).find(Boolean);

    const createVenue = useCreateVenue();
    const updateVenue = useUpdateVenue();
    const addImage = useAddVenueImage();
    const deleteImage = useDeleteVenueImage();
    const setPrimaryImage = useSetPrimaryVenueImage();
    const isSubmitting = createVenue.isPending || updateVenue.isPending;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        reset();

        const fields = {
            name,
            address_line: addressLine,
            city,
            state,
            zip,
            capacity: capacity ? Number(capacity) : undefined,
            status,
            description,
        };

        try {
            if (isEditMode && venue) {
                await updateVenue.mutateAsync({ id: venue.id, payload: fields });
            } else {
                await createVenue.mutateAsync({ ...fields, images: newImages });
            }

            onSuccess();
            notify.success(isEditMode ? "Venue updated" : "Venue created");
        } catch (err) {
            handleError(err);
        }
    };

    const handleAddExistingImage = async (files: File[]) => {
        if (!venue) return;

        for (const file of files) {
            try {
                await addImage.mutateAsync({ venueId: venue.id, file });
            } catch (err) {
                handleError(err);
                break;
            }
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit Venue" : "Add Venue"}
            description={isEditMode ? "Update this venue's details." : "Create a new venue."}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
                        {isSubmitting && <Spinner className="size-4" />}
                        {isEditMode ? "Save Changes" : "Create Venue"}
                    </Button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
                {formError && <Alert>{formError}</Alert>}

                <FormField id="name" label="Name" error={fieldError("name")}>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </FormField>

                <FormField id="address_line" label="Address" error={fieldError("address_line")}>
                    <Input id="address_line" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
                </FormField>

                <div className="grid grid-cols-3 gap-3">
                    <FormField id="city" label="City" error={fieldError("city")}>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </FormField>
                    <FormField id="state" label="State" error={fieldError("state")}>
                        <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                    </FormField>
                    <FormField id="zip" label="Zip" error={fieldError("zip")}>
                        <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <FormField id="capacity" label="Capacity" error={fieldError("capacity")}>
                        <Input id="capacity" type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                    </FormField>
                    <FormField id="status" label="Status" error={fieldError("status")}>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>

                <FormField id="description" label="Description" error={fieldError("description")}>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </FormField>

                <FormField id="images" label="Images" error={imagesError}>
                    {isEditMode && venue ? (
                        <div className="space-y-3">
                            {galleryImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {galleryImages.map((image) => (
                                        <div key={image.id} className="group relative aspect-square overflow-hidden rounded-md border">
                                            <img src={image.url} alt="" className="h-full w-full object-cover" />
                                            {image.is_primary && (
                                                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                                    Primary
                                                </span>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/50 p-1 opacity-0 transition group-hover:opacity-100">
                                                {!image.is_primary && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPrimaryImage.mutate({ venueId: venue.id, imageId: image.id })}
                                                        className="rounded p-1 text-white hover:bg-white/20"
                                                        aria-label="Set as primary"
                                                    >
                                                        <Star className="size-3" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteImage.mutate({ venueId: venue.id, imageId: image.id })}
                                                    className="rounded p-1 text-white hover:bg-white/20"
                                                    aria-label="Delete image"
                                                >
                                                    <Trash2 className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Dropzone
                                files={[]}
                                onChange={handleAddExistingImage}
                                maxFiles={Math.max(0, 8 - galleryImages.length)}
                                disabled={galleryImages.length >= 8 || addImage.isPending}
                            />
                        </div>
                    ) : (
                        <Dropzone files={newImages} onChange={setNewImages} maxFiles={8} />
                    )}
                </FormField>
            </form>
        </Modal>
    );
}
