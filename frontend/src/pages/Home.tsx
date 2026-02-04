import { Link } from "react-router-dom";
import { useSession } from "../lib/auth";

export function Home() {
    const { data: session, isPending } = useSession();

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the app</p>
            {isPending ? (
                <p>Loading...</p>
            ) : session ? (
                <Link to="/dashboard">Go to Dashboard</Link>
            ) : (
                <div>
                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                </div>
            )}
        </div>
    );
}
