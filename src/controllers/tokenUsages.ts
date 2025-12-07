import type { Response } from 'express';
import prisma from '../lib/prisma';
import type { AuthenticatedRequest } from '../types/express';

export async function listTokenUsages(req: AuthenticatedRequest, res: Response) {
    try {
        const user = req.user;
        const tokenUsages = await getTokenUsagesForUser(user);
        res.status(200).json({
            success: true,
            message: 'Token usages retrieved successfully',
            tokenUsages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
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
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Token usage retrieved successfully',
            tokenUsage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

async function getTokenUsagesForUser(user: any) {
    const tokenUsages = await prisma.tokenUsage.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return tokenUsages.map(usage => ({
        ...usage,
        tokenIn: usage.tokenIn?.toString() ?? "0",
        tokenOut: usage.tokenOut?.toString() ?? "0",
    }))
}