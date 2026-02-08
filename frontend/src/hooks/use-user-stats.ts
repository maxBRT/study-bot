import { api, ApiError } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { UserStats } from "@/types/models/user";
import { useEffect, useState } from "react";

type UserStatsReturn = {
    userStats: UserStats | null;
    isLoading: boolean;
    error: Error | null;
}


export function useUserStats(): UserStatsReturn {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api<ApiResponse<UserStats>>("/me/stats");
                setUserStats(res.data);
                setLoading(false);
            } catch (err) {
                setError(err as ApiError);
                setLoading(false);
            }
        };
        fetchData();
    }, []); 

    return {
        userStats,
        isLoading,
        error,
    } as UserStatsReturn;
}