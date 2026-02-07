import OpenAI from 'openai';
import { encoding_for_model, type TiktokenModel } from "tiktoken";
import type { AuthenticatedRequest } from '../types/express';
import type { Response } from 'express';
import dotenv from 'dotenv';
import prisma from '../lib/prisma';
import type { User } from '../generated/prisma/client';
import fs from 'fs';
import path from 'path';


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
                data: null,
            });
        }

        // Register the message in the database
        const msg = await prisma.message.create({
            data: {
                content: input,
                sender: "user",
                modelName: modelName,
                chatId: chatId,
            }
        });

        // Get the conversation history
        const messages = await prisma.message.findMany({
            where: {
                chatId: chatId,
            },
            select: {
                content: true,
                sender: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
        });

        // Count tokens for all messages 
        let inputTokens = 0;
        for (const m of messages) {
            inputTokens += countStringTokens(m.content, modelName);
        }

        await prisma.tokenUsage.create({
            data: {
                userId: user.id,
                messageId: msg.id,
                tokenIn: 0,
                tokenOut: inputTokens,
            }
        });

        const systemPrompt: OpenAI.Chat.ChatCompletionMessageParam = {
            role: "system",
            content: getSystemPrompt(),
        };

        // Format messages for OpenAI
        const formattedMessages = messages.map(m => ({
            role: m.sender === "agent" ? "assistant" : "user",
            content: m.content
        })) as OpenAI.Chat.ChatCompletionMessageParam[];

        // Send the message to OpenAI
        // Newer models (gpt-4o, gpt-5.x, o-series) require max_completion_tokens and don't support custom temperature
        const isLegacyModel = modelName.startsWith("gpt-3.5") || modelName === "gpt-4";
        const stream = await client.chat.completions.create({
            model: modelName,
            messages: [systemPrompt, ...formattedMessages],
            ...(isLegacyModel ? { max_tokens: 1000, temperature: 0.5 } : { max_completion_tokens: 1000 }),
            stream: true,
        });

        let content = '';

        // Stream to the client
        res.status(201);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
                content += text;
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
                message: error.message,
                data: null,
            });
        }

        // general errors
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
            data: null,
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
    let encoding;
    try {
        encoding = encoding_for_model(model as TiktokenModel);
    } catch {
        // Fallback for models not yet supported by tiktoken
        encoding = encoding_for_model("gpt-4" as TiktokenModel);
    }
    const tokens = encoding.encode(input);
    const count = tokens.length;
    encoding.free();
    return count;
}

async function chargeTokens(user: User, total: bigint) {
    // Fetch current user balance to avoid using stale data
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { tokens: true }
    });

    if (!currentUser) {
        throw new Error('User not found');
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            tokens: currentUser.tokens - total < 0n ? 0n : currentUser.tokens - total,
        }
    });
}

function getSystemPrompt() {
    const systemPromptPath = path.join(process.cwd(), 'prompts', 'system.md');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');
    return systemPrompt;
}
