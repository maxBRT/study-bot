import express from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
// Add middlewares
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});