import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { Book, Settings, LogOut, Pen, Trash2 } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import type { Chat } from "@/types/models/chat";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

const navItems = [
    { title: "Profile", icon: Settings, url: "/profile" },
];



export function AppSidebar({ chats, setChats }: React.ComponentProps<typeof Sidebar> & { chats: Chat[] } & { setChats: (chats: Chat[]) => void }) {
    const navigate = useNavigate();

    const deleteChat = async (chatId: string) => {
        const res = await api<ApiResponse<null>>(`/chats/${chatId}`, {
            method: "DELETE"
        })
        if (res.success) {
            setChats(chats.filter((c: Chat) => {
                return c.id !== chatId;
            }))
            navigate('/dashboard')
        }
    }


    async function handleLogout() {
        await signOut();
        navigate("/login");
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Book className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Study Bot</span>
                                    <span className="text-xs text-muted-foreground">Dashboard</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Conversations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Button onClick={() => navigate("/dashboard")}>
                                        New Conversation <Pen className="size-4" />
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {chats.map((chat: Chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton asChild>
                                        <Link to={`/dashboard/${chat.id}`}>
                                            <p>{chat.title}</p>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuAction
                                        showOnHover
                                        className="text-destructive hover:text-destructive/80"
                                        onClick={() => { deleteChat(chat.id) }}
                                    >
                                        <Trash2 className="size-3.5" />
                                    </SidebarMenuAction>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    );
}
