import prisma from "../lib/prisma";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";

export const updateChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "Chat ID is required", data: null });

        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
            where: {
                id: id as string,
            },
        });
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found", data: null });

        // Get the updated title from the request body
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: "Missing parameters", data: null });
        }

        // Update the chat title
        const updatedChat = await prisma.chat.update({
            where: {
                id: id as string,
            },
            data: {
                title,
            },
        });

        // return the updated chat (Without the messages)
        return res.status(200).json({
            success: true,
            message: "Chat updated successfully",
            data: updatedChat,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}

export const deleteChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required", data: null })

        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
            where: {
                id: id as string,
            },
        });
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found", data: null });

        // delete the chat
        await prisma.chat.delete({
            where: {
                id: id as string,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
            data: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}

export const getChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required", data: null })

        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
            where: {
                id: id as string,
            },
            include: {
                messages: true,
            }
        })
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found", data: null });

        // return the chat (With the messages)
        res.status(200).json({
            success: true,
            message: "Chat found",
            data: chat,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}

export const getChatsForUser = async (req: AuthenticatedRequest, res: Response) => {
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
            data: chats,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
}



export const createChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title } = req.body;
        const user = req.user;
        if (!title) {
            return res.status(400).json({ success: false, message: "Missing parameters", data: null });
        }

        // Create a new chat
        const chat = await prisma.chat.create({
            data: {
                userId: user.id,
                title,
            },
            include: {
                messages: true,
            },
        });
        if (!chat) {
            return res.status(500).json({ success: false, message: "Internal server error", data: null });
        }

        // Return the created chat
        return res.status(201).json({
            success: true,
            message: "Chat created successfully",
            data: chat,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }

}
