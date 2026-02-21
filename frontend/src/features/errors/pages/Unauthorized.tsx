import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        Access Denied
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                        You don't have permission to access this page
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-6 text-sm text-slate-500">
                        If you believe this is an error, please contact your administrator.
                    </p>
                    <Link to="/">
                        <Button className="w-full">
                            Return to Home
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
