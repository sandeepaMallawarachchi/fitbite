import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EllipsisVertical, Filter, X } from "lucide-react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import type { Client } from "../types/User";
import type { FormData } from "../types/FormData";

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


    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get("http://localhost:5000/user/getAllUsers", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const users = res.data.userDetails.filter((u: any) => u.role === "User");

                const enrichedClients = await Promise.all(
                    users.map(async (user: any, index: number) => {
                        let formData: FormData | null = null;
                        try {
                            const formRes = await axios.get(`http://localhost:5000/form/${user._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            formData = formRes.data;
                        } catch (err) {
                            console.warn("Form not found for user:", user._id);
                        }

                        return {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            status: user.status,
                            role: user.role,
                            createdAt: user.createdAt,
                            avatar: "/avatar.png",
                            clientId: index + 1,
                            age: formData?.birthday
                                ? `${Math.floor(
                                    (Date.now() - new Date(formData.birthday).getTime()) /
                                    (1000 * 60 * 60 * 24 * 365.25)
                                )}`
                                : "--",
                            tdee: formData?.TDEE || "--",
                            gender: formData?.gender || "--",
                            weight: formData?.weight || "--",
                            height: formData?.height || "--",
                            activityLevel: formData?.activityLevel || "--",
                            goal: formData?.fitnessGoal?.primaryGoal || "--",
                        };
                    })
                );

                setClients(enrichedClients);
                setFilteredClients(enrichedClients);
            } catch (err) {
                console.error("Error fetching clients", err);
            }
        };

        fetchClients();
    }, []);

    console.log(clients)

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

            <div className="overflow-x-auto bg-white">
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
                                <th className="p-3">TDEE</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3">Weight</th>
                                <th className="p-3">Height</th>
                                <th className="p-3">Activity Level</th>
                                <th className="p-3">Goal</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                            src={client.avatar || "/avatar.png"}
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        {client.name}
                                    </td>
                                    <td className="p-3">{client.phone}</td>
                                    <td className="p-3">{client.clientId}</td>
                                    <td className="p-3">
                                        <span
                                            className={`block w-full text-center py-2 text-sm rounded-lg ${client.status === "Active"
                                                ? "bg-[#89E2AD] text-black"
                                                : "bg-[#D9D9D9] text-black"
                                                }`}
                                        >
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{client.age}</td>
                                    <td className="p-3 font-semibold">
                                        {client.tdee !== "--" ? `${client.tdee} kcal` : "--"}
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
