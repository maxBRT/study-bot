import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import type { Chat } from "@/types/models/chat";

type CreateChatProps = {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    createChat: (title: string) => Promise<Chat | null>;
};

export function CreateChat({ chats, setChats, createChat }: CreateChatProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateChat = async () => {
        if (!title.trim()) return;
        setIsCreating(true);
        try {
            const newChat = await createChat(title);
            if (!newChat) return;
            setChats([...chats, newChat]);
            navigate(`/dashboard/${newChat.id}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
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
    );
}