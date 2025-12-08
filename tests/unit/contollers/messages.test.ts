import { describe, expect, it, beforeEach } from "vitest";
import { sendMessage } from "../../../src/controllers/messages";
import { createMockAuthRequest, createMockResponse } from "../../helpers/mockRequest";
import prisma from "../../../src/lib/prisma";
import { createTestUser } from "../../helpers/authHelpers";

describe("Messages controller", () => {
    // Clean up before each test
    beforeEach(async () => {
        // Delete in order of dependencies (children first, then parents)
        await prisma.tokenUsage.deleteMany();
        await prisma.message.deleteMany();
        await prisma.chat.deleteMany();
        await prisma.session.deleteMany();
        await prisma.account.deleteMany();
        await prisma.verification.deleteMany();
        await prisma.user.deleteMany();
    });
    describe("sendMessage", () => {
        it("should send a message and receive a response", async () => {
            const { user } = await createTestUser();
            const chat = await prisma.chat.create({
                data: {
                    title: 'Test Chat',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                body: {
                    input: 'Test message',
                    chatId: chat.id,
                    modelName: 'gpt-4.1-nano',
                }
            });
            const res = createMockResponse();

            await sendMessage(req, res);

            expect(res.statusCode).toBe(201);
            expect(res.headers['Content-Type']).toBe('text/event-stream');
        });
        it("should return 400 when input is missing", async () => {
            const { user } = await createTestUser();
            const chat = await prisma.chat.create({
                data: {
                    title: 'Test Chat',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                body: {
                    chatId: chat.id,
                    modelName: 'gpt-4.1-nano',
                }
            });
            const res = createMockResponse();

            await sendMessage(req, res);

            expect(res.statusCode).toBe(400);
        });
        it("should return 500 when model name is invalid", async () => {
            const { user } = await createTestUser();
            const chat = await prisma.chat.create({
                data: {
                    title: 'Test Chat',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                body: {
                    input: 'Test message',
                    chatId: chat.id,
                    modelName: 'invalid-model',
                }
            });
            const res = createMockResponse();

            await sendMessage(req, res);

            expect(res.statusCode).toBe(500);
        });
    });
});