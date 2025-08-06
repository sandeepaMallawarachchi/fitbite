import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EllipsisVertical, Filter, X } from "lucide-react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import type { Client } from "../types/User";

interface ExtendedClient extends Client {
    clientId?: number;
    age?: string;
    tdee?: string;
    gender?: string;
    weight?: string;
    height?: string;
    activityLevel?: string;
    goal?: string;
}

const ClientsDetailsTable = () => {
    const [clients, setClients] = useState<ExtendedClient[]>([]);
    const [filteredClients, setFilteredClients] = useState<ExtendedClient[] | null>(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {

            setLoading(true)
            try {
                const res = await axios.get(`https://fitbite-roan.vercel.app/user/full-details`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const allUsers = res.data.userDetails || [];

                const enrichedClients = allUsers
                    .filter((entry: any) => entry.userDetails?.role === "User")
                    .map((entry: any, index: number) => {
                        const user = entry.userDetails || {};
                        const fitness = entry.fitnessDetails || {};

                        return {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            status: user.status,
                            role: user.role,
                            createdAt: user.createdAt,
                            avatar: user.picture,
                            clientId: index + 1,
                            age: user.birthday
                                ? `${Math.floor(
                                    (Date.now() - new Date(user.birthday).getTime()) /
                                    (1000 * 60 * 60 * 24 * 365.25)
                                )}`
                                : "--",
                            tdee: fitness.TDEE || "--",
                            gender: user.gender || "--",
                            weight: user.weight || "--",
                            height: user.height || "--",
                            activityLevel: user.activityLevel || "--",
                            goal: fitness.fitnessGoal?.primaryGoal || "--",
                        };
                    });

                setClients(enrichedClients);
                setFilteredClients(enrichedClients);
            } catch (err) {
                console.error("Error fetching unified client details", err);
            } finally {
                setLoading(false)
            }
        };

        fetchClients();
    }, []);

    const handleFilter = (type: "all" | "active" | "inactive") => {
        if (type === "all") setFilteredClients(clients);
        else {
            const filtered = clients.filter((c) =>
                type === "active" ? c.status === "Active" : c.status === "Inactive"
            );
            setFilteredClients(filtered);
        }
    };

    const handleNavigate = (client: ExtendedClient) => {
        navigate(`/dashboard/smart-assistant?userId=${client._id}&userName=${encodeURIComponent(client.name)}`);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6 flex-1 animate-pulse">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                </div>

                <div className="overflow-x-auto bg-white">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-[#F4F6FF] text-gray-700">
                            <tr>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <th key={i} className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-full" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 6 }).map((_, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-[#E6E8ED]">
                                    <td className="py-4 text-center">
                                        <div className="w-4 h-4 mx-auto bg-gray-200 rounded-full" />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                            <div className="h-4 w-24 bg-gray-200 rounded" />
                                        </div>
                                    </td>
                                    {Array.from({ length: 10 }).map((_, colIdx) => (
                                        <td key={colIdx} className="p-3">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 flex-1">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold">Clients Details</h2>
                <Filter
                    className="w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={() => setShowFilter((prev) => !prev)}
                />
            </div>

            {/* Filter Modal */}
            <AnimatePresence>
                {showFilter && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-28 sm:right-8 right-4 z-50 w-56 bg-white rounded-xl shadow-xl p-4 border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">Filter Options</h3>
                            <button onClick={() => setShowFilter(false)}>
                                <X className="w-4 h-4 text-gray-500 hover:scale-125 cursor-pointer" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleFilter("all")} className="cursor-pointer text-sm text-left hover:bg-gray-100 px-2 py-1 rounded-md">
                                All
                            </button>
                            <button onClick={() => handleFilter("active")} className="cursor-pointer text-sm text-left hover:bg-gray-100 px-2 py-1 rounded-md">
                                Active
                            </button>
                            <button onClick={() => handleFilter("inactive")} className="cursor-pointer text-sm text-left hover:bg-gray-100 px-2 py-1 rounded-md">
                                Inactive
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="overflow-x-auto bg-white scroll-container">
                <Reorder.Group axis="y" values={filteredClients || []} onReorder={setFilteredClients}>
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-[#F4F6FF] text-gray-700">
                            <tr>
                                <th className="py-3"></th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Phone Number</th>
                                <th className="p-3">Client ID</th>
                                <th className="p-3">User Status</th>
                                <th className="p-3">Age</th>
                                <th className="p-3">TDEE (kcal)</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3">Weight (kg)</th>
                                <th className="p-3">Height (cm)</th>
                                <th className="p-3">Activity Level</th>
                                <th className="p-3">Goal</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {(filteredClients || []).map((client) => (
                                <Reorder.Item
                                    key={client._id}
                                    value={client}
                                    as="tr"
                                    className="border-[#E6E8ED] border-b cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => handleNavigate(client)}
                                >
                                    <td className="py-3">
                                        <EllipsisVertical className="text-gray-400 hover:text-gray-600 active:cursor-grabbing" />
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        <img
                                            src={client.avatar || "/avatar.webp"}
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        {client.name}
                                    </td>
                                    <td className="p-3">{client.phone}</td>
                                    <td className="p-3">{client.clientId}</td>
                                    <td className="p-3">
                                        <span
                                            className={`block w-full text-center py-2 text-sm rounded-lg text-black ${client.status === "Active"
                                                ? "bg-[#89E2AD]"
                                                : "bg-[#D9D9D9]"
                                                }`}
                                        >
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{client.age}</td>
                                    <td className="p-3 font-semibold">
                                        {client.tdee !== "--" ? `${client.tdee}` : "--"}
                                    </td>
                                    <td className="p-3">{client.gender}</td>
                                    <td className="p-3">{client.weight}</td>
                                    <td className="p-3">{client.height}</td>
                                    <td className="p-3">{client.activityLevel}</td>
                                    <td className="p-3 font-semibold">{client.goal}</td>
                                </Reorder.Item>
                            ))}
                        </tbody>
                    </table>
                </Reorder.Group>
            </div>
        </div>
    );
};

export default ClientsDetailsTable;
