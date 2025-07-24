import type { Client } from "../types/User";
import { Filter } from "lucide-react";
import ClientCard from "./ClientCard";
import { useEffect, useState } from "react";
import axios from "axios";

const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/getAllUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedClients = res.data.userDetails
          .filter((user: any) => user.role === "User")
          .map((user: any) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            role: user.role,
            createdAt: user.createdAt,

            avatar: `/avatar.png`,
            message: "Can I skip dinner tonight?",
            time: new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: Math.floor(Math.random() * 3),
          }));

        setClients(formattedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Clients</h2>
        <Filter className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>
      <div className="space-y-4">
        {clients.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
      </div>
    </div>
  );
};

export default ClientsTable;