import prisma from "../lib/prisma";
import type { Response, Request } from "express";


export const getChatsForUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const chats = await prisma.chat.findMany({
            where: {
                userId: user.id,
            },
            include: {
                messages: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Chats retrieved successfully",
            chats,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
}



export const createChat = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const user = req.user;
        if (!title) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        const chat = await prisma.chat.create({
            data: {
                userId: user.id,
                title,
            },
        });
        if (!chat) {
            return res.status(500).json({ message: "Internal server error" });
        }

        return res.status(201).json({
            success: true,
            message: "Chat created successfully",
            chat,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }

}
