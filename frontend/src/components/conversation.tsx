import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./chat-bubble";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Message } from "@/types/models/message";

type ConversationProps = {
    messages: Message[];
    addMessage: (message: Message) => void;
    updateLastMessage: (chunk: string) => void;
};

export function Conversation({ messages, addMessage, updateLastMessage }: ConversationProps) {
    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} role={msg.sender === "user" ? "user" : "assistant"} content={msg.content} />
                    ))}
                </div>
            </ScrollArea>
            <div className="shrink-0 border-t p-4">
                <Field orientation="horizontal">
                    <Input type="text" placeholder="Type your message here..." />
                    <Button>Send</Button>
                </Field>
            </div>
        </div>
    );
}

