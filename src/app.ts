import express from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { authMiddleware } from "./middlewares/auth";
import chatRouter from "./routes/chats";
import messagesRouter from "./routes/messages";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Set up Better Auth
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());


// Authenticated routes
app.use(authMiddleware);
app.use("/chats", chatRouter);
app.use("/messages", messagesRouter);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});