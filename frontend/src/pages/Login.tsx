import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, useSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { Book } from "lucide-react";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            navigate("/dashboard", { replace: true });
        }
    }, [session, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const { error } = await signIn.email({ email, password });

        if (error) {
            setError(error.message || "Login failed");
            setIsLoading(false);
        }
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 font-medium">
                        <Book className="h-6 w-6" />
                        Study Bot
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1280&q=80"
                    alt="Study"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>
        </div>
    );
}
