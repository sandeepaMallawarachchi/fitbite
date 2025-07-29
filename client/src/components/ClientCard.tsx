import type { Client } from "../types/User";

interface Props {
    client: Client;
    onClick: (client: Client) => void;
}

const ClientCard: React.FC<Props> = ({ client, onClick }) => {
    return (
        <div
            onClick={() => onClick(client)}
            className="relative cursor-pointer flex md:flex-row flex-col items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition border-b border-gray-100">
            <div className="flex md:flex-row flex-col items-center space-x-3">
                <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h3 className="font-semibold text-center md:text-left">
                        {client.name}
                    </h3>
                    <p className="text-sm text-gray-700 truncate w-[180px]">
                        {client.message}
                    </p>
                </div>
            </div>

            <div className="text-right text-xs text-gray-700 space-y-1">
                <p>{client.time}</p>
            </div>

            {(client.unreadCount ?? 0) > 0 && (
                <div
                    className="bg-[#89E2AD] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center
          md:absolute md:top-0 md:right-2 ml-auto md:ml-0 mt-1 md:mt-0"
                >
                    {client.unreadCount}
                </div>
            )}
        </div>
    );
};

export default ClientCard;
