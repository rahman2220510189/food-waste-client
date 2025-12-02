import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX, FiClock, FiPackage } from "react-icons/fi";
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

  const handleAccept = async (notificationId, chatId) => {
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
        alert(data.message);
        fetchNotifications();
        navigate(`/messages?chatId=${data.chatId}`);
      }
    } catch (error) {
      console.error("Error accepting notification:", error);
      alert("Failed to accept request");
    }
  };

  const handleCancel = async (notificationId) => {
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
        alert(data.message);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${
                  notification.status === "pending" ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {notification.requesterName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : notification.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">
                        {notification.type === "book" ? "Wants to book" : "Wants to order"}:
                      </span>{" "}
                      {notification.foodTitle}
                    </p>

                    <div className="text-sm text-gray-500 space-y-1">
                      <p>📦 Quantity: {notification.quantity}</p>
                      <p>📍 Address: {notification.requesterAddress}</p>
                      <p>📞 Contact: {notification.requesterContact}</p>
                      {notification.price && (
                        <p>💰 Total: ${notification.price.toFixed(2)}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <FiClock />
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>

                  {notification.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleAccept(notification._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        <FiCheck /> Accept
                      </button>
                      <button
                        onClick={() => handleCancel(notification._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  )}
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