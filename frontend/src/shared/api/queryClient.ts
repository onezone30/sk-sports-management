import { QueryClient, MutationCache } from "@tanstack/react-query";
import { getValidationErrors, getErrorMessage, GENERIC_ERROR } from "@/shared/api/errors";
import { notify } from "@/shared/lib/alerts";

declare module "@tanstack/react-query" {
    interface Register {
        mutationMeta: {
            /** Skip the global error toast — the caller renders the error itself (e.g. a form banner). */
            skipGlobalError?: boolean;
        };
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
        },
    },
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.skipGlobalError) return; // form renders it inline
            if (getValidationErrors(error)) return; // 422 belongs on the fields
            notify.error(getErrorMessage(error) ?? GENERIC_ERROR);
        },
    }),
});
