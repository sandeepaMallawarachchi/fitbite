import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
    onClose: () => void;
    onFilter: (type: "all" | "read" | "unread") => void;
    onMarkAllRead: () => void;
};

const ClientFilterModal = ({ onClose, onFilter, onMarkAllRead }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute sm:top-32 sm:right-80 top-28 z-50 w-56 bg-white rounded-xl shadow-xl p-4 border border-gray-200"
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Filter Options</h3>
                <button onClick={onClose}>
                    <X className="w-4 h-4 text-gray-500 hover:scale-125 cursor-pointer" />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={() => onFilter("all")}
                    className="text-sm text-left cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition"
                >
                    All Messages
                </button>
                <button
                    onClick={() => onFilter("unread")}
                    className="text-sm text-left cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition"
                >
                    Unread Messages
                </button>
                <button
                    onClick={() => onFilter("read")}
                    className="text-sm text-left cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition"
                >
                    Read Messages
                </button>
                <button
                    onClick={onMarkAllRead}
                    className="text-sm text-left cursor-pointer text-[#4CAF50] hover:bg-gray-100 px-2 py-1 rounded-md transition"
                >
                    Mark All as Read
                </button>
            </div>
        </motion.div>
    );
};

export default ClientFilterModal;
