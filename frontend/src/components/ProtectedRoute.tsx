import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../lib/auth";

export function ProtectedRoute() {
    const { data: session, isPending } = useSession();
    const location = useLocation();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
