import { beforeEach, describe, expect, it } from 'vitest';
import { getMe } from '../../../src/controllers/me';
import prisma from '../../../src/lib/prisma';
import { createTestUser } from '../../helpers/authHelpers';
import { createMockAuthRequest, createMockResponse } from '../../helpers/mockRequest';

describe('getMe', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
        await prisma.chat.deleteMany();
        await prisma.message.deleteMany();
        await prisma.tokenUsage.deleteMany();
        await prisma.session.deleteMany();
        await prisma.account.deleteMany();
    });
    it('should return the user and their chats and token usages', async () => {
        const { user } = await createTestUser();
        const req = await createMockAuthRequest(user);
        const res = createMockResponse();

        await getMe(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(user.email);
        expect(res.body.data.tokens).toBe(user.tokens.toString());
        expect(res.body.data.chats).toHaveLength(0);
    });
    it('should return a 404 if the user is not found', async () => {
        const req = await createMockAuthRequest({ id: 'test-user-123' });
        const res = createMockResponse();

        await getMe(req, res);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('User not found');
    });
});

