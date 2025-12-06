import OpenAI from 'openai';
import { encoding_for_model, type TiktokenModel } from "tiktoken";
import type { AuthenticatedRequest } from '../types/express';
import type { Response } from 'express';
import dotenv from 'dotenv';
import prisma from '../lib/prisma';
import type { User } from '../generated/prisma/client';

dotenv.config();

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Create OpenAI client
        const client = createOpenAIClient();

        // Validate request
        const user = req.user;
        const { input, chatId, modelName } = req.body;
        if (!input || !chatId || !modelName) {
            return res.status(400).json({
                success: false,
                message: 'Missing fields in request body',
            });
        }

        // Register the message in the database
        const inputTokens = countStringTokens(input, modelName);
        await prisma.message.create({
            data: {
                content: input,
                sender: user.name,
                modelName: modelName,
                chatId: chatId,
                tokenUsages: {
                    create: {
                        userId: user.id,
                        tokenOut: inputTokens,
                    }
                }
            }
        });

        // Send the message to OpenAI
        const stream = await client.responses.create({
            model: modelName,
            instructions: 'You are a coding assistant that talks like an old wizard',
            input: input,
            max_output_tokens: 1000,
            stream: true,
        });

        let content = '';

        // Stream to the client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        for await (const event of stream) {
            if (event.type === 'response.output_text.delta') {
                const text = event.delta;
                content += text.toString();
                res.write(text);
            }
        }
        res.end();

        // Register the message in the database
        const outputTokens = countStringTokens(content, modelName);
        await prisma.message.create({
            data: {
                content: content,
                sender: "agent",
                modelName: modelName,
                chatId: chatId,
                tokenUsages: {
                    create: {
                        userId: user.id,
                        tokenOut: outputTokens,
                    }
                }
            }
        });

        // Charge the tokens
        await chargeTokens(user, BigInt(inputTokens + outputTokens));

    } catch (error: any) {
        // OpenAI API errors
        if (error instanceof OpenAI.APIError) {
            return res.status(error.status || 500).json({
                success: false,
                message: 'OpenAI API error',
                error: error.message
            });
        }

        // Prisma errors
        if (error.code && error.code.startsWith('P')) {
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: error.message
            });
        }

        // general errors
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}


// === Helper functions ===
function createOpenAIClient() {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY as string,
    });
    return client;
}

function countStringTokens(input: string, model: string): number {
    const encoding = encoding_for_model(model as TiktokenModel);
    const tokens = encoding.encode(input);
    const count = tokens.length;
    encoding.free();
    return count;
}

async function chargeTokens(user: User, total: bigint) {
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            tokens: user.tokens - total < 0n ? 0n : user.tokens - total,
        }
    });
}