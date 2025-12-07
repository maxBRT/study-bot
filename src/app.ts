import express, { type RequestHandler } from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { authMiddleware } from "./middlewares/auth";
import webhooksRouter from "./routes/webhooks";
import chatRouter from "./routes/chats";
import messagesRouter from "./routes/messages";
import tokenUsagesRouter from "./routes/tokenUsages";
import { getMe } from "./controllers/me";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Set up Better Auth
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

app.use("/webhooks", webhooksRouter);

// Authenticated routes
app.use(authMiddleware);
app.use("/chats", chatRouter);
app.use("/messages", messagesRouter);
app.use("/me", getMe as RequestHandler);
app.use("/token-usages", tokenUsagesRouter);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});