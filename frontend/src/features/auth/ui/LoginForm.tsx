import { useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormField } from "@/shared/components/FormField";
import { Alert } from "@/shared/components/Alert";
import { Spinner } from "@/shared/ui/spinner";
import { useFormErrors } from "@/shared/hooks/useFormErrors";
import api from "@/shared/api/client";
import type { User } from "@/entities/user";
import { useAuth } from "../model/useAuth";

interface LoginResponse {
    user: User;
    access_token: string;
    token_type: string;
}

export function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { formError, handleError, reset } = useFormErrors();

    const loginMutation = useMutation({
        mutationFn: () => api.post<LoginResponse>("/login", { email, password }),
        onSuccess: ({ data }) => {
            login(data.access_token, data.user);
            // AuthGate redirects here with the originally-requested URL in state;
            // fall back to the dashboard for a plain /login visit.
            const from = (location.state as { from?: Location } | null)?.from;
            navigate(from ? `${from.pathname}${from.search}` : "/dashboard", { replace: true });
        },
        onError: (error: unknown) => {
            handleError(error);
            // Only clear the password on a genuine auth failure — a transient
            // network error shouldn't force the user to retype everything.
            if (isAxiosError(error) && error.response?.status === 401) {
                setPassword("");
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reset();
        loginMutation.mutate();
    };

    return (
        <div className="w-full max-w-sm">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Sign in
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
                Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access your dashboard
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                {formError && <Alert>{formError}</Alert>}

                <FormField id="email" label="Email">
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            placeholder="coach@sksports.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className="px-10"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </FormField>

                <FormField id="password" label="Password">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            className="px-10"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </FormField>

                <Button className="mt-4 w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending && <Spinner className="size-4" />}
                    Sign In
                </Button>
            </form>
        </div>
    );
}
