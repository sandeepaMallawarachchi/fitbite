"use client";
import {
  Mic,
  Image,
  Send,
} from "lucide-react";

const DashboardHome = () => {
    return (
        <section className="flex flex-col items-center justify-center flex-1">
            <h1 className="text-xl font-semibold mb-6 text-gray-800">
                Let's start tracking...
            </h1>
            <div className="w-full max-w-xl bg-white p-4 rounded-2xl shadow flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Log your meals by typing here"
                    className="flex-1 outline-none text-sm placeholder-gray-400"
                />
                <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-black">
                        <Mic className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-black">
                        <Image className="w-4 h-4" />
                    </button>
                </div>
                <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                    <Send className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </section>
    )
}

export default DashboardHome