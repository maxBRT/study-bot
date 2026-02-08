import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "./ui/separator";
import type { Chat } from "@/types/models/chat";
import type { User } from "@/types/models/user";

type SidebarLayoutProps = {
    children: React.ReactNode;
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    user: User | null;
    onPurchaseToken: () => void;
};

export function SidebarLayout({ children, chats, setChats, user, onPurchaseToken }: SidebarLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar chats={chats} setChats={setChats} />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex flex-row items-center justify-between w-full">
                        <span className="font-medium">Dashboard</span>
                        <div className="flex flex-row gap-2 items-center">
                            <p>You have {user?.tokens} tokens left</p>
                            <Button variant="outline" onClick={onPurchaseToken}>
                                <Plus />
                            </Button>
                        </div>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
