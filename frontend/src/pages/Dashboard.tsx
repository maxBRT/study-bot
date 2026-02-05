import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Conversation } from "@/components/conversation";
import { useCurrentChat } from "@/hooks/use-current-chat";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserChats } from "@/hooks/use-user-chats";

export function Dashboard() {
    const { id } = useParams<{ id?: string }>();
    const { data: session } = useSession();
    const navigate = useNavigate();
    const { chat, isLoading, error, addMessage, updateLastMessage, createChat } = useCurrentChat(id);
    const { chats, setChats } = useUserChats();
    const [title, setTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (chat && session?.user && chat.userId !== session.user.id) {
            navigate("/login");
        }
    }, [chat, session, navigate]);

    const handleCreateChat = async () => {
        if (!title.trim()) return;
        setIsCreating(true);
        try {
            const newChat = await createChat(title);
            setChats([...chats, newChat]);
            navigate(`/dashboard/${newChat.id}`);
        } finally {
            setIsCreating(false);
        }
    };





    return (
        <SidebarProvider>
            <AppSidebar chats={chats} setChats={setChats} />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="font-medium">Dashboard</span>
                </header>
                <main className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <Spinner />
                    ) : error ? (
                        <p className="text-error">{error.message}</p>
                    ) : chat ? (
                        <Conversation messages={chat.messages} addMessage={addMessage} updateLastMessage={updateLastMessage} chatId={chat.id} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <h1 className="text-2xl font-bold">What are we studying?</h1>
                            <div className="flex gap-2 w-full max-w-md">
                                <Input
                                    type="text"
                                    placeholder="Enter a title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
                                />
                                <Button onClick={handleCreateChat} disabled={isCreating}>
                                    {isCreating ? "Creating..." : "Start"}
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
