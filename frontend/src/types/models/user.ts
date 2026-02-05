import type { Chat } from "./chat";

export type User = {
    id: string;
    name: string;
    email: string;
    token: string;
    chats: Chat[];
};
