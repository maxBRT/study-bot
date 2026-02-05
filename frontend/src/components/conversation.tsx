import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./chat-bubble";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Message } from "@/types/models/message";
import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

type ConversationProps = {
    messages: Message[];
    addMessage: (message: Message) => void;
    updateLastMessage: (chunk: string) => void;
    chatId: string;
};

export function Conversation({ messages, addMessage, updateLastMessage, chatId }: ConversationProps) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [modelName, setModelName] = useState("gpt-3.5-turbo");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        if (!message.trim()) return;
        setIsSending(true);
        try {
            // Add the user's message to the chat
            addMessage({
                id: Date.now().toString(),
                content: message,
                sender: "user",
                modelName: modelName,
                chatId: chatId,
            } as Message);
            setMessage("");

            // Add the assistant's message to receive the stream
            addMessage({
                id: Date.now().toString(),
                content: "",
                sender: "assistant",
                modelName: modelName,
                chatId: chatId,
            } as Message);

            const stream = await api<ReadableStream>("/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    input: message,
                    modelName: modelName,
                    chatId: chatId,
                },
            })

            const reader = stream.getReader();
            const decoder = new TextDecoder();

            // Read the stream and update the last message
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                updateLastMessage(chunk);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 overflow-hidden">
                <div className="space-y-4 p-4">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} role={msg.sender === "user" ? "user" : "assistant"} content={msg.content} />
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
            <div className="shrink-0 border-t p-4">
                <Field orientation="horizontal">
                    <Select value={modelName} onValueChange={(value) => setModelName(value)}>
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue defaultValue="GPT-3.5 Turbo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Models</SelectLabel>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-5.2">GPT-5.2</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Type your message here..." />
                    <Button onClick={handleSend}>Send</Button>
                </Field>
            </div>
        </div >
    );
}

