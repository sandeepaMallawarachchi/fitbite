import axios from "axios";
import { User, Users, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Client } from "../types/User";

const ClientStatsSidebar = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {

      setLoading(true)
      try {
        const res = await axios.get("https://fitbite-roan.vercel.app/user/getAllUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(res.data.userDetails.filter((user: Client) => user.role === "User"));
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchClients();
  }, []);

  const getStats = () => {
    const total = clients.length;
    const active = clients.filter((c) => c.status === "Active").length;
    const inactive = clients.filter((c) => c.status === "Inactive").length;

    const engagementRate = total > 0 ? `${Math.round((active / total) * 100)}%` : "0%";

    return [
      {
        label: "Active Clients",
        value: active,
        icon: <User className="w-6 h-6 text-white" />,
        iconBg: "bg-[#8FE289]",
      },
      {
        label: "Total Clients",
        value: total,
        icon: <Users className="w-6 h-6 text-white" />,
        iconBg: "bg-[#89B0E2]",
      },
      {
        label: "Inactive Clients",
        value: inactive,
        icon: <Users className="w-6 h-6 text-white" />,
        iconBg: "bg-[#E4E5E6]",
      },
      {
        label: "Client Engagement Rate",
        value: engagementRate,
        icon: <PieChart className="w-6 h-6 text-white" />,
        iconBg: "bg-[#B789E2]",
      },
    ];
  };

  if (loading) {
    return (
      <div className="w-full md:max-w-[220px] space-y-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl px-5 py-5 shadow flex flex-col gap-5 md:items-start md:justify-start items-center"
          >
            <div className="flex flex-row gap-10 items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200" />
              <div className="h-6 w-10 bg-gray-200 rounded-md" />
            </div>
            <div className="w-28 h-4 bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-[220px] space-y-6">
      {getStats().map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl px-5 py-5 shadow flex flex-col gap-5 md:items-start md:justify-start items-center"
        >
          <div className="flex flex-row gap-10 items-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.iconBg}`}
            >
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-black">{stat.value}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-black font-semibold">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClientStatsSidebar;