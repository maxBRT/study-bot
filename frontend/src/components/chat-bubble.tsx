import { cn } from "@/lib/utils";
import "../markdown.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface ChatBubbleProps {
    role: "user" | "assistant";
    content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
    const isUser = role === "user";

    return (
        <div className={cn("flex w-full items-start gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="h-8 w-8 border">
                <AvatarImage src={isUser ? "https://avatars.laravel.cloud/user?vibe=stealth" : "https://avatars.laravel.cloud/agent?vibe=stealth"} />
                <AvatarFallback>{isUser ? "ME" : "AI"}</AvatarFallback>
            </Avatar>

            <div className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 text-sm shadow-sm markdown-container bg-muted text-foreground"
            )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </div>
    );
}
