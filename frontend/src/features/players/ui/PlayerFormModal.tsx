import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "@/shared/components/Modal";
import { Alert } from "@/shared/components/Alert";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Spinner } from "@/shared/ui/spinner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { getValidationErrors, getErrorMessage, GENERIC_ERROR } from "@/shared/api/errors";
import { notify } from "@/shared/lib/alerts";
import { useCreatePlayer, useUpdatePlayer } from "../model/usePlayerMutations";
import { playerSchema, type PlayerFormValues } from "../model/playerSchema";
import type { Player } from "@/entities/player";

interface PlayerFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    player?: Player | null;
    onSuccess: () => void;
}

const FORM_ID = "player-form";
const TODAY = new Date().toISOString().split("T")[0];

export function PlayerFormModal({ open, onOpenChange, player, onSuccess }: PlayerFormModalProps) {
    const isEditMode = Boolean(player);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<PlayerFormValues>({
        resolver: zodResolver(playerSchema),
        defaultValues: {
            first_name: player?.first_name ?? "",
            middle_name: player?.middle_name ?? "",
            last_name: player?.last_name ?? "",
            suffix: player?.suffix ?? "",
            date_of_birth: player?.date_of_birth ?? "",
            gender: player?.gender?.value,
            email: player?.email ?? "",
            phone: player?.phone ?? "",
            emergency_contact_name: player?.emergency_contact_name ?? "",
            emergency_contact_phone: player?.emergency_contact_phone ?? "",
        } as PlayerFormValues,
    });

    const createPlayer = useCreatePlayer();
    const updatePlayer = useUpdatePlayer();
    const isSubmitting = createPlayer.isPending || updatePlayer.isPending;

    const onSubmit = async (values: PlayerFormValues) => {
        setFormError(null);

        const payload = {
            first_name: values.first_name,
            middle_name: values.middle_name || undefined,
            last_name: values.last_name,
            suffix: values.suffix || undefined,
            date_of_birth: values.date_of_birth,
            gender: values.gender,
            email: values.email || undefined,
            phone: values.phone || undefined,
            emergency_contact_name: values.emergency_contact_name || undefined,
            emergency_contact_phone: values.emergency_contact_phone || undefined,
        };

        try {
            if (isEditMode && player) {
                await updatePlayer.mutateAsync({ id: player.id, payload });
            } else {
                await createPlayer.mutateAsync(payload);
            }

            onSuccess();
            notify.success(isEditMode ? "Player updated" : "Player created");
        } catch (err) {
            const validation = getValidationErrors(err);
            if (validation) {
                Object.entries(validation).forEach(([field, messages]) => {
                    form.setError(field as keyof PlayerFormValues, { type: "server", message: messages[0] });
                });
            } else {
                setFormError(getErrorMessage(err) ?? GENERIC_ERROR);
            }
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit Player" : "Add Player"}
            description={isEditMode ? "Update this player's details." : "Register a new player."}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
                        {isSubmitting && <Spinner className="size-4" />}
                        {isEditMode ? "Save Changes" : "Create Player"}
                    </Button>
                </>
            }
        >
            <Form {...form}>
                <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
                    {formError && <Alert>{formError}</Alert>}

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Identity</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="middle_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Middle Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="suffix"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Suffix</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jr., III" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date_of_birth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input type="date" max={TODAY} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="flex h-9 items-center gap-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem value="male" id="gender-male" />
                                                    <Label htmlFor="gender-male" className="font-normal">Male</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem value="female" id="gender-female" />
                                                    <Label htmlFor="gender-female" className="font-normal">Female</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Contact</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Emergency Contact</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="emergency_contact_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="emergency_contact_phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>
                </form>
            </Form>
        </Modal>
    );
}
