import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import prisma from "../lib/prisma";

export async function getMe(req: AuthenticatedRequest, res: Response) {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        include: {
            chats: true,
        },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    // Convert BigInt values to strings for JSON serialization
    const userData = {
        ...user,
        tokens: user.tokens.toString(),
    }

    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: userData
    });
}