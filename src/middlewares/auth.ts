import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (!result?.session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = result.user;
    req.session = result.session;

    next();
}