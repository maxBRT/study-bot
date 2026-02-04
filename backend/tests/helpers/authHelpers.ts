import { auth } from '../../src/lib/auth';
import type { User } from '../../src/generated/prisma/client';
import prisma from '../../src/lib/prisma';


// Create a test user and return the user with auth session
export async function createTestUser(): Promise<{ user: User; sessionToken: string }> {
    const randomId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const email = `test-${randomId}@example.com`;
    const password = 'TestPassword123!';
    const name = 'Test User';

    // Sign up using Better Auth
    const signUpResult = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
        },
    });
    console.log(signUpResult);
    if (!signUpResult || !signUpResult.user || !signUpResult.token) {
        throw new Error('Failed to create test user');
    }

    // Get the updated user
    const user = await prisma.user.findUnique({
        where: { id: signUpResult.user.id },
    });

    if (!user) {
        throw new Error('User not found after creation');
    }

    return {
        user,
        sessionToken: signUpResult.token,
    };
}

// Create authorization headers for authenticated requests
export function generateAuthHeaders(sessionToken: string): Record<string, string> {
    return {
        cookie: `better-auth.session_token=${sessionToken}`,
    };
}


