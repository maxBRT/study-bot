import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import prisma from "../lib/prisma";


export async function getStats(req: AuthenticatedRequest, res: Response) {
    try {
        // Get the user's data
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            include: {
                chats: true,
                tokenUsages: true,
            },
        });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found", data: null });
            return;
        }
        const data: Record<string, any> = {};

        // Compute the total number of tokens used by the user
        let totalTokens = 0;
        for (const tokenUsage of user.tokenUsages) {
            totalTokens += Number(tokenUsage.tokenOut);
        }
        data.totalTokens = totalTokens;

        // Compute the total number of tokens used this mounth 
        let thisMonthTokens = 0;
        for (const tokenUsage of user.tokenUsages) {
            if (tokenUsage.createdAt.getMonth() === new Date().getMonth()) {
                thisMonthTokens += Number(tokenUsage.tokenOut);
            }
        }
        data.thisMonthTokens = thisMonthTokens;

        // Compute the total number of messages sent by the user
        let totalMessages = 0;
        for (const chat of user.chats) {
            totalMessages += await prisma.message.count({
                where: {
                    chatId: chat.id,
                },
            });
        }
        data.totalMessages = totalMessages;

        // Compute the total number of chats created by the user
        let totalChats = 0;
        for (const chat of user.chats) {
            totalChats++;
        }
        data.totalChats = totalChats;

        //Compute the avg number of tokens per chat
        let avgTokensPerChat = 0;
        if (totalChats > 0) {
            avgTokensPerChat = totalTokens / totalChats;
        }
        data.avgTokensPerChat = avgTokensPerChat;

        // Compute the avg number of messages per chat
        let avgMessagesPerChat = 0;
        if (totalChats > 0) {
            avgMessagesPerChat = totalMessages / totalChats;
        }
        data.avgMessagesPerChat = avgMessagesPerChat;

        // Compute the avg number of tokens per message
        let avgTokensPerMessage = 0;
        if (totalMessages > 0) {
            avgTokensPerMessage = totalTokens / totalMessages;
        }
        data.avgTokensPerMessage = avgTokensPerMessage;

        // Return the stats
        res.status(200).json({
            success: true,
            message: "Stats retrieved successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}



export async function getMe(req: AuthenticatedRequest, res: Response) {
    // Get the user's data
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        include: {
            chats: true,
        },
    });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found", data: null });
        return;
    }

    // Convert BigInt values to strings for JSON serialization
    const userData = {
        ...user,
        tokens: user.tokens.toString(),
    }

    // Return the user data
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: userData
    });
}
