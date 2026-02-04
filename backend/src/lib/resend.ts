import { Resend, type CreateEmailOptions } from 'resend';
import { type Request, type Response } from "express";

// Create a new Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: CreateEmailOptions) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            ...options,
        });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        return;
    }
}


// Temporary page for email verification
export const redirectToEmailVerificationPage = (req: Request, res: Response) => {
    res.send("<h1>Email verified successfully!</h1><p>You can close this window and log in.</p>");
}
