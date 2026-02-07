import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import prisma from "../lib/prisma";

export async function tokenUsageMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {

    const requiredTokens = 50;
    const user = req.user;

    // Check if the tokens needs to be refreshed
    if (user.tokenRefreshAt < new Date(Date.now())) {
        // Only top up if the user has fewer than 1000 tokens — don't overwrite purchased tokens
        const newTokens = user.tokens < 1000n ? 1000n : user.tokens;
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                tokens: newTokens,
                // Set the token refresh time to 2 minutes from now
                tokenRefreshAt: new Date(Date.now() + 1000 * 60 * 2),
            }
        });
        req.user = updatedUser;
    }

    // Check if the has enough tokens
    if (req.user.tokens < requiredTokens) {
        return res.status(403).json({
            success: false,
            message: `Insufficient tokens. Token are refreshing at ${req.user.tokenRefreshAt}`,
            data: null,
        });
    }

    next();
}
