import { useContext, useEffect, useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { AuthContext } from "../firebase/Provider/AuthProviders";

const ChatWindow = ({ chat, socket }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chat?._id) {
      fetchMessages();
      socket.emit("join-chat", chat._id);

      socket.on("receive-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("receive-message");
      };
    }
  }, [chat, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${chat._id}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const messageData = {
      chatId: chat._id,
      senderId: user.uid,
      text: newMessage.trim(),
    };

    try {
      // Send via socket for real-time
      socket.emit("send-message", messageData);

      // Also save to database
      await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const mins = d.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const otherUserId = chat?.participants?.find((p) => p !== user.uid);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {otherUserId?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{otherUserId}</h3>
            <p className="text-xs text-green-500">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.senderId === user.uid;
            return (
              <div
                key={index}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      isOwnMessage ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;