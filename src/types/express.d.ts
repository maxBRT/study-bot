import type { Session } from "better-auth";
import type { User } from "@prisma/client";
import type { Request } from "express";

// Ajoute les champs user et session sur les Requests
declare global {
    namespace Express {
        interface Request {
            user?: User;
            session?: Session;
        }
    }
}

// Interface pour type safety dans les routes authentifier
export interface AuthenticatedRequest extends Request {
    user: User;
    session: Session;
}
