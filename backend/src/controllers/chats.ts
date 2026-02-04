import prisma from "../lib/prisma";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";

export const updateChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "Chat ID is required" });

        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
            where: {
                id: id as string,
            },
        });
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

        // Get the updated title from the request body
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: "Missing parameters" });
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
            updatedChat,
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

export const deleteChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" })

        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
            where: {
                id: id as string,
            },
        });
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

        // delete the chat
        await prisma.chat.delete({
            where: {
                id: id as string,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
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

export const getChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" })

        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
            where: {
                id: id as string,
            },
            include: {
                messages: true,
            }
        })
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

        // return the chat (With the messages)
        res.status(200).json({
            success: true,
            message: "Chat found",
            data: { chat }
        })

    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
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



export const createChat = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title } = req.body;
        const user = req.user;
        if (!title) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        // Create a new chat
        const chat = await prisma.chat.create({
            data: {
                userId: user.id,
                title,
            },
        });
        if (!chat) {
            return res.status(500).json({ message: "Internal server error" });
        }

        // Return the created chat
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
