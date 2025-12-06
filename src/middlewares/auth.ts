import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import type { AuthenticatedRequest } from "../types/express";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (!result?.session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: result.user.id,
        }
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            error: "User not found"
        });
    }

    req.user = user;
    req.session = result.session;

    next();
}