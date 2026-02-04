import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import prisma from "../lib/prisma";

export async function tokenUsageMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {

    const requiredTokens = 50;
    const user = req.user;

    // Check if the tokens needs to be refreshed
    if (user.tokenRefreshAt < new Date(Date.now())) {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                tokens: 1000n,
                // Set the token refresh time to 2 minutes from now
                tokenRefreshAt: new Date(Date.now() + 1000 * 60 * 2),
            }
        });
        req.user = updatedUser;
    }

    // Check if the has enough tokens
    if (req.user.tokens < requiredTokens) {
        return res.status(403).json({
            message: `Token are refreshing at ${req.user.tokenRefreshAt}`,
            error: "Insufficient tokens"
        });
    }

    next();
}
