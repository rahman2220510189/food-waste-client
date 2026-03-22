import { useState, useEffect, useContext } from 'react';
import { 
  FiShoppingBag, 
  FiPackage, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiDollarSign,
  FiTrendingUp,
  FiUsers, // Added for Received Requests
  FiList // Added for Posts
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

  // --- Loading State Styling ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-indigo-200 text-lg font-medium">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-xl">
            😕 No dashboard data available. Please check the backend connection.
        </p>
      </div>
    );
  }

  //  Component for Statistic Cards 
  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 hover:shadow-indigo-500/30 transition duration-300 transform hover:-translate-y-1 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className={`text-4xl font-extrabold ${color} mt-2`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-900')} bg-opacity-50`}>
          <Icon className={`text-3xl ${color}`} />
        </div>
      </div>
    </div>
  );

  // Helper function for tab icons
  const getTabIcon = (tab) => {
    switch (tab) {
        case 'overview': return <FiTrendingUp className="h-5 w-5 mr-2" />;
        case 'orders': return <FiDollarSign className="h-5 w-5 mr-2" />;
        case 'bookings': return <FiPackage className="h-5 w-5 mr-2" />;
        case 'received': return <FiUsers className="h-5 w-5 mr-2" />;
        case 'posts': return <FiList className="h-5 w-5 mr-2" />;
        default: return null;
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 border-b border-gray-700 pb-4">
          <h1 className="text-5xl font-extrabold text-white">
                👋 Welcome, {user?.displayName || 'User'}
            </h1>
          <p className="text-indigo-400 text-xl mt-3">Your FoodShare Activity Hub</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            icon={FiDollarSign}
            title="Total Spent"
            value={`৳${stats.myOrders.totalSpent.toFixed(2)}`}
            subtitle="On paid food acquisitions"
            color="text-green-500" // Money Green
          />
          <StatCard
            icon={FiShoppingBag}
            title="Total Acquisitions"
            value={stats.myOrders.total + stats.myBookings.total}
            subtitle={`${stats.myOrders.total} Paid, ${stats.myBookings.total} Free`}
            color="text-indigo-400" // Primary Blue
          />
          <StatCard
            icon={FiCheckCircle}
            title="Successfully Shared"
            value={stats.receivedRequests.accepted} // Focusing on successful sharing impact
            subtitle={`You fulfilled ${stats.receivedRequests.accepted} requests`}
            color="text-teal-400" // Success Teal
          />
          <StatCard
            icon={FiClock}
            title="Pending Actions"
            value={stats.receivedRequests.pending}
            subtitle="Requests awaiting your response"
            color="text-yellow-500" // Warning Yellow
          />
        </div>
        
        {/* --- TABS SECTION --- */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            {['overview', 'orders', 'bookings', 'received', 'posts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold capitalize transition flex items-center whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-900'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {getTabIcon(tab)}
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 bg-gray-900 rounded-b-xl">
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* My Orders Summary */}
                  <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-900 shadow-lg">
                    <h3 className="text-xl font-bold text-indigo-300 mb-3 flex items-center gap-2">
                        <FiDollarSign /> My Paid Orders
                    </h3>
                    <p className="text-md text-indigo-400">Pending: <span className="font-bold">{stats.myOrders.pending}</span></p>
                    <p className="text-md text-teal-400">Accepted: <span className="font-bold">{stats.myOrders.accepted}</span></p>
                    <p className="text-md text-red-400">Cancelled: <span className="font-bold">{stats.myOrders.cancelled}</span></p>
                  </div>
                    
                    {/* My Bookings Summary */}
                  <div className="bg-green-900/40 rounded-xl p-6 border border-green-900 shadow-lg">
                    <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                        <FiPackage /> My Free Bookings
                    </h3>
                    <p className="text-md text-green-400">Pending: <span className="font-bold">{stats.myBookings.pending}</span></p>
                    <p className="text-md text-teal-400">Accepted: <span className="font-bold">{stats.myBookings.accepted}</span></p>
                    <p className="text-md text-red-400">Cancelled: <span className="font-bold">{stats.myBookings.cancelled}</span></p>
                  </div>
                    
                    {/* Received Requests Summary */}
                  <div className="bg-purple-900/40 rounded-xl p-6 border border-purple-900 shadow-lg">
                    <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                        <FiUsers /> Requests Received
                    </h3>
                    <p className="text-md text-purple-400">Pending: <span className="font-bold">{stats.receivedRequests.pending}</span></p>
                    <p className="text-md text-teal-400">Accepted: <span className="font-bold">{stats.receivedRequests.accepted}</span></p>
                    <p className="text-md text-red-400">Cancelled: <span className="font-bold">{stats.receivedRequests.cancelled}</span></p>
                  </div>
                </div>

                {/* Impact Card - Made more prominent */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 text-white shadow-xl hover:shadow-purple-500/50 transition duration-300">
                  <h3 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
                        <FiTrendingUp className="h-6 w-6" /> Your Impact on Food Waste
                    </h3>
                  <p className="text-indigo-100 text-lg">
                    You've been involved in a total of 
                    <span className="font-bold text-white text-3xl mx-2">
                        {stats.myOrders.total + stats.myBookings.total + stats.receivedRequests.total}
                    </span>
                    transactions, contributing significantly to reducing food waste! 
                  </p>
                </div>
              </div>
            )}

            {/* Orders Tab Content */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                    <FiDollarSign className="inline mr-2 text-green-500" /> My Paid Orders ({stats.myOrders.total})
                </h3>
                {stats.myOrders.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No paid orders found.</p>
                ) : (
                  stats.myOrders.items.map(order => (
                    <div key={order._id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:bg-gray-700 transition duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg">{order.foodTitle}</h4>
                          <p className="text-sm text-gray-400 mt-1">Quantity: {order.quantity}</p>
                          <p className="text-md font-bold text-green-500">Amount: ৳{order.price?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Ordered On: {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                          order.status === 'accepted' ? 'bg-teal-700 text-teal-100' :
                          order.status === 'cancelled' ? 'bg-red-700 text-red-100' :
                          'bg-yellow-700 text-yellow-100'
                        }`}>
                          {order.status}
                        </span>
                    </div>
                  </div>
                ))
                )}
              </div>
            )}

            {/* Bookings Tab Content */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                    <FiPackage className="inline mr-2 text-green-500" /> My Free Bookings ({stats.myBookings.total})
                </h3>
                {stats.myBookings.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No free bookings found.</p>
                ) : (
                  stats.myBookings.items.map(booking => (
                    <div key={booking._id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:bg-gray-700 transition duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg">{booking.foodTitle}</h4>
                          <p className="text-sm text-gray-400 mt-1">Quantity: {booking.quantity}</p>
                          <p className="text-md font-bold text-teal-500">Free Food (Zero Waste!)</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Booked On: {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                          booking.status === 'accepted' ? 'bg-teal-700 text-teal-100' :
                          booking.status === 'cancelled' ? 'bg-red-700 text-red-100' :
                          'bg-yellow-700 text-yellow-100'
                        }`}>
                          {booking.status}
                        </span>
                    </div>
                  </div>
                ))
                )}
              </div>
            )}

            {/* Received Requests Tab Content */}
            {activeTab === 'received' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                    <FiUsers className="inline mr-2 text-purple-500" /> Received Requests ({stats.receivedRequests.total})
                </h3>
                {stats.receivedRequests.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No food requests have been sent to your posts yet.</p>
                ) : (
                  stats.receivedRequests.items.map(request => (
                    <div key={request._id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:bg-gray-700 transition duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg">{request.foodTitle}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Requested by: <span className="font-medium text-indigo-300">{request.requesterName}</span>
                          </p>
                          <p className="text-sm text-gray-400">Quantity: {request.quantity}</p>
                          <p className="text-sm text-gray-400">Contact: {request.requesterContact}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Received On: {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                          request.status === 'accepted' ? 'bg-teal-700 text-teal-100' :
                          request.status === 'cancelled' ? 'bg-red-700 text-red-100' :
                          'bg-yellow-700 text-yellow-100'
                        }`}>
                          {request.status}
                        </span>
                    </div>
                  </div>
                ))
                )}
              </div>
            )}

            {/* My Posts Tab Content */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                    <FiList className="inline mr-2 text-indigo-500" /> My Food Posts ({stats.myPosts.total})
                </h3>
                {stats.myPosts.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">You haven't posted any food items yet.</p>
                ) : (
                  stats.myPosts.items.map(post => (
                    <div key={post._id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:bg-gray-700 transition duration-200">
                      <div className="flex gap-4 items-center">
                        {post.image && (
                          <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0 border border-gray-600" 
                            />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg">{post.title}</h4>
                          <p className={`text-sm font-bold mt-1 ${post.isFree ? 'text-teal-400' : 'text-green-500'}`}>
                            {post.isFree ? 'FREE ITEM' : `৳${post.price}`}
                          </p>
                          <p className="text-sm text-gray-400">Quantity: {post.quantity}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Posted On: {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-4 py-1 h-fit rounded-full text-xs font-bold uppercase ${
                          post.status === 'available' ? 'bg-teal-700 text-teal-100' :
                          'bg-gray-600 text-gray-100'
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