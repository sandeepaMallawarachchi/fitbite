import type { Client } from "../types/User";

const ClientCard=({ client }: { client: Client })=> {
  return (
    <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-md transition">
      <div className="flex items-center gap-3">
        <img
          src={client.avatar}
          alt={client.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm">{client.name}</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {client.message}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400">{client.time}</p>
        {client.unreadCount > 0 && (
          <div className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center mt-1">
            {client.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientCard;