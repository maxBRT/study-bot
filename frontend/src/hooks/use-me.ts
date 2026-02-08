import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/models/user";
import { useEffect, useState } from "react";

type UseMeReturn =
    ({ user: User, error: null } | { user: null, error: Error }) & { refetch: () => void }


export function useMe(): UseMeReturn {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const { data: session } = useSession();

    const fetchMe = async () => {
        try {
            const res = await api<ApiResponse<User>>("/me")
            const user = res.data
            setUser(user)
            setError(null)
        } catch (err) {
            setError(err as ApiError)
        }
    }

    useEffect(() => {
        fetchMe()
    }, [session])

    return { user, error, refetch: fetchMe } as UseMeReturn;
}
