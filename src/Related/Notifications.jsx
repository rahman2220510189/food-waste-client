import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX, FiClock, FiPackage, FiMessageCircle } from "react-icons/fi";
import { AuthContext } from "../firebase/Provider/AuthProviders";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications?userId=${user.uid}`
      );
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/accept`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("✅ " + data.message);
        fetchNotifications();
        
        // Navigate to messages with the new chat
        if (data.chatId) {
          navigate(`/messages?chatId=${data.chatId}`);
        }
      }
    } catch (error) {
      console.error("Error accepting notification:", error);
      alert("Failed to accept request");
    }
  };

  const handleCancel = async (notificationId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this request?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/cancel`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("❌ " + data.message);
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error cancelling notification:", error);
      alert("Failed to cancel request");
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-50">Notifications</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {notifications.length} Total
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-slate-700 rounded-lg shadow p-12 text-center">
            <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No notifications yet</p>
            <p className="text-gray-400 text-sm">You'll see notifications here when someone requests your food</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden ${
                  notification.status === "pending" 
                    ? "border-l-4 border-yellow-500" 
                    : notification.status === "accepted"
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-red-500"
                }`}
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Food Image */}
                    {notification.foodImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={notification.foodImage}
                          alt={notification.foodTitle}
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {notification.requesterName}
                          </h3>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              notification.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : notification.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {notification.status === "pending" && "⏳ Pending"}
                            {notification.status === "accepted" && "✅ Accepted"}
                            {notification.status === "cancelled" && "❌ Cancelled"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 font-medium">
                        <span className="text-blue-600">
                          {notification.type === "book" ? "📦 Wants to book" : "🛒 Wants to order"}:
                        </span>{" "}
                        {notification.foodTitle}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">📦 Quantity:</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{notification.quantity}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">📞 Contact:</span>
                          <a href={`tel:${notification.requesterContact}`} className="text-blue-600 hover:underline">
                            {notification.requesterContact}
                          </a>
                        </p>
                        <p className="flex items-start gap-2 md:col-span-2">
                          <span className="font-semibold whitespace-nowrap">📍 Address:</span>
                          <span className="text-gray-700">{notification.requesterAddress}</span>
                        </p>
                        {notification.price && (
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">💰 Total:</span>
                            <span className="text-green-600 font-bold">৳{notification.price.toFixed(2)}</span>
                          </p>
                        )}
                        {notification.paymentStatus === 'paid' && (
                          <p className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                              ✓ PAID ONLINE
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <FiClock />
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {notification.status === "pending" && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAccept(notification._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          <FiCheck /> Accept
                        </button>
                        <button
                          onClick={() => handleCancel(notification._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    )}

                    {notification.status === "accepted" && (
                      <div className="flex items-center">
                        <button
                          onClick={() => navigate(`/messages?chatId=${notification.chatId}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          <FiMessageCircle /> Open Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;