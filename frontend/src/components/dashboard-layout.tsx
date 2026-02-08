import { Outlet } from "react-router-dom";
import { useUserChats } from "@/hooks/use-user-chats";
import { useMe } from "@/hooks/use-me";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Chat } from "@/types/models/chat";
import type { User } from "@/types/models/user";
import { SidebarLayout } from "./sidebar-layout";

export type DashboardOutletContext = {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    user: User | null;
    refetchUser: () => void;
};

export function DashboardLayout() {
    const { chats, setChats } = useUserChats();
    const { user, error: userError, refetch: refetchUser } = useMe();

    const handlePurchaseToken = async () => {
        try {
            const res = await api<ApiResponse<null>>("/webhooks/stripe", {
                method: "POST",
                body: {
                    metadata: {
                        userId: user?.id,
                        tokenAmount: 100,
                    },
                },
            });
            if (res.success) {
                refetchUser();
            }
        } catch (err) {
            console.error("Token purchase failed:", err);
        }
    };

    return (
        <SidebarLayout
            chats={chats}
            setChats={setChats}
            user={user}
            error={userError}
            onPurchaseToken={handlePurchaseToken}
        >
            <Outlet context={{ chats, setChats, user, refetchUser } as DashboardOutletContext} />
        </SidebarLayout>
    );
}
