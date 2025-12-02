import { useState, useEffect, useContext } from 'react';
import { 
  FiShoppingBag, 
  FiPackage, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiDollarSign,
  FiTrendingUp 
} from 'react-icons/fi';
import { AuthContext } from '../firebase/Provider/AuthProviders';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dashboard/${user.uid}/stats`);
      const data = await response.json();
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Dashboard error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your food sharing activity</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiDollarSign}
            title="Total Spent"
            value={`৳${stats.myOrders.totalSpent.toFixed(2)}`}
            subtitle="On paid orders"
            color="text-green-600"
          />
          <StatCard
            icon={FiShoppingBag}
            title="Total Orders"
            value={stats.myOrders.total + stats.myBookings.total}
            subtitle={`${stats.myOrders.total} paid, ${stats.myBookings.total} free`}
            color="text-blue-600"
          />
          <StatCard
            icon={FiCheckCircle}
            title="Completed"
            value={stats.myOrders.accepted + stats.myBookings.accepted}
            subtitle="Successfully accepted"
            color="text-emerald-600"
          />
          <StatCard
            icon={FiXCircle}
            title="Cancelled"
            value={stats.myOrders.cancelled + stats.myBookings.cancelled}
            subtitle="Rejected requests"
            color="text-red-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {['overview', 'orders', 'bookings', 'received', 'posts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">My Orders</h3>
                    <p className="text-sm text-blue-600">Pending: {stats.myOrders.pending}</p>
                    <p className="text-sm text-blue-600">Accepted: {stats.myOrders.accepted}</p>
                    <p className="text-sm text-blue-600">Cancelled: {stats.myOrders.cancelled}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">My Bookings</h3>
                    <p className="text-sm text-green-600">Pending: {stats.myBookings.pending}</p>
                    <p className="text-sm text-green-600">Accepted: {stats.myBookings.accepted}</p>
                    <p className="text-sm text-green-600">Cancelled: {stats.myBookings.cancelled}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Received Requests</h3>
                    <p className="text-sm text-purple-600">Pending: {stats.receivedRequests.pending}</p>
                    <p className="text-sm text-purple-600">Accepted: {stats.receivedRequests.accepted}</p>
                    <p className="text-sm text-purple-600">Cancelled: {stats.receivedRequests.cancelled}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Your Impact</h3>
                  <p className="text-blue-100">
                    You've helped reduce food waste by participating in {stats.myOrders.total + stats.myBookings.total} transactions
                  </p>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">My Orders ({stats.myOrders.total})</h3>
                {stats.myOrders.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  stats.myOrders.items.map(order => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{order.foodTitle}</h4>
                          <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantity}</p>
                          <p className="text-sm text-gray-600">Amount: ৳{order.price?.toFixed(2)}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">My Bookings ({stats.myBookings.total})</h3>
                {stats.myBookings.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookings yet</p>
                ) : (
                  stats.myBookings.items.map(booking => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{booking.foodTitle}</h4>
                          <p className="text-sm text-gray-600 mt-1">Quantity: {booking.quantity}</p>
                          <p className="text-sm text-green-600 font-medium">Free Food</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Received Requests Tab */}
            {activeTab === 'received' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Received Requests ({stats.receivedRequests.total})
                </h3>
                {stats.receivedRequests.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No requests received yet</p>
                ) : (
                  stats.receivedRequests.items.map(request => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{request.foodTitle}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Requested by: {request.requesterName}
                          </p>
                          <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                          <p className="text-sm text-gray-600">Contact: {request.requesterContact}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          request.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* My Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  My Food Posts ({stats.myPosts.total})
                </h3>
                {stats.myPosts.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No posts yet</p>
                ) : (
                  stats.myPosts.items.map(post => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex gap-4">
                        {post.image && (
                          <img src={post.image} alt={post.title} className="w-24 h-24 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{post.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {post.isFree ? 'Free' : `৳${post.price}`}
                          </p>
                          <p className="text-sm text-gray-600">Quantity: {post.quantity}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 h-fit rounded-full text-xs font-medium ${
                          post.status === 'available' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;