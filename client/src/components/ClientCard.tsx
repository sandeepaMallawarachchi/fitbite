import type { Client } from "../types/User";

interface Props {
    client: Client;
}

const ClientCard: React.FC<Props> = ({ client }) => {
    return (
        <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition border-b border-gray-100">
            <div className="flex items-center space-x-3">
                <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-gray-700 truncate w-[180px]">
                        {client.message}
                    </p>
                </div>
            </div>
            <div className="text-right text-xs text-gray-500 space-y-1">
                <p>{client.time}</p>
                {(client.unreadCount ?? 0) > 0 && (
                    <div className="bg-[#8FE289] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                        {client.unreadCount}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientCard;
