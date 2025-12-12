import express from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { authMiddleware } from "./middlewares/auth";
import webhooksRouter from "./routes/webhooks";
import chatRouter from "./routes/chats";
import messagesRouter from "./routes/messages";
import tokenUsagesRouter from "./routes/tokenUsages";
import meRouter from "./routes/me";
import { redirectToEmailVerificationPage } from "./lib/resend";
import redoc from 'redoc-express';
import openApiDocument from "../docs/openapi"

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Redoc setup
app.get('/docs/openapi.json', (req, res) => {
    res.json(openApiDocument);
});

app.get(
    '/docs',
    redoc({
        title: 'My API Docs',
        specUrl: '/docs/openapi.json' // Must match the route above
    })
);

// Set up Better Auth
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

// Root route for email verification redirect
// This will be removed once the FE is ready
app.get("/", redirectToEmailVerificationPage);

app.use("/webhooks", webhooksRouter);

// Authenticated routes
app.use(authMiddleware);
app.use("/me", meRouter);
app.use("/chats", chatRouter);
app.use("/messages", messagesRouter);
app.use("/token-usages", tokenUsagesRouter);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");

});
