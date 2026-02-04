import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    // Check if the user is authenticated
    const result = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (!result?.session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // If it is authenticated, get the user data
    const user = await prisma.user.findUnique({
        where: {
            id: result.user.id,
        }
    });
    // If the user is not found, return a 404 error
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            error: "User not found"
        });
    }

    // pass the user and session to the request object
    req.user = user;
    req.session = result.session;
    next();
}
