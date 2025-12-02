import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/Provider/AuthProviders";
import { FiCheck, FiX, FiClock, FiPackage } from "react-icons/fi";

const History = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all"); // all, accepted, cancelled
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchHistory();
    }
  }, [user, filter]);

  const fetchHistory = async () => {
    try {
      let url = `http://localhost:5000/api/history?userId=${user.uid}`;

      if (filter === "accepted") {
        url = `http://localhost:5000/api/history/accepted?userId=${user.uid}`;
      } else if (filter === "cancelled") {
        url = `http://localhost:5000/api/history/cancelled?userId=${user.uid}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My History</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              filter === "accepted"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              filter === "cancelled"
                ? "bg-red-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.action === "accepted" ? (
                        <FiCheck className="text-green-500 text-xl" />
                      ) : (
                        <FiX className="text-red-500 text-xl" />
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.action === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.action === "accepted" ? "Accepted" : "Cancelled"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Request from {item.requesterId}
                    </h3>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📦 Food Item ID: {item.foodItemId.toString()}</p>
                      {item.chatId && (
                        <p className="text-blue-600">
                          💬 Chat ID: {item.chatId.toString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <FiClock />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
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

export default History;