import { serve } from "bun";
import index from "./index.html";

const API_URL = Bun.env.API_URL || "http://localhost:3000";

const server = serve({
    hostname: "0.0.0.0",
    port: 4321,
    routes: {
        // Proxy API requests to backend
        "/api/*": async (req) => {
            const url = new URL(req.url);
            const backendUrl = `${API_URL}${url.pathname}${url.search}`;
            return fetch(backendUrl, {
                method: req.method,
                headers: req.headers,
                body: req.body,
            });
        },
        "/health": async (req) => {
            return new Response("OK");
        },
        // Serve index.html for all unmatched routes
        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
