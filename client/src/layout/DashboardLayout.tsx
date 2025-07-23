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

const DashboardLayout = () => {
    const [active, setActive] = useState("Home");
    const navigate = useNavigate();
    const { logout } = useAuth();
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.id;

    const [user, setUser] = useState<{ name?: string } | null>(null);
    const userRole = parsedUser?.role || localStorage.getItem("coachRole");

    const coachId = localStorage.getItem("coachId");

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
            const effectiveUserId = userRole === "Coach" ? coachId : userId;
            if (!effectiveUserId) return;

            try {
                const res = await axios.get(`http://localhost:5000/user/getUserById/${effectiveUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data?.userDetails || {});
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, [userRole, coachId, userId, token]);

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="flex items-center justify-between md:px-12 px-5 py-5 bg-white">
                <Link to="/dashboard">
                    <img src="/logo1.png" alt="Logo" className="h-10 w-auto" />
                </Link>
                <div className="relative w-full max-w-md mx-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 rounded-full text-sm border border-gray-200 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 cursor-pointer">
                    <img
                        src="/avatar.png"
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800 hidden md:block">
                        {user?.name || "Error Fetching Name..."}
                    </span>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-20 md:w-36 bg-white py-6 px-4 flex flex-col items-center md:items-start">
                    <nav className="flex flex-col gap-3 w-full justify-between  h-full">
                        <div>
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
                                        className={`p-3 rounded-xl ${active === 'Add Client'
                                            ? "bg-[#8FE289] text-green-500"
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

                <main className="flex-1 bg-[#F5F6FA] overflow-y-auto p-6 rounded-tl-[40px] flex items-center justify-center">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;