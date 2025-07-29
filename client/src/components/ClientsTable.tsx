import type { Client } from "../types/User";
import { Filter } from "lucide-react";
import ClientCard from "./ClientCard";
import { useEffect, useState } from "react";
import axios from "axios";
import SmartMealAssistant from "./SmartMealAssistant";

const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/getAllUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedClients = await Promise.all(
          res.data.userDetails
            .filter((user: any) => user.role === "User")
            .map(async (user: any) => {
              let lastMessage = "No messages yet";
              try {
                const msgRes = await axios.get(`http://localhost:5000/chat/getMessages/${user._id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const messages = msgRes.data;
                lastMessage = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet";
              } catch (err) {
                console.error("Error fetching messages for user", user._id, err);
              }

              return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt,
                avatar: `/avatar.png`,
                message: lastMessage,
                time: new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: Math.floor(Math.random() * 3),
              };
            })
        );

        setClients(formattedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  if (selectedClient) {
    return (
      <SmartMealAssistant userId={selectedClient._id} userName={selectedClient.name} readOnly={true} />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Clients</h2>
        <Filter className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>
      <div className="space-y-4">
        {clients.map((client) => (
          <ClientCard key={client._id} client={client} onClick={setSelectedClient} />
        ))}
      </div>
    </div>
  );
};

export default ClientsTable;