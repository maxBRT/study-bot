import { type Request, type Response } from "express";
import prisma from "../lib/prisma";

export const processTokenPurchase = async (req: Request, res: Response) => {
    try {
        // Validate request
        const { metadata } = req.body;
        if (!metadata) {
            console.error(`CRITICAL: Payment missing metadata! Manual fix required.`); // Log the error
            return res.status(200).json({ success: false, message: 'Received, but payload invalid.', data: null }); // Return 200 to avoid retries
        }

        // Process the payment
        if (!metadata.userId || !metadata.tokenAmount) {
            console.error(`CRITICAL: Payment missing metadata! Manual fix required.`); // Log the error
            return res.status(200).json({ success: false, message: 'Received, but payload invalid.', data: null }); // Return 200 to avoid retries
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
            console.error(`Orphaned Payment: User ${metadata.userId} not found.`); // Log the error
            return res.status(200).json({ success: false, message: 'Received, but user not found.', data: null }); // Return 200 to avoid retries
        }

        // Update the user's balance
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                tokens: user.tokens + BigInt(metadata.tokenAmount),
            }
        });

        // Create the transaction in the database
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
            data: null,
        });

    } catch (error: any) {
        // Handle errors
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
}
