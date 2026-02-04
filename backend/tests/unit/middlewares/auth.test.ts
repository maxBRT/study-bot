import { describe, expect, it, beforeEach, vi } from "vitest";
import { authMiddleware } from "../../../src/middlewares/auth";
import { createMockAuthRequest, createMockResponse } from "../../helpers/mockRequest";
import prisma from "../../../src/lib/prisma";
import { createTestUser, generateAuthHeaders } from "../../helpers/authHelpers";

describe("Auth middleware", () => {
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
    describe("authMiddleware", () => {
        it("should call next() when session is valid", async () => {
            const { user, sessionToken } = await createTestUser();
            const req = await createMockAuthRequest(user, {
                headers: generateAuthHeaders(sessionToken),
            });
            const res = createMockResponse();
            const next = vi.fn();

            console.log(sessionToken);

            await authMiddleware(req, res, next);

            expect(req.user).toBeDefined();
            expect(req.user.id).toBe(user.id);
            expect(req.session).toBeDefined();
            console.log(req.session);
            expect(req.session.token).toBe(sessionToken);
        });

        it("should return 401 when session is not found", async () => {
            const req = await createMockAuthRequest({ id: 'test-user-123' });
            const res = createMockResponse();
            const next = vi.fn();

            await authMiddleware(req, res, next);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({ error: "Unauthorized" });
            expect(next).not.toHaveBeenCalled();
        });

        it("should return 404 when user is not found in database", async () => {
            const { user, sessionToken } = await createTestUser();
        });
    });
});
