import OpenAI from 'openai';
import { encoding_for_model, type TiktokenModel } from "tiktoken";
import type { AuthenticatedRequest } from '../types/express';
import type { Response } from 'express';
import dotenv from 'dotenv';
import prisma from '../lib/prisma';

dotenv.config();

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    const client = createOpenAIClient();
    const user = req.user;
    const { input, chatId, modelName } = req.body;
    if (!input || !chatId || !modelName) {
        return res.status(400).json({ message: 'Missing input' });
    }
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

    const stream = await client.responses.create({
        model: modelName,
        instructions: 'You are a coding assistant that talks like an old wizard',
        input: input,
        max_output_tokens: 1000,
        stream: true,
    });

    let content = '';

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

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            tokens: user.tokens - BigInt(inputTokens + outputTokens) < 0n ? 0n : user.tokens - BigInt(inputTokens + outputTokens),
        }
    });

}


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