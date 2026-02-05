import type { Message } from "./message";

export type Chat = {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
};
