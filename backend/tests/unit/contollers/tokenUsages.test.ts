import { describe, expect, it, beforeEach } from "vitest";
import { createMockAuthRequest, createMockResponse } from "../../helpers/mockRequest";
import { createTestUser } from "../../helpers/authHelpers";
import prisma from "../../../src/lib/prisma";
import { getTokenUsage, listTokenUsages } from "../../../src/controllers/tokenUsages";

describe("Token usages controller", () => {
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
    describe("listTokenUsages", () => {
        it("should return all token usages for a user", async () => {
            const { user } = await createTestUser();

            await prisma.tokenUsage.createMany({
                data: [
                    { id: 'token-usage-1', userId: user.id, tokenIn: 0, tokenOut: 200 },
                    { id: 'token-usage-2', userId: user.id, tokenIn: 200, tokenOut: 0 },
                ]
            });

            const req = await createMockAuthRequest(user);
            const res = createMockResponse();

            await listTokenUsages(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });
        it("should return an empty array if no token usages found", async () => {
            const { user } = await createTestUser();

            const req = await createMockAuthRequest(user);
            const res = createMockResponse();

            await listTokenUsages(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(0);
        });
    });
    describe("getTokenUsage", () => {
        it("should return a specific token usage by id", async () => {
            const { user } = await createTestUser();

            const tokenUsage = await prisma.tokenUsage.create({
                data: {
                    id: 'specific-token-usage-id',
                    userId: user.id,
                    tokenIn: 100,
                    tokenOut: 200,
                }
            });

            const req = await createMockAuthRequest(user, {
                params: { id: tokenUsage.id }
            });
            const res = createMockResponse();

            await getTokenUsage(req, res);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(tokenUsage.id);
        });

        it("should return 404 when token usage not found", async () => {
            const req = await createMockAuthRequest({ id: 'test-user' }, {
                params: { id: 'non-existent-token-usage' }
            });
            const res = createMockResponse();

            await getTokenUsage(req, res);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Token usage not found');
        });
    });
});

