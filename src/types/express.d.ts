import type { Session } from "better-auth";
import type { User } from "@prisma/client";
import type { Request } from "express";

// Allow me to add user and session to the request object
// in the middlewares
declare global {
    namespace Express {
        interface Request {
            user?: User;
            session?: Session;
        }
    }
}

// Enforce that the request object has user and session properties
// in the controllers
export interface AuthenticatedRequest extends Request {
    user: User;
    session: Session;
}
