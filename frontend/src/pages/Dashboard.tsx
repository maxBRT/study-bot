import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@/lib/auth";
import { Conversation } from "@/components/conversation";
import { useCurrentChat } from "@/hooks/use-current-chat";
import { Spinner } from "@/components/ui/spinner";
import type { DashboardOutletContext } from "@/components/dashboard-layout";
import { CreateChat } from "@/components/create-chat";

export function Dashboard() {
    const { id } = useParams<{ id?: string }>();
    const { data: session } = useSession();
    const navigate = useNavigate();
    const { chats, setChats, refetchUser } = useOutletContext<DashboardOutletContext>();
    const { chat, isLoading, error: chatError, addMessage, updateLastMessage, createChat } = useCurrentChat(id);

    useEffect(() => {
        if (chat && session?.user && chat.userId !== session.user.id) {
            navigate("/login");
        }
    }, [chat, session, navigate]);



    return (
        <main className="flex-1 overflow-hidden">
            {isLoading ? (
                <Spinner />
            ) : chatError ? (
                <p className="text-error">{chatError.message}</p>
            ) : chat ? (
                <Conversation messages={chat.messages} addMessage={addMessage} updateLastMessage={updateLastMessage} chatId={chat.id} onMessageComplete={refetchUser} />
            ) : (
                <CreateChat chats={chats} setChats={setChats} createChat={createChat} />
            )}
        </main>
    );
}
