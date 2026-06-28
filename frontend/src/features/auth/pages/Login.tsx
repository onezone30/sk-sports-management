import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import skLogo from '../../../assets/sk_logo.png';
import sk_background from '../../../assets/SK_background.png';
import Footer from "../../../components/layouts/Footer";
import api from "../../../lib/axios";
import { useAuth } from "../../../hooks/useAuth";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState(searchParams.get("error") ?? "");

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
        <>
            <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <img
                        src={sk_background}
                        alt="Background"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
                </div>

                <Card className="z-10 w-full max-w-md border-slate-200 bg-white/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/80">
                    <CardHeader className="space-y-1 text-center">

                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-white p-3 shadow-md">
                                <img src={skLogo} alt="SK Sports" className="h-12 w-auto" />
                            </div>
                        </div>

                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        placeholder="coach@sksports.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        className="px-10 border-slate-500"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    
                                    <Input
                                        id="password"
                                        type="password"
                                        className="px-10 border-slate-500"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    
                                </div>
                                
                                <div className="flex justify-end">
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 mt-5">
                            <Button className="w-full bg-blue-600 hover:bg-blue-500" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>

                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-400">or</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-slate-300 hover:bg-slate-50"
                                onClick={() => { window.location.href = `${BACKEND_URL}/auth/github`; }}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                Continue with GitHub
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            <Footer />
        </>
    );
}