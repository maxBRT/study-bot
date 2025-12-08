#!/bin/bash

# --- Configuration ---
HOST="http://localhost:3000"
COOKIE_FILE="/tmp/chat-session-cookies.txt"
LOGIN_ENDPOINT="/api/auth/sign-in/email"
CHAT_ENDPOINT="/messages"

# --- Step 1: Authentication ---
echo "Connecting to $HOST..."

# Login and save cookies
LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -X POST "$HOST$LOGIN_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"secret_password"}')

if [ $? -eq 0 ]; then
    echo "------------------------------------------------"
    echo "Type your message and press ENTER. Type 'exit' to quit."
else
    echo "Login failed. Please check your credentials."
    exit 1
fi

# --- Step 2: Interactive Chat Loop ---
while true; do
    # 1. Prompt for User Input
    read -p "You: " USER_MESSAGE

    # 2. Check for exit condition
    if [[ "$USER_MESSAGE" == "exit" ]]; then
        echo "Goodbye!"
        rm -f "$COOKIE_FILE"
        break
    fi

    # 3. Send Message & Stream Response
    echo -n "Bot: "
    curl -N -b "$COOKIE_FILE" -X POST "$HOST$CHAT_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d "{\"input\":\"$USER_MESSAGE\",\"modelName\":\"gpt-4.1-nano\",\"chatId\":\"cmiwdujta000lhdsb8nhbras1\"}"

    # Print a newline after the stream finishes for formatting
    echo ""
    echo "------------------------------------------------"
done
