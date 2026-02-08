import { Spinner } from "@/components/ui/spinner";
import { useUserStats } from "@/hooks/use-user-stats";
import { useSession } from "@/lib/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Coins, MessagesSquare, TrendingUp } from "lucide-react";

function StatCard({ title, value, description, icon: Icon }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export function Profile() {
    const { data: session } = useSession();
    const { userStats, loading, error } = useUserStats();

    return (
        <div className="flex flex-col h-full overflow-auto">
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">Welcome back, {session?.user.name}</p>
                </div>

                {loading ? (
                    <Spinner />
                ) : error ? (
                    <p className="text-destructive">Error: {error.message}</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Tokens"
                            value={userStats?.totalTokens ?? 0}
                            description={`${userStats?.thisMonthTokens ?? 0} this month`}
                            icon={Coins}
                        />
                        <StatCard
                            title="Total Chats"
                            value={userStats?.totalChats ?? 0}
                            description={`${userStats?.avgTokensPerChat ?? 0} avg tokens/chat`}
                            icon={MessagesSquare}
                        />
                        <StatCard
                            title="Total Messages"
                            value={userStats?.totalMessages ?? 0}
                            description={`${userStats?.avgMessagesPerChat ?? 0} avg messages/chat`}
                            icon={MessageSquare}
                        />
                        <StatCard
                            title="Avg Tokens/Message"
                            value={userStats?.avgTokensPerMessage ?? 0}
                            description="Across all conversations"
                            icon={TrendingUp}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
