import { api, ApiError } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Chat } from "@/types/models/chat";
import type { Message } from "@/types/models/message";
import React, { useEffect } from "react";

type ChatState = {
    addMessage: (message: Message) => void;
    updateLastMessage: (chunk: string) => void;
    createChat: (title: string) => Promise<Chat>;
    setChat: (chat: Chat) => void;
} & (
        | { chat: null; isLoading: false; error: null }
        | { chat: null; isLoading: true; error: null }
        | { chat: null; isLoading: false; error: Error }
        | { chat: Chat; isLoading: false; error: null }
    );

export function useCurrentChat(chatId: string | undefined): ChatState {
    const [chat, setChat] = React.useState<Chat | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const addMessage = (message: Message) => {
        setChat(prev => prev ? { ...prev, messages: [...prev.messages, message] } : null);
    };

    const updateLastMessage = (chunk: string) => {
        // Update the chat state with the new message currently being streamed
        setChat(prev => {
            if (!prev || prev.messages.length === 0) return prev;

            const newMessages = [...prev.messages];
            const lastIndex = newMessages.length - 1;
            const lastMessage = newMessages[lastIndex];

            // Append the chunk to the last message
            newMessages[lastIndex] = {
                ...lastMessage,
                content: (lastMessage?.content ?? "") + chunk,
            } as Message;

            return { ...prev, messages: newMessages };
        });

    };

    const createChat = async (title: string) => {
        try {
            setIsLoading(true);
            const res = await api<ApiResponse<Chat>>('/chats', {
                method: 'POST',
                body: { title },
            });
            setChat(res.data);
            return res.data;
        } catch (err) {
            setError(err as ApiError);
            setIsLoading(false);
        }

    };

    useEffect(() => {
        if (!chatId) {
            setChat(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        async function fetchChat() {
            setIsLoading(true);
            try {
                const res = await api<ApiResponse<Chat>>(`/chats/${chatId}`);
                const data = res.data;
                setChat(data);
                setIsLoading(false);
            } catch (err) {
                setError(err as ApiError);
                setIsLoading(false);
            }
        }
        fetchChat();
    }, [chatId]);

    return { chat, isLoading, error, addMessage, updateLastMessage, createChat, setChat } as ChatState;
}

