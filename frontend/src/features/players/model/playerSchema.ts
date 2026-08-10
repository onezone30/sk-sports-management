import { z } from "zod";

/**
 * zod validates shape only — required, format, date-not-in-future, length.
 * Anything that needs the database (duplicate name+DOB, uniqueness) can only
 * be checked server-side; those errors come back as Laravel 422s and are
 * routed to fields by useFormErrors, same as every other form in this app.
 */
export const playerSchema = z.object({
    first_name: z.string().trim().min(1, "First name is required").max(255),
    middle_name: z.string().trim().max(255).optional().or(z.literal("")),
    last_name: z.string().trim().min(1, "Last name is required").max(255),
    suffix: z.string().trim().max(20).optional().or(z.literal("")),
    date_of_birth: z
        .string()
        .min(1, "Date of birth is required")
        .refine((value) => new Date(value) < new Date(), "Date of birth must be in the past"),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    emergency_contact_name: z.string().trim().max(255).optional().or(z.literal("")),
    emergency_contact_phone: z.string().trim().max(30).optional().or(z.literal("")),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
