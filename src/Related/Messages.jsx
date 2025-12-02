import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";
import { FiMessageCircle } from "react-icons/fi";
import { AuthContext } from "../firebase/Provider/AuthProviders";

const socket = io("http://localhost:5000");

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchChats();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const chatId = searchParams.get("chatId");
    if (chatId && chats.length > 0) {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [searchParams, chats]);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/chats?userId=${user.uid}`
      );
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const hours = d.getHours();
    const mins = d.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiMessageCircle className="text-6xl mb-4" />
              <p>No messages yet</p>
            </div>
          ) : (
            chats.map((chat) => {
              const otherUserId = chat.participants.find((p) => p !== user.uid);
              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                    selectedChat?._id === chat._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {otherUserId[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {otherUserId}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-gray-400">
                        {formatTime(chat.lastMessageAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 hidden md:flex">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} socket={socket} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FiMessageCircle className="mx-auto text-6xl mb-4" />
              <p className="text-xl">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;