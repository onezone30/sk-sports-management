import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import api from "@/shared/api/client";
import { useAuth } from "../model/useAuth";

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
        setError("");
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post("/login", formData);

            console.log("Login successful:", response.data);
            login(response.data.access_token, response.data.user);
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            if(error.response && error.response.status === 401) {
                setError("Invalid email or password");

            } else {
                setError("Something went wrong. Please try again");
            }
            setFormData({
                email: "",
                password: ""
            });
        } finally {
            setIsLoading(false);
        }
    }

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

            <form onSubmit={handleLogin} className="mt-8 grid gap-4">
                {error && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
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
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                        <Input
                            id="password"
                            type="password"
                            className="px-10"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button className="mt-4 w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </form>
        </div>
    );
}
