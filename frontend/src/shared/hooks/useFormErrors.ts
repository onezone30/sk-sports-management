import { useState } from "react";
import { getValidationErrors, getErrorMessage, type FieldErrors } from "@/shared/api/errors";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function useFormErrors() {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const reset = () => {
        setFieldErrors({});
        setFormError(null);
    };

    /** Route a caught request error to the right place: per-field, or the form-level banner. */
    const handleError = (error: unknown) => {
        const validation = getValidationErrors(error);
        if (validation) {
            setFieldErrors(validation);
            setFormError(null);
        } else {
            setFieldErrors({});
            setFormError(getErrorMessage(error) ?? GENERIC_ERROR);
        }
    };

    const fieldError = (field: string) => fieldErrors[field]?.[0];

    return { formError, fieldError, handleError, reset };
}
