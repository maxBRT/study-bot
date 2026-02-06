import { api, ApiError } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Chat } from "@/types/models/chat";
import React, { useEffect } from "react";

export function useUserChats() {
    const [chats, setChats] = React.useState<Chat[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    useEffect(() => {
        async function fetchChats() {
            setIsLoading(true);
            try {
                const res = await api<ApiResponse<Chat[]>>(`/chats`);
                const data = res.data;
                setChats(data);
                setIsLoading(false);
            } catch (err) {
                setError(err as ApiError);
                setIsLoading(false);
            }
        }
        fetchChats();
    }, []);

    return { chats, setChats, isLoading, error };
}
