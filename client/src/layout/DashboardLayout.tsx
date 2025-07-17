"use client";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    Home,
    ChartPie,
    File,
    User,
    Settings,
    Search,
} from "lucide-react";
import axios from "axios";
import UserDropdown from "../components/UserDropdown";

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItem[] = [
    { label: "Home", icon: <Home className="w-5 h-5" />, path: "/dashboard" },
    { label: "Meal Plan", icon: <ChartPie className="w-5 h-5" />, path: "/dashboard/meal-plan" },
    { label: "Progress", icon: <File className="w-5 h-5" />, path: "/dashboard/progress" },
    { label: "Profile", icon: <User className="w-5 h-5" />, path: "/dashboard/profile" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/dashboard/settings" },
];

const DashboardLayout = () => {
    const [active, setActive] = useState("Home");
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.id;

    const [user, setUser] = useState<{ name?: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:5000/user/getUserById/${userId}`);
            setUser(res.data?.userDetails || {});
        }

        fetchUser();
    }, [userId]);

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="flex items-center justify-between md:px-12 px-5 py-5 bg-white">
                <Link to="/dashboard">
                    <img src="/logo1.png" alt="Logo" className="w-36" />
                </Link>
                <div className="relative w-full max-w-md mx-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 rounded-full text-sm border border-gray-200 focus:outline-none"
                    />
                </div>
                <UserDropdown name={user?.name} />
            </header>

            <div className="flex flex-1">
                <aside className="w-20 md:w-36 bg-white py-6 px-4 flex flex-col items-center md:items-start">
                    <nav className="flex flex-col gap-3 w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    setActive(item.label);
                                    navigate(item.path);
                                }}
                                className="flex flex-col items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition cursor-pointer"
                            >
                                <div
                                    className={`p-3 rounded-xl ${active === item.label
                                        ? "bg-[#8FE289] text-white"
                                        : "bg-[#F0F1F8] text-gray-500 hover:bg-gray-300"
                                        }`}
                                >
                                    {item.icon}
                                </div>
                                <span className="hidden md:inline text-black">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 bg-[#F5F6FA] overflow-y-auto p-6 rounded-tl-[40px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;