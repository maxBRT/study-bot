import { Link } from "react-router-dom";
import { useSession } from "../lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Brain, Check, MessageSquare, Zap } from "lucide-react";
import reflecting from "@/assets/reflecting-tA1rdXzJ.png";
import growth from "@/assets/growth-DZ7EdHJS.png";
import lookingAhead from "@/assets/looking-ahead-DDDoMk_3.png"
import { ModeToggle } from "@/components/theme-toggle";

export function Home() {
    const { data: session, isPending } = useSession();

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex h-16 items-center justify-between border-b px-6  z-50 sticky top-0 bg-background">
                <div className="flex items-center gap-2">
                    <Book className="size-5" />
                    <span className="font-semibold">Study Bot</span>
                </div>
                <nav className="flex gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Home</a>
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                </nav>
                <nav className="flex gap-2">
                    {isPending ? null : session ? (
                        <Button asChild>
                            <Link to="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                        <ModeToggle/>
                </nav>
            </header>

            <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-32 text-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Book className="size-10" />
                    <span className="text-xl font-medium tracking-wide uppercase">Study Bot</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                    Study smarter with AI
                </h1>
                <p className="max-w-lg text-xl text-muted-foreground">
                    Your personal AI study companion. Ask questions, get explanations, and master any subject.
                </p>
                <div className="flex gap-3">
                    {session ? (
                        <Button size="lg" asChild>
                            <Link to="/dashboard">Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button size="lg" asChild>
                                <Link to="/register">Get Started</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                        </>
                    )}
                </div>
            </main>

            <section id="features" className="border-t min-h-screen px-6 py-32 flex items-center justify-center">
                <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <Brain className="size-5 text-muted-foreground" />
                            <CardTitle>AI-Powered</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Get instant explanations from multiple AI models tailored to your learning style.</p>
                            <img src={reflecting} alt="Reflecting" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <MessageSquare className="size-5 text-muted-foreground" />
                            <CardTitle>Conversational</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Learn through natural conversation. Ask follow-up questions and dive deeper.</p>
                            <img src={growth} alt="Growth" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Zap className="size-5 text-muted-foreground" />
                            <CardTitle>Track Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Monitor your usage and study habits with detailed stats and history.</p>
                            <img src={lookingAhead} alt="Looking Ahead" />
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section id="pricing" className="border-t min-h-screen px-6 py-32 flex items-center justify-center">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
                    <p className="mt-2 text-muted-foreground">Pay only for what you use. Buy tokens and spend them on any model.</p>
                </div>
                <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <p className="text-3xl font-bold">$0</p>
                            <CardDescription>1,000 tokens daily</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2"><Check className="size-4" /> All models included</div>
                            <div className="flex items-center gap-2"><Check className="size-4" /> Resets every day</div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" asChild>
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>5,000 Tokens</CardTitle>
                            <p className="text-3xl font-bold">$5</p>
                            <CardDescription>$0.001 per token</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2"><Check className="size-4" /> All models included</div>
                            <div className="flex items-center gap-2"><Check className="size-4" /> Never expires</div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>25,000 Tokens</CardTitle>
                            <p className="text-3xl font-bold">$20</p>
                            <CardDescription>$0.0008 per token</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2"><Check className="size-4" /> All models included</div>
                            <div className="flex items-center gap-2"><Check className="size-4" /> Never expires</div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" asChild>
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                Study Bot
            </footer>
        </div>
    );
}
