import { isAxiosError } from "axios";

export type FieldErrors = Record<string, string[]>;

/** Returns Laravel's 422 validation errors, or null if this wasn't a validation failure. */
export function getValidationErrors(error: unknown): FieldErrors | null {
    if (isAxiosError(error) && error.response?.status === 422) {
        return error.response.data?.errors ?? {};
    }
    return null;
}

/**
 * Returns the backend's own `{ message }` for a non-422 failure (401 bad
 * credentials, 403 forbidden/inactive account, 409 conflict, etc.), or null
 * if the response carried no such message — callers should fall back to a
 * generic string in that case.
 */
export function getErrorMessage(error: unknown): string | null {
    if (isAxiosError(error) && typeof error.response?.data?.message === "string") {
        return error.response.data.message;
    }
    return null;
}
