import type { Chat } from "./chat";

export type User = {
    id: string;
    name: string;
    email: string;
    tokens: number;
    chats: Chat[];
};

export type UserStats = {
    totalTokens: number;
    thisMonthTokens: number;
    totalMessages: number;
    totalChats: number;
    avgTokensPerChat: number;
    avgMessagesPerChat: number;
    avgTokensPerMessage: number;
}
