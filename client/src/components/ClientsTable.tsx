import type { Client } from "../types/User";
import { Filter } from "lucide-react";
import ClientCard from "./ClientCard";

const sampleClients: Client[] = [
    {
        id: "1",
        name: "Nipuna Udara",
        avatar: "/avatars/nipuna.jpg",
        message: "Is it okay if I skip dinner tonight?",
        time: "03:13 PM",
        unreadCount: 1,
        status: "active",
    },
    {
        id: "2",
        name: "Sanduni Perera",
        avatar: "/avatars/sanduni.jpg",
        message: "Can I swap today’s lunch for something else?",
        time: "03:01 PM",
        unreadCount: 2,
        status: "active",
    },
    // Add more...
];

const ClientsTable = () => {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Clients</h2>
                <Filter className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
            <div className="space-y-4">
                {sampleClients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
}

export default ClientsTable;