import {
    OpenAPIV3
} from "openapi-types";

const openapi: OpenAPIV3.Document = {
    "openapi": "3.0.0",
    "info": {
        "title": "Study Bot API",
        "version": "1.0.0",
        "description": "API for the Study Bot application with session-based authentication"
    },
    "servers": [
        {
            "url": "http://localhost:3000",
            "description": "Development server"
        }
    ],
    "components": {
        "securitySchemes": {
            "sessionAuth": {
                "type": "apiKey",
                "in": "cookie",
                "name": "better-auth.session_token",
                "description": "Session authentication using Better Auth cookies. Users must authenticate via Better Auth endpoints and will receive a session cookie."
            }
        },
        "schemas": {
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "tokens": {
                        "type": "string",
                        "description": "User's token balance as string (BigInt)"
                    },
                    "chats": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Chat"
                        }
                    }
                }
            },
            "Chat": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "userId": {
                        "type": "string"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "messages": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Message"
                        }
                    }
                }
            },
            "Message": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "content": {
                        "type": "string"
                    },
                    "sender": {
                        "type": "string",
                        "enum": [
                            "user",
                            "agent"
                        ]
                    },
                    "modelName": {
                        "type": "string"
                    },
                    "chatId": {
                        "type": "string"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "TokenUsage": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "userId": {
                        "type": "string"
                    },
                    "messageId": {
                        "type": "string",
                        "nullable": true
                    },
                    "tokenIn": {
                        "type": "string",
                        "description": "Tokens in as string (BigInt)"
                    },
                    "tokenOut": {
                        "type": "string",
                        "description": "Tokens out as string (BigInt)"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    }
                }
            },
            "UserStats": {
                "type": "object",
                "properties": {
                    "totalTokens": {
                        "type": "number"
                    },
                    "thisMonthTokens": {
                        "type": "number"
                    },
                    "totalMessages": {
                        "type": "number"
                    },
                    "totalChats": {
                        "type": "number"
                    },
                    "avgTokensPerChat": {
                        "type": "number"
                    },
                    "avgMessagesPerChat": {
                        "type": "number"
                    },
                    "avgTokensPerMessage": {
                        "type": "number"
                    }
                }
            },
            "SuccessResponse": {
                "type": "object",
                "required": ["success", "message", "data"],
                "properties": {
                    "success": {
                        "type": "boolean",
                        "example": true
                    },
                    "message": {
                        "type": "string"
                    },
                    "data": {
                        "type": "object",
                        "nullable": true
                    }
                }
            },
            "ErrorResponse": {
                "type": "object",
                "required": ["success", "message", "data"],
                "properties": {
                    "success": {
                        "type": "boolean",
                        "example": false
                    },
                    "message": {
                        "type": "string"
                    },
                    "data": {
                        "type": "object",
                        "nullable": true,
                        "example": null
                    }
                }
            }
        }
    },
    "security": [
        {
            "sessionAuth": []
        }
    ],
    "paths": {
        "/me": {
            "get": {
                "summary": "Get current user",
                "description": "Retrieves the authenticated user's profile data including their chats",
                "tags": [
                    "User"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User data retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "User retrieved successfully"
                                        },
                                        "data": {
                                            "$ref": "#/components/schemas/User"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/me/stats": {
            "get": {
                "summary": "Get user statistics",
                "description": "Retrieves comprehensive statistics about the user's usage including tokens, messages, and chats",
                "tags": [
                    "User"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User statistics retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Stats retrieved successfully"
                                        },
                                        "data": {
                                            "$ref": "#/components/schemas/UserStats"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/chats": {
            "get": {
                "summary": "Get user's chats",
                "description": "Retrieves all chats for the authenticated user, including their messages",
                "tags": [
                    "Chats"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Chats retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Chats retrieved successfully"
                                        },
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Chat"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "summary": "Create a new chat",
                "description": "Creates a new chat for the authenticated user",
                "tags": [
                    "Chats"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "title"
                                ],
                                "properties": {
                                    "title": {
                                        "type": "string",
                                        "example": "My Study Session"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Chat created successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Chat created successfully"
                                        },
                                        "data": {
                                            "$ref": "#/components/schemas/Chat"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Missing parameters",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/chats/{id}": {
            "get": {
                "summary": "Get a chat by ID",
                "description": "Retrieves a specific chat with all its messages",
                "tags": [
                    "Chats"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        },
                        "description": "Chat ID"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Chat found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Chat found"
                                        },
                                        "data": {
                                            "$ref": "#/components/schemas/Chat"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "ID is required",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Chat not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "summary": "Update a chat",
                "description": "Updates the title of a specific chat",
                "tags": [
                    "Chats"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        },
                        "description": "Chat ID"
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "title"
                                ],
                                "properties": {
                                    "title": {
                                        "type": "string",
                                        "example": "Updated Chat Title"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Chat updated successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Chat updated successfully"
                                        },
                                        "data": {
                                            "$ref": "#/components/schemas/Chat"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Missing parameters or Chat ID",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Chat not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },
            "delete": {
                "summary": "Delete a chat",
                "description": "Deletes a specific chat",
                "tags": [
                    "Chats"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        },
                        "description": "Chat ID"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Chat deleted successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Chat deleted successfully"
                                        },
                                        "data": {
                                            "type": "object",
                                            "nullable": true,
                                            "example": null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "ID is required",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Chat not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/messages": {
            "post": {
                "summary": "Send a message",
                "description": "Sends a message to a chat and streams the AI response back. The response is sent as a text/event-stream.",
                "tags": [
                    "Messages"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "input",
                                    "chatId",
                                    "modelName"
                                ],
                                "properties": {
                                    "input": {
                                        "type": "string",
                                        "example": "What is the capital of France?"
                                    },
                                    "chatId": {
                                        "type": "string",
                                        "example": "chat-123"
                                    },
                                    "modelName": {
                                        "type": "string",
                                        "example": "gpt-4"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Message sent and response streamed",
                        "content": {
                            "text/event-stream": {
                                "schema": {
                                    "type": "string",
                                    "description": "Streamed text response from the AI"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Missing fields in request body",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error or OpenAI API error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/token-usages": {
            "get": {
                "summary": "List token usages",
                "description": "Retrieves all token usages for the authenticated user, ordered by creation date (newest first)",
                "tags": [
                    "Token Usage"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Token usages retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Token usages retrieved successfully"
                                        },
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/TokenUsage"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/token-usages/{id}": {
            "get": {
                "summary": "Get token usage by ID",
                "description": "Retrieves a specific token usage record by its ID",
                "tags": [
                    "Token Usage"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string"
                        },
                        "description": "Token usage ID"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Token usage retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Token usage retrieved successfully"
                                        },
                                        "data": {
                                            "$ref": "#/components/schemas/TokenUsage"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Token usage not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/webhooks/stripe": {
            "post": {
                "summary": "Mock Stripe payment webhook",
                "description": "Processes mock Stripe payment to add tokens to user account",
                "tags": [
                    "Webhooks"
                ],
                "security": [
                    {
                        "sessionAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "metadata"
                                ],
                                "properties": {
                                    "metadata": {
                                        "type": "object",
                                        "required": [
                                            "userId",
                                            "tokenAmount"
                                        ],
                                        "properties": {
                                            "userId": {
                                                "type": "string",
                                                "example": "user-123"
                                            },
                                            "tokenAmount": {
                                                "type": "number",
                                                "example": 1000
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Payment processed successfully or received with errors",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["success", "message", "data"],
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Payment processed successfully"
                                        },
                                        "data": {
                                            "type": "object",
                                            "nullable": true,
                                            "example": null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing session",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "tags": [
        {
            "name": "User",
            "description": "User profile and statistics endpoints"
        },
        {
            "name": "Chats",
            "description": "Chat management endpoints"
        },
        {
            "name": "Messages",
            "description": "Message sending and streaming endpoints"
        },
        {
            "name": "Token Usage",
            "description": "Token usage tracking endpoints"
        },
        {
            "name": "Webhooks",
            "description": "Webhook endpoints for external integrations"
        }
    ]
}

export default openapi;
