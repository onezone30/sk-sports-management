import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import api from "@/shared/api/client";
import { useCreateUser, useUpdateUser } from "../model/useUsers";
import type { User } from "@/entities/user";

interface Role {
    id: number;
    name: string;
}

interface UserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: () => void;
}

const FORM_ID = "user-form";

export function UserFormModal({ open, onOpenChange, user, onSuccess }: UserFormModalProps) {
    const isEditMode = Boolean(user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const isSubmitting = createUser.isPending || updateUser.isPending;

    useEffect(() => {
        if (!open) return;

        setName(user?.name ?? "");
        setEmail(user?.email ?? "");
        setPassword("");
        setRoleId(user?.role?.id ? String(user.role.id) : "");
        setFieldErrors({});
        setFormError(null);

        api.get("/roles")
            .then((response) => setRoles(response.data))
            .catch(() => setRoles([]));
    }, [open, user]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setFieldErrors({});
        setFormError(null);

        const payload = {
            name,
            email,
            role_id: roleId ? Number(roleId) : undefined,
            ...(password ? { password } : {}),
        };

        try {
            if (isEditMode && user) {
                await updateUser.mutateAsync({ id: user.id, payload });
            } else {
                await createUser.mutateAsync(payload);
            }

            onSuccess();
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 422) {
                setFieldErrors(err.response.data.errors ?? {});
            } else {
                setFormError("Something went wrong. Please try again.");
            }
        }
    };

    const fieldError = (field: string) => fieldErrors[field]?.[0];

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit User" : "Add User"}
            description={isEditMode ? "Update this user's details." : "Create a new user account."}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
                        {isSubmitting && <Spinner className="size-4" />}
                        {isEditMode ? "Save Changes" : "Create User"}
                    </Button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {formError}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!fieldError("name")} />
                    {fieldError("name") && <p className="text-xs text-destructive">{fieldError("name")}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fieldError("email")} />
                    {fieldError("email") && <p className="text-xs text-destructive">{fieldError("email")}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password{isEditMode && <span className="text-muted-foreground font-normal">(leave blank to keep unchanged)</span>}</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!fieldError("password")} />
                    {fieldError("password") && <p className="text-xs text-destructive">{fieldError("password")}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={roleId} onValueChange={setRoleId}>
                        <SelectTrigger id="role" className="w-full" aria-invalid={!!fieldError("role_id")}>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={String(role.id)}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {fieldError("role_id") && <p className="text-xs text-destructive">{fieldError("role_id")}</p>}
                </div>
            </form>
        </Modal>
    );
}
