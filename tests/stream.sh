#!/bin/bash

# Configuration 
HOST="http://localhost:3000"
COOKIE_FILE="/tmp/chat-session-cookies.txt"
LOGIN_ENDPOINT="/api/auth/sign-in/email"
CHAT_ENDPOINT="/messages"
CHAT_ID="cmj2vgamc00040esbkh08omwc"

echo "Connecting to $HOST..."

# Login and save cookies
LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -X POST "$HOST$LOGIN_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@email.com","password":"secret_password"}')

if [ $? -eq 0 ]; then
    echo "------------------------------------------------"
    echo "Type your message and press ENTER. Type 'exit' to quit."
else
    echo "Login failed. Please check your credentials."
    exit 1
fi

# Chat Loop 
while true; do
    read -p "You: " USER_MESSAGE

    if [[ "$USER_MESSAGE" == "exit" ]]; then
        echo "Goodbye!"
        rm -f "$COOKIE_FILE"
        break
    fi

    # Send Message & Stream Response
    echo -n "Bot: "
    curl -N -b "$COOKIE_FILE" -X POST "$HOST$CHAT_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d "{\"input\":\"$USER_MESSAGE\",\"modelName\":\"gpt-4.1-nano\",\"chatId\":\"$CHAT_ID\"}"

    echo ""
    echo "------------------------------------------------"
done
