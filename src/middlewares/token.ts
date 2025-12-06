import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import prisma from "../lib/prisma";

export async function tokenUsageMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const requiredTokens = 50;
    const user = req.user;

    console.log(`User ${user.id} has ${user.tokens} tokens`);
    console.log(`User ${user.id} will refresh at ${user.tokenRefreshAt}`);

    if (user.tokenRefreshAt < new Date(Date.now())) {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                tokens: 1000n,
                tokenRefreshAt: new Date(Date.now() + 1000 * 60 * 2),
            }
        });
        req.user = updatedUser;
    }

    if (req.user.tokens < requiredTokens) {
        return res.status(403).json({
            message: `Token are refreshing at ${req.user.tokenRefreshAt}`,
            error: "Insufficient tokens"
        });
    }

    next();
}