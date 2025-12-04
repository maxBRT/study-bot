import OpenAI from 'openai';
import type { AuthenticatedRequest } from '../types/express';
import type { Response } from 'express';
import dotenv from 'dotenv';
import prisma from '../lib/prisma';

dotenv.config();

export const postMessage = async (req: AuthenticatedRequest, res: Response) => {
    const client = createOpenAIClient();
    const user = req.user;
    const { input, chatId, model_name } = req.body;
    if (!input || !chatId || !model_name) {
        return res.status(400).json({ message: 'Missing input' });
    }
    // Fetch the user and check if they have at least 1000 tokens 

    // const user = await prisma.user.findUnique({
    //     where: {
    //         id: userId,
    //     },
    // });
    // if (user.token < 1000) {
    //     return res.status(401).json({ message: 'Not enough tokens' });
    // }

    await prisma.message.create({
        data: {
            content: input,
            sender: user.name,
            modelName: model_name,
            chatId: chatId,
        }
    });

    const stream = await client.responses.create({
        model: 'gpt-4.1-nano',
        instructions: 'You are a coding assistant that talks like an old wizard',
        input: input,
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

    await prisma.message.create({
        data: {
            content: content,
            sender: "agent",
            modelName: model_name,
            chatId: chatId,
        }
    });
}



// const response = await client.responses.create({
//     model: 'gpt-4o',
//     instructions: 'You are a coding assistant that talks like a pirate',
//     input: 'Are semicolons optional in JavaScript?',
// });

// console.log(response.output_text);


const createOpenAIClient = () => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY as string,
    });
    return client;
}