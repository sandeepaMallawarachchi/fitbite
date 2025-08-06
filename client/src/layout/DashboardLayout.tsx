"use client";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    ChartPie,
    File,
    User,
    Settings,
    Search,
    LogOut,
    Users,
    PlusSquare
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

interface UserData {
    name?: string;
    picture?: string;
}

const DashboardLayout = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();
    const token = localStorage.getItem("token");
    const userDetails = localStorage.getItem("user");
    const parsedUser = userDetails ? JSON.parse(userDetails) : null;
    const userId = parsedUser?.id;

    const [user, setUser] = useState<UserData | null>(null);
    const userRole = parsedUser?.role || localStorage.getItem("coachRole");

    const coachId = localStorage.getItem("coachId");
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const navItems: NavItem[] = userRole === "Coach"
        ? [
            {
                label: "Home",
                icon: <Home className="w-5 h-5" />,
                path: "/dashboard",
            },
            {
                label: "Clients",
                icon: <Users className="w-5 h-5" />,
                path: "/dashboard/clients",
            },
            {
                label: "Settings",
                icon: <Settings className="w-5 h-5" />,
                path: "/dashboard/settings",
            },
        ]
        : [
            {
                label: "Home",
                icon: <Home className="w-5 h-5" />,
                path: "/dashboard",
            },
            {
                label: "Meal Plan",
                icon: <ChartPie className="w-5 h-5" />,
                path: "/dashboard/meal-plan",
            },
            {
                label: "Progress",
                icon: <File className="w-5 h-5" />,
                path: "/dashboard/progress",
            },
            {
                label: "Profile",
                icon: <User className="w-5 h-5" />,
                path: "/dashboard/profile",
            },
            {
                label: "Settings",
                icon: <Settings className="w-5 h-5" />,
                path: "/dashboard/settings",
            },
        ];

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            const effectiveUserId = userRole === "Coach" ? coachId : userId;
            if (!effectiveUserId) return;

            try {
                const res = await axios.get(`https://fitbite-roan.vercel.app/user/getUserById/${effectiveUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data?.userDetails || {});
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchUser();
    }, [userRole, coachId, userId, token]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <header className="flex items-center justify-between md:px-12 px-5 py-5 bg-white">
                    <Link to="/dashboard">
                        <img src="/logo1.webp" alt="Logo" className="h-10 w-auto" />
                    </Link>
                    <div className="hidden md:relative w-full max-w-md mx-6">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full py-2 pl-10 pr-4 rounded-full text-sm border border-gray-200 focus:outline-none"
                            disabled
                        />
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="hidden md:block w-24 h-4 rounded-md bg-gray-200" />
                    </div>
                </header>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="flex items-center justify-between md:px-12 px-5 py-5 bg-white">
                <Link to="/dashboard">
                    <img src="/logo1.webp" alt="Logo" className="h-10 w-auto" />
                </Link>
                <div className="hidden md:relative w-full max-w-md mx-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 rounded-full text-sm border border-gray-200 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 cursor-pointer">
                    <img
                        src={user?.picture || "/avatar.webp"}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800 hidden md:block">
                        {user?.name || "Error Fetching Name..."}
                    </span>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-20 md:w-36 bg-white py-6 px-4 flex flex-col items-center md:items-start">
                    <nav className="flex flex-col gap-3 w-full justify-between  h-full">
                        <div>
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        navigate(item.path);
                                    }}
                                    className="flex flex-col items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition cursor-pointer"
                                >
                                    <div
                                        className={`p-3 rounded-xl ${location.pathname === item.path
                                            ? "bg-[#8FE289] text-white"
                                            : "bg-[#F0F1F8] text-gray-500 hover:bg-gray-300"
                                            }`}
                                    >
                                        {item.icon}
                                    </div>
                                    <span className="hidden md:inline text-black mb-2">{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div>
                            {userRole === "Coach" && (
                                <Link
                                    to={'/dashboard/client-signup'}
                                    className="bottom-0 flex flex-col items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition cursor-pointer"
                                >
                                    <div
                                        className={`p-3 rounded-xl text-[#8FE289] ${location.pathname === '/dashboard/client-signup'
                                            ? "bg-[#8FE289] text-white"
                                            : "bg-[#F0F1F8] text-[#8FE289] hover:bg-gray-300"
                                            }`}                            >
                                        <PlusSquare className="w-5 h-5" />
                                    </div>
                                    <span className="hidden md:inline text-black mb-2">Add Client</span>
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="bottom-0 flex flex-col items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition cursor-pointer"
                            >
                                <div
                                    className='p-3 rounded-xl bg-[#F0F1F8] text-black hover:bg-red-300'
                                >
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="hidden md:inline text-black">Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 bg-[#F5F6FA] overflow-y-auto md:p-6 rounded-tl-[40px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;