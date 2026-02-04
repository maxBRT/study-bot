import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../src/types/express';
import type { User } from '../../src/generated/prisma/client';
import prisma from '../../src/lib/prisma';

// Create a mock request for unit testing
export function createMockRequest(options: {
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    method?: string;
    url?: string;
} = {}): Request {
    return {
        body: options.body || {},
        params: options.params || {},
        query: options.query || {},
        headers: options.headers || {},
        method: options.method || 'GET',
        url: options.url || '/',
        get: (name: string) => {
            const headers = options.headers || {};
            return headers[name.toLowerCase()];
        },
    } as Request;
}

// Create a mock authenticated request for unit testing
export async function createMockAuthRequest(
    user: Partial<User>,
    options: {
        body?: any;
        params?: any;
        query?: any;
        headers?: any;
    } = {}
): Promise<AuthenticatedRequest> {
    const mockUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified ?? false,
        image: user.image || null,
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date(),
        tokens: user.tokens ?? 1000n,
        tokenRefreshAt: user.tokenRefreshAt || new Date(),
    } as User;

    const mockSession = await prisma.session.findFirst({
        where: { userId: mockUser.id },
    });

    return {
        user: mockUser,
        session: mockSession,
        body: options.body || {},
        params: options.params || {},
        query: options.query || {},
        headers: options.headers || {},
        get: (name: string) => {
            const headers = options.headers || {};
            return headers[name.toLowerCase()];
        },
    } as AuthenticatedRequest;
}



// Mock Response type with body property for testing
export interface MockResponse extends Response {
    statusCode: number;
    body: any;
    headers: Record<string, string>;
}


// Mock Express response for unit testing
export function createMockResponse(): MockResponse {
    const res: any = {
        statusCode: 200,
        headers: {} as Record<string, string>,
        body: null,
    };

    res.status = (code: number) => {
        res.statusCode = code;
        return res;
    };

    res.json = (data: any) => {
        res.body = data;
        return res;
    };

    res.send = (data: any) => {
        res.body = data;
        return res;
    };

    res.setHeader = (name: string, value: string) => {
        res.headers[name] = value;
        return res;
    };

    res.write = (chunk: any) => {
        if (!res.body) res.body = '';
        res.body += chunk;
        return true;
    };

    res.end = () => {
        return res;
    };

    return res as MockResponse;
}
