import { User, Users, PieChart } from "lucide-react";

const stats = [
  {
    label: "Active Clients",
    value: 73,
    icon: <User className="w-6 h-6 text-white" />,
    iconBg: "bg-[#8FE289]",
  },
  {
    label: "Total Clients",
    value: 85,
    icon: <Users className="w-6 h-6 text-white" />,
    iconBg: "bg-[#89B0E2]",
  },
  {
    label: "Inactive Clients",
    value: 12,
    icon: <Users className="w-6 h-6 text-white" />,
    iconBg: "bg-[#E4E5E6]",
  },
  {
    label: "Client Engagement Rate",
    value: "86%",
    icon: <PieChart className="w-6 h-6 text-white" />,
    iconBg: "bg-[#B789E2]",
  },
];

export default function ClientStatsSidebar() {
  return (
    <div className="w-full max-w-[220px] space-y-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl px-5 py-5 shadow flex flex-col gap-5 items-start justify-start"
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