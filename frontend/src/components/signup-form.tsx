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

interface SignupFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
    name: string
    setName: (name: string) => void
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    confirmPassword: string
    setConfirmPassword: (confirmPassword: string) => void
    onSubmit: (e: React.FormEvent) => void
    isLoading?: boolean
    error?: string
}

export function SignupForm({
    className,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    onSubmit,
    isLoading,
    error,
    ...props
}: SignupFormProps) {
    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Fill in the form below to create your account
                    </p>
                </div>
                {error && (
                    <p className="text-destructive text-sm text-center">{error}</p>
                )}
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Field>
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
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
                <Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create Account"}
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
                        Sign up with GitHub
                    </Button>
                    <FieldDescription className="px-6 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4">
                            Sign in
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
