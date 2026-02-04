import { useParams } from "react-router-dom";
import { useSession } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function Dashboard() {
    const { id } = useParams<{ id?: string }>();
    const { data: session } = useSession();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="font-medium">Dashboard</span>
                </header>
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Welcome back!</h1>
                    <p className="text-muted-foreground mt-2">
                        Signed in as {session?.user?.email}
                    </p>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
