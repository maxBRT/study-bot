import { type Request, type Response } from "express";
import prisma from "../lib/prisma";

export const processTokenPurchase = async (req: Request, res: Response) => {
    try {
        // Validate request
        const { metadata } = req.body;
        if (!metadata) {
            console.error(`CRITICAL: Payment missing metadata! Manual fix required.`);
            return res.status(200).send('Received, but payload invalid.');
        }

        // Process the payment
        if (!metadata.userId || !metadata.tokenAmount) {
            console.error(`CRITICAL: Payment missing metadata! Manual fix required.`);
            return res.status(200).send('Received, but payload invalid.');
        }

        const user = await prisma.user.findUnique({
            where: {
                id: metadata.userId,
            },
            select: {
                id: true,
                tokens: true,
            }
        });
        if (!user) {
            console.error(`Orphaned Payment: User ${metadata.userId} not found.`);
            return res.status(200).json({ message: 'Received, but user not found.' });
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                tokens: user.tokens + BigInt(metadata.tokenAmount),
            }
        });
        await prisma.tokenUsage.create({
            data: {
                userId: user.id,
                tokenIn: metadata.tokenAmount,
            }
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
        });

    } catch (error: any) {
        // Handle errors
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}