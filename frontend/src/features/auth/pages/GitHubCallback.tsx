import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import type { User } from "../../../types/user";

export default function GitHubCallback() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");

        if (error || !token || !userParam) {
            const messages: Record<string, string> = {
                github_auth_failed: "GitHub authentication failed. Please try again.",
                github_no_email: "Your GitHub account has no public email. Please add one and retry.",
                no_default_role: "Account setup failed. Please contact an administrator.",
            };
            const msg = messages[error ?? ""] ?? "GitHub login failed. Please try again.";
            navigate("/login?error=" + encodeURIComponent(msg), { replace: true });
            return;
        }

        try {
            const user: User = JSON.parse(decodeURIComponent(userParam));
            login(token, user);
            navigate("/dashboard", { replace: true });
        } catch {
            navigate("/login?error=" + encodeURIComponent("Invalid response from server."), { replace: true });
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-600">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Signing you in with GitHub…</p>
            </div>
        </div>
    );
}
