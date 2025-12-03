import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Add json middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});