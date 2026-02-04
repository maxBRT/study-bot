import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { sendEmail } from "./resend";
import type { CreateEmailOptions } from "resend";


// Better Auth configuration
export const auth = betterAuth({
    // Base URL for the API
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    // Social login
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    // Secret key for the API
    secret: process.env.BETTER_AUTH_SECRET,

    // Trusted origins for CORS
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:4321"],

    // Database configuration (prisma)
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    // Enable email and password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: process.env.VERIFY_EMAIL === "true",
    },

    // Email verification configuration
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {

            // Just pass a callback that sends an email and better-auth will handle the rest
            await sendEmail({
                to: process.env.RESEND_EMAIL,
                subject: 'Verify your email address',
                text: `Click the link to verify your email: ${url}`,
                html: `
                    <div>
                        <h2>Verify Your Email</h2>
                        <p>Please click the button below to verify your email address:</p>
                        <a href="${url}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email
                        </a>
                        <p>Or copy and paste this link: ${url}</p>
                        <p>This link will expire in 1 hour.</p>
                    </div>
                `,
            } as CreateEmailOptions);
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
});



