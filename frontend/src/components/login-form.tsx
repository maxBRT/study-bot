import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { signIn } from "@/lib/auth"
import { Github } from "lucide-react"

interface LoginFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    onSubmit: (e: React.FormEvent) => void
    isLoading?: boolean
    error?: string
}

export function LoginForm({
    className,
    email,
    setEmail,
    password,
    setPassword,
    onSubmit,
    isLoading,
    error,
    ...props
}: LoginFormProps) {
    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>
                {error && (
                    <p className="text-destructive text-sm text-center">{error}</p>
                )}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                            to="/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => signIn.social({ provider: "github", callbackURL: "http://localhost:4321/dashboard" })}
                    >
                        <Github />
                        Login with GitHub
                    </Button>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
