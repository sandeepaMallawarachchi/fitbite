import type { Client } from "../types/User";
import { Filter } from "lucide-react";
import ClientCard from "./ClientCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClientFilterModal from "./ClientFilterModal";
import { AnimatePresence } from "framer-motion";

const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const token = localStorage.getItem("token");
  const [filteredClients, setFilteredClients] = useState<Client[] | null>(null);
  const [showFilter, setShowFilter] = useState(false);

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
              let unreadCount = 0;

              try {
                const msgRes = await axios.get(`http://localhost:5000/chat/getMessages/${user._id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const messages = msgRes.data;
                if (messages.length === 0) return null;

                lastMessage = messages[messages.length - 1].content;

                // count unread user messages
                unreadCount = messages.filter(
                  (msg: any) => msg.role === "user" && !msg.readByCoach
                ).length;

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
                unreadCount,
              };
            })
        );

        const validClients = formattedClients.filter(Boolean);

        setClients(validClients);
        setFilteredClients(validClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const navigate = useNavigate();

  const handleClientClick = (client: Client) => {
    navigate(`/dashboard/smart-assistant?userId=${client._id}&userName=${encodeURIComponent(client.name)}`);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        clients.map((client) =>
          axios.patch(`http://localhost:5000/chat/mark-read/${client._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setClients((prev) => prev.map((c) => ({ ...c, unreadCount: 0 })));

    } catch (err) {
      console.error("Mark all as read failed", err);
    } finally {
      setShowFilter(false);
      window.location.reload();
    }
  };
  const handleFilter = (type: "all" | "read" | "unread") => {
    if (type === "all") {
      setFilteredClients(null);
    } else {
      const filtered = clients.filter(
        (client) =>
          type === "unread"
            ? (client.unreadCount ?? 0) > 0
            : (client.unreadCount ?? 0) === 0
      );
      setFilteredClients(filtered);
    }
    setShowFilter(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Clients</h2>
        <Filter
          className="w-5 h-5 text-gray-500 cursor-pointer"
          onClick={() => setShowFilter((prev) => !prev)}
        />
      </div>
      <div className="space-y-4">
        {(filteredClients ?? clients).map((client) => (
          <ClientCard key={client._id} client={client} onClick={() => handleClientClick(client)} />
        ))}
      </div>

      <AnimatePresence>
        {showFilter && (
          <ClientFilterModal
            onClose={() => setShowFilter(false)}
            onFilter={handleFilter}
            onMarkAllRead={handleMarkAllAsRead}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsTable;