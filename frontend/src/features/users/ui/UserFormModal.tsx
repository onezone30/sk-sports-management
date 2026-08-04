import { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { FormField } from "@/shared/components/FormField";
import { Alert } from "@/shared/components/Alert";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { useFormErrors } from "@/shared/hooks/useFormErrors";
import { notify } from "@/shared/lib/alerts";
import { useCreateUser, useUpdateUser } from "../model/useUserMutations";
import { useRoles } from "@/entities/role";
import type { User } from "@/entities/user";

interface UserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: () => void;
}

const FORM_ID = "user-form";

export function UserFormModal({ open, onOpenChange, user, onSuccess }: UserFormModalProps) {
    const isEditMode = Boolean(user);

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState(user?.role?.id ? String(user.role.id) : "");

    const { formError, fieldError, handleError, reset } = useFormErrors();

    const { data: roles = [], isLoading: isLoadingRoles, isError: isRolesError, refetch: refetchRoles } = useRoles();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const isSubmitting = createUser.isPending || updateUser.isPending;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        reset();

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
            notify.success(isEditMode ? "User updated" : "User created");
        } catch (err) {
            handleError(err);
        }
    };

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
                {formError && <Alert>{formError}</Alert>}

                <FormField id="name" label="Name" error={fieldError("name")}>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-invalid={!!fieldError("name")}
                        aria-describedby={fieldError("name") ? "name-error" : undefined}
                    />
                </FormField>

                <FormField id="email" label="Email" error={fieldError("email")}>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!fieldError("email")}
                        aria-describedby={fieldError("email") ? "email-error" : undefined}
                    />
                </FormField>

                <FormField
                    id="password"
                    label={<>Password{isEditMode && <span className="text-muted-foreground font-normal">(leave blank to keep unchanged)</span>}</>}
                    error={fieldError("password")}
                >
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!fieldError("password")}
                        aria-describedby={fieldError("password") ? "password-error" : undefined}
                    />
                </FormField>

                <FormField
                    id="role"
                    label="Role"
                    error={
                        fieldError("role_id") ??
                        (isRolesError ? (
                            <>
                                Failed to load roles.{" "}
                                <button type="button" onClick={() => refetchRoles()} className="underline">
                                    Retry
                                </button>
                            </>
                        ) : undefined)
                    }
                >
                    <Select value={roleId} onValueChange={setRoleId} disabled={isLoadingRoles}>
                        <SelectTrigger
                            id="role"
                            className="w-full"
                            aria-invalid={!!fieldError("role_id")}
                            aria-describedby={fieldError("role_id") || isRolesError ? "role-error" : undefined}
                        >
                            <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={String(role.id)}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
            </form>
        </Modal>
    );
}
