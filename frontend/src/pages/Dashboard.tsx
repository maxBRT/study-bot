import { useNavigate } from "react-router-dom";
import { useSession, signOut } from "../lib/auth";

export function Dashboard() {
    const { data: session } = useSession();
    const navigate = useNavigate();

    async function handleLogout() {
        await signOut();
        navigate("/login");
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
