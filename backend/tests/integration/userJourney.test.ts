import { describe, expect, it, beforeEach } from "vitest";
import { createTestUser } from "../helpers/authHelpers";
import { createMockAuthRequest, createMockResponse } from "../helpers/mockRequest";
import { createChat, getChatsForUser, getChat, deleteChat } from "../../src/controllers/chats";
import { sendMessage } from "../../src/controllers/messages";
import { getMe } from "../../src/controllers/me";
import { getTokenUsage, listTokenUsages } from "../../src/controllers/tokenUsages";
import prisma from "../../src/lib/prisma";

describe("Top to bottom", () => {
    // Clean up database before each test to ensure test isolation
    beforeEach(async () => {
        await prisma.user.deleteMany();
        await prisma.session.deleteMany();
        await prisma.account.deleteMany();
        await prisma.verification.deleteMany();
        await prisma.message.deleteMany();
        await prisma.tokenUsage.deleteMany();
        await prisma.chat.deleteMany();
    });

    it("should create a chat, send a message, and get the token usages", async () => {
        // Create a test user with default token balance (1000)
        const { user } = await createTestUser();

        // Create a new chat for the user
        const req = await createMockAuthRequest(user, {
            body: { title: 'Test Chat' },
        });
        const res = createMockResponse();

        await createChat(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.chat.title).toBe('Test Chat');
        const chatId = res.body.chat.id;

        // Send a message to the chat
        const req2 = await createMockAuthRequest(user, {
            body: {
                input: "What is the meaning of life?",
                chatId,
                modelName: "gpt-4.1-nano"
            }
        });
        await sendMessage(req2, res);
        expect(res.statusCode).toBe(201);
        expect(res.headers['Content-Type']).toBe('text/event-stream');

        // Retrieve all token usages for the user
        const req3 = await createMockAuthRequest(user);
        await listTokenUsages(req3, res);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // Should have 2 token usages: one for input tokens, one for output tokens
        expect(res.body.tokenUsages).toHaveLength(2);

        // Calculate total tokens spent across all usages
        let tokenSpent = 0;
        for (const tokenUsage of res.body.tokenUsages) {
            tokenSpent += parseInt(tokenUsage.tokenIn);
            tokenSpent += parseInt(tokenUsage.tokenOut);
        };

        // Verify user's token balance is correctly updated
        const req4 = await createMockAuthRequest(user);
        await getMe(req4, res);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // User started with 1000 tokens, should now have (1000 - tokenSpent)
        expect(res.body.data.tokens).toBe((1000 - tokenSpent).toString());
    });
    it("should handle multi-turn conversation with correct token accumulation", async () => {
        // Create a test user with default token balance (1000)
        const { user } = await createTestUser();

        // Create a new chat for multi-turn conversation testing
        const createChatReq = await createMockAuthRequest(user, {
            body: { title: 'Multi-turn Chat' },
        });
        const res = createMockResponse();
        await createChat(createChatReq, res);
        expect(res.statusCode).toBe(201);
        const chatId = res.body.chat.id;

        // Send first message
        const msg1Req = await createMockAuthRequest(user, {
            body: {
                input: "Hello, what is AI?",
                chatId,
                modelName: "gpt-4.1-nano"
            }
        });
        await sendMessage(msg1Req, res);
        expect(res.statusCode).toBe(201);

        // Check token usage after first message to establish baseline
        const tokenReq1 = await createMockAuthRequest(user);
        await listTokenUsages(tokenReq1, res);
        const tokensAfterMsg1 = res.body.tokenUsages;
        // At least 2 usages: one for user input, one for agent response
        expect(tokensAfterMsg1.length).toBeGreaterThanOrEqual(2);

        // Send second message - should include previous messages in context
        const msg2Req = await createMockAuthRequest(user, {
            body: {
                input: "Can you explain more about machine learning?",
                chatId,
                modelName: "gpt-4.1-nano"
            }
        });
        await sendMessage(msg2Req, res);
        expect(res.statusCode).toBe(201);

        // Send third message - context window now includes multiple previous messages
        const msg3Req = await createMockAuthRequest(user, {
            body: {
                input: "What are neural networks?",
                chatId,
                modelName: "gpt-4.1-nano"
            }
        });
        await sendMessage(msg3Req, res);
        expect(res.statusCode).toBe(201);

        // Verify token usages have accumulated across all messages
        const tokenReq2 = await createMockAuthRequest(user);
        await listTokenUsages(tokenReq2, res);
        const tokensAfterMsg3 = res.body.tokenUsages;
        // Should have more token usages than after the first message
        expect(tokensAfterMsg3.length).toBeGreaterThan(tokensAfterMsg1.length);

        // Calculate total tokens spent across all messages
        let totalTokensSpent = 0;
        for (const tokenUsage of tokensAfterMsg3) {
            totalTokensSpent += parseInt(tokenUsage.tokenIn);
            totalTokensSpent += parseInt(tokenUsage.tokenOut);
        }

        // Verify user's token balance reflects cumulative consumption
        const meReq = await createMockAuthRequest(user);
        await getMe(meReq, res);
        expect(res.statusCode).toBe(200);
        // Balance should be initial 1000 minus all tokens spent
        expect(res.body.data.tokens).toBe((1000 - totalTokensSpent).toString());

        // Verify chat contains all messages from the conversation
        const getChatReq = await createMockAuthRequest(user, {
            params: { id: chatId }
        });
        await getChat(getChatReq, res);
        expect(res.statusCode).toBe(200);
        // Should have 6 total messages: 3 from user + 3 from agent
        expect(res.body.data.chat.messages.length).toBe(6);
    });
    it("should handle token depletion correctly", async () => {
        // Create a test user with default token balance (1000)
        const { user } = await createTestUser();
        const res = createMockResponse();

        // Create a chat for testing token depletion
        const createChatReq = await createMockAuthRequest(user, {
            body: { title: 'Token Depletion Test' },
        });
        await createChat(createChatReq, res);
        expect(res.statusCode).toBe(201);
        const chatId = res.body.chat.id;

        // Manually set user's tokens to a very low amount to simulate near-depletion
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                tokens: 60n,
                tokenRefreshAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
            }
        });

        // Verify the user now has only 50 tokens
        const meReq1 = await createMockAuthRequest(updatedUser);
        await getMe(meReq1, res);
        expect(res.body.data.tokens).toBe("60");

        // Send a message that will consume most or all remaining tokens
        const msgReq = await createMockAuthRequest(updatedUser, {
            body: {
                input: "This is a test message",
                chatId,
                modelName: "gpt-4.1-nano"
            }
        });
        await sendMessage(msgReq, res);
        expect(res.statusCode).toBe(201);

        // Check that tokens were deducted
        const meReq2 = await createMockAuthRequest(updatedUser);
        await getMe(meReq2, res);
        const remainingTokens = parseInt(res.body.data.tokens);

        // User should either have 0 tokens or a very small positive amount
        expect(remainingTokens).toBeLessThan(50);
        expect(remainingTokens).toBeGreaterThanOrEqual(0);

        // Verify the user object in database has tokens >= 0 (never negative)
        const userFromDb = await prisma.user.findUnique({
            where: { id: user.id }
        });
        expect(userFromDb?.tokens).toBeGreaterThanOrEqual(0n);
    });
});