import { describe, expect, it, beforeEach } from "vitest";
import { createChat, getChatsForUser, getChat, deleteChat, updateChat } from "../../../src/controllers/chats";
import { createMockAuthRequest, createMockResponse } from "../../helpers/mockRequest";
import { createTestUser } from "../../helpers/authHelpers";
import prisma from "../../../src/lib/prisma";

describe("Chats controller", () => {
    // Clean up before each test
    beforeEach(async () => {
        await prisma.user.deleteMany();
        await prisma.session.deleteMany();
        await prisma.account.deleteMany();
        await prisma.verification.deleteMany();
        await prisma.message.deleteMany();
        await prisma.tokenUsage.deleteMany();
        await prisma.chat.deleteMany();
    });

    describe("createChat", () => {
        it("should create a new chat with valid data", async () => {
            // Arrange: Create mock request and response
            const { user } = await createTestUser();

            const req = await createMockAuthRequest(user, {
                body: { title: 'My Test Chat' },
            });
            const res = createMockResponse();

            await createChat(req, res);

            // Assert: Check response
            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject({
                success: true,
                message: 'Chat created successfully',
                chat: {
                    title: 'My Test Chat',
                    userId: user.id,
                }
            });

            // Verify in database
            const chatInDb = await prisma.chat.findFirst({
                where: { userId: user.id }
            });
            expect(chatInDb).toBeTruthy();
            expect(chatInDb?.title).toBe('My Test Chat');
        });

        it("should return 400 when title is missing", async () => {
            const req = await createMockAuthRequest({ id: 'test-user-123' }, {
                body: {} // Missing title
            });
            const res = createMockResponse();

            await createChat(req, res);

            expect(res.statusCode).toBe(400);
        });
    });

    describe("getChatsForUser", () => {
        it("should return all chats for a user", async () => {
            const { user } = await createTestUser();

            await prisma.chat.createMany({
                data: [
                    { id: 'chat-1', title: 'Chat 1', userId: user.id },
                    { id: 'chat-2', title: 'Chat 2', userId: user.id },
                ]
            });

            const req = await createMockAuthRequest(user);
            const res = createMockResponse();

            await getChatsForUser(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.chats).toHaveLength(2);
        });
    });

    describe("getChat", () => {
        it("should return a specific chat by id", async () => {
            const { user } = await createTestUser();

            const chat = await prisma.chat.create({
                data: {
                    id: 'specific-chat-id',
                    title: 'Specific Chat',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                params: { id: chat.id }
            });
            const res = createMockResponse();

            await getChat(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.chat.title).toBe('Specific Chat');
        });

        it("should return 404 when chat not found", async () => {
            const req = await createMockAuthRequest({ id: 'test-user' }, {
                params: { id: 'non-existent-chat' }
            });
            const res = createMockResponse();

            await getChat(req, res);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Chat not found');
        });
    });

    describe("deleteChat", () => {
        it("should delete a chat successfully", async () => {
            const { user } = await createTestUser();

            const chat = await prisma.chat.create({
                data: {
                    id: 'chat-to-delete',
                    title: 'Chat to Delete',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                params: { id: chat.id }
            });
            const res = createMockResponse();

            await deleteChat(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            const deletedChat = await prisma.chat.findUnique({
                where: { id: chat.id }
            });
            expect(deletedChat).toBeNull();
        });
    });
    describe("updateChat", () => {
        it("should update a chat successfully", async () => {
            const { user } = await createTestUser();

            const chat = await prisma.chat.create({
                data: {
                    id: 'chat-to-update',
                    title: 'Chat to Update',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                params: { id: chat.id },
                body: { title: 'Updated Chat Title' }
            });
            const res = createMockResponse();

            await updateChat(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            const updatedChat = await prisma.chat.findUnique({
                where: { id: chat.id }
            });
            expect(updatedChat?.title).toBe('Updated Chat Title');
        });

        it("should return 400 when title is missing", async () => {
            const { user } = await createTestUser();

            const chat = await prisma.chat.create({
                data: {
                    id: 'chat-to-update',
                    title: 'Chat to Update',
                    userId: user.id,
                }
            });

            const req = await createMockAuthRequest(user, {
                params: { id: chat.id },
                body: { title: '' }
            });
            const res = createMockResponse();

            await updateChat(req, res);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Missing parameters');
        });
    });

});
