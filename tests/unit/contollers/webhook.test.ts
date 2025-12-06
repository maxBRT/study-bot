import { processTokenPurchase } from '../../../src/controllers/webhooks';
import { describe, expect, it, beforeEach } from "vitest";
import { createMockRequest, createMockResponse } from "../../helpers/mockRequest";
import { createTestUser } from "../../helpers/authHelpers";
import type { Request } from "express";
import prisma from '../../../src/lib/prisma';

describe("Webhook controller", () => {
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
    describe("processTokenPurchase", () => {
        it("should process a valid payment", async () => {
            const { user } = await createTestUser();
            const req = createMockRequest({
                body: {
                    metadata: {
                        userId: user.id,
                        tokenAmount: 100,
                    }
                }
            });

            const res = await processTokenPurchase(req, createMockResponse());
            const userInDb = await prisma.user.findUnique({
                where: { id: user.id }
            });

            expect(res.statusCode).toBe(200);
            expect(userInDb?.tokens).toBe(1100n);
        });
        it("token amount should not be processed if metadata is missing", async () => {
            const { user } = await createTestUser();
            const req = createMockRequest({
                body: {
                    metadata: {
                        userId: user.id,
                    }
                }
            });

            const res = await processTokenPurchase(req, createMockResponse());
            const userInDb = await prisma.user.findUnique({
                where: { id: user.id }
            });

            expect(res.statusCode).toBe(200);
            expect(userInDb?.tokens).toBe(1000n);
        });
    });
});