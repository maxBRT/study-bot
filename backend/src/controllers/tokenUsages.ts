import type { Response } from 'express';
import prisma from '../lib/prisma';
import type { AuthenticatedRequest } from '../types/express';
import type { User } from 'better-auth';

export async function listTokenUsages(req: AuthenticatedRequest, res: Response) {
    try {
        // Get the user's data
        const user = req.user;
        const tokenUsages = await getTokenUsagesForUser(user);

        // Return the token usages
        res.status(200).json({
            success: true,
            message: 'Token usages retrieved successfully',
            data: tokenUsages,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
}

export async function getTokenUsage(req: AuthenticatedRequest, res: Response) {
    try {
        const tokenUsage = await prisma.tokenUsage.findUnique({
            where: {
                id: req.params.id as string,
            },
            include: {
                user: true,
            },
        });
        if (!tokenUsage) {
            res.status(404).json({
                success: false,
                message: 'Token usage not found',
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Token usage retrieved successfully',
            data: tokenUsage,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
}

async function getTokenUsagesForUser(user: User) {
    const tokenUsages = await prisma.tokenUsage.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Convert BigInt values to strings for JSON serialization
    return tokenUsages.map(usage => ({
        ...usage,
        tokenIn: usage.tokenIn?.toString() ?? "0",
        tokenOut: usage.tokenOut?.toString() ?? "0",
    }))
}
