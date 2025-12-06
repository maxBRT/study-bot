import { describe, expect, it, beforeEach, vi } from "vitest";
import { tokenUsageMiddleware } from "../../../src/middlewares/token";
import { createMockAuthRequest, createMockResponse } from "../../helpers/mockRequest";
import prisma from "../../../src/lib/prisma";
import { createTestUser, generateAuthHeaders } from "../../helpers/authHelpers";

describe("Token middleware", () => {
    // Clean up before each test
    beforeEach(async () => {
        await prisma.tokenUsage.deleteMany();
        await prisma.message.deleteMany();
        await prisma.chat.deleteMany();
        await prisma.session.deleteMany();
        await prisma.account.deleteMany();
        await prisma.verification.deleteMany();
        await prisma.user.deleteMany();
    });
    describe("tokenUsageMiddleware", () => {
        it("should call next() when user has enough tokens", async () => {
            const { user, sessionToken } = await createTestUser();
            const req = await createMockAuthRequest(user, {
                headers: generateAuthHeaders(sessionToken),
            });
            const res = createMockResponse();
            const next = vi.fn();

            await tokenUsageMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
        it("should return 403 when user has insufficient tokens", async () => {
            let { user } = await createTestUser();
            user = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    tokens: 0n,
                    tokenRefreshAt: new Date(Date.now() + 1000 * 60 * 2),
                }
            });
            const req = await createMockAuthRequest(user);
            const res = createMockResponse();
            const next = vi.fn();

            await tokenUsageMiddleware(req, res, next);

            expect(res.statusCode).toBe(403);
            expect(next).not.toHaveBeenCalled();
        });
        it("should call next() when user has no tokens and refresh is due", async () => {
            let { user } = await createTestUser();
            user = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    tokens: 0n,
                    tokenRefreshAt: new Date(Date.now()),
                }
            });
            const req = await createMockAuthRequest(user);
            const res = createMockResponse();
            const next = vi.fn();

            await tokenUsageMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});