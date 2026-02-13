import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./pages/Profile";
import { DashboardLayout } from "./components/dashboard-layout";
import { ThemeProvider } from "./components/theme-provider";

export function App() {
    return (
        <ThemeProvider>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes with shared sidebar layout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard/:id?" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
