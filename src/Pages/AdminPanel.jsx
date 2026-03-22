import { useEffect, useState } from "react";
import {
  FiUsers, FiPackage, FiDollarSign, FiTrash2,
  FiSearch, FiRefreshCw, FiShoppingBag, FiCheck,
  FiClock, FiX, FiAlertCircle, FiTrendingUp, FiShield,
  FiUserX, FiArrowRight
} from "react-icons/fi";

const API = "https://food-waste-server-pio7.onrender.com/api/admin";

// ── Helpers ───────────────────────────────────────────────
const fmt = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit", month: "short", year: "numeric"
  });
};

const Avatar = ({ src, name, size = "w-8 h-8" }) => (
  src
    ? <img src={src} alt="" className={`${size} rounded-full object-cover flex-shrink-0`} />
    : <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0`}>
        {name?.[0]?.toUpperCase() || "U"}
      </div>
);

// ── Status Badge ──────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    pending:     "bg-amber-100 text-amber-700",
    accepted:    "bg-emerald-100 text-emerald-700",
    cancelled:   "bg-red-100 text-red-600",
    available:   "bg-sky-100 text-sky-700",
    unavailable: "bg-gray-100 text-gray-500",
    paid:        "bg-violet-100 text-violet-700",
    admin:       "bg-rose-100 text-rose-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div className={`rounded-2xl p-5 flex items-start gap-4 ${bg}`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="text-lg text-white" />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-0.5">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      {sub && <p className="text-xs opacity-50 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Tab ───────────────────────────────────────────────────
const Tab = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      active
        ? "bg-gray-900 text-white shadow-lg"
        : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
    }`}
  >
    <Icon className="text-base" /> {label}
    {count !== undefined && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
        active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
      }`}>
        {count}
      </span>
    )}
  </button>
);

// ── Confirm Modal ─────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
      <FiAlertCircle className="text-3xl text-red-400 mx-auto mb-3" />
      <p className="text-center text-gray-700 font-semibold mb-1">Are you sure?</p>
      <p className="text-center text-gray-400 text-sm mb-5">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats,    setStats]      = useState(null);
  const [users,    setUsers]      = useState([]);
  const [foods,    setFoods]      = useState([]);
  const [payments, setPayments]   = useState([]);
  const [loading,  setLoading]    = useState(false);
  const [search,   setSearch]     = useState("");
  const [filter,   setFilter]     = useState("");
  const [confirm,  setConfirm]    = useState(null);
  const [totals,   setTotals]     = useState({ users: 0, foods: 0, payments: 0 });
  const [toast,    setToast]      = useState(null);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (activeTab === "users")    fetchUsers();
    if (activeTab === "foods")    fetchFoods();
    if (activeTab === "payments") fetchPayments();
  }, [activeTab, filter]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    try {
      const res  = await fetch(`${API}/stats`);
      const json = await res.json();
      if (json.success) setStats(json.stats);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/users?limit=50&search=${search}`);
      const json = await res.json();
      if (json.success) { setUsers(json.users); setTotals(t => ({ ...t, users: json.total })); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/foods?limit=50&search=${search}&status=${filter}`);
      const json = await res.json();
      if (json.success) { setFoods(json.foods); setTotals(t => ({ ...t, foods: json.total })); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/payments?limit=50&status=${filter}`);
      const json = await res.json();
      if (json.success) { setPayments(json.payments); setTotals(t => ({ ...t, payments: json.total })); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await fetch(`${API}/${confirm.type}/${confirm.id}`, { method: "DELETE" });
      setConfirm(null);
      showToast("Deleted successfully");
      if (confirm.type === "users") fetchUsers();
      if (confirm.type === "foods") fetchFoods();
    } catch (e) { console.error(e); }
  };

  // ── Make / Remove Admin ───────────────────────────────
  const handleMakeAdmin = async (userId, isAdmin) => {
    try {
      const endpoint = isAdmin ? "remove-admin" : "make-admin";
      const res  = await fetch(`${API}/users/${userId}/${endpoint}`, { method: "PUT" });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchUsers();
      }
    } catch (e) { console.error(e); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "foods") fetchFoods();
  };

  const refreshAll = () => {
    fetchStats();
    if (activeTab === "users")    fetchUsers();
    if (activeTab === "foods")    fetchFoods();
    if (activeTab === "payments") fetchPayments();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Toast ──────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${
          toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ─────────────────────────────────── */}
      <div className="bg-gray-900 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">Admin Panel</h1>
            <p className="text-gray-400 text-xs mt-0.5">FoodShare Management</p>
          </div>
          <button
            onClick={refreshAll}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition"
          >
            <FiRefreshCw className="text-sm" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── Tabs ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <Tab active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={FiTrendingUp}  label="Overview" />
          <Tab active={activeTab === "users"}    onClick={() => setActiveTab("users")}    icon={FiUsers}       label="Users"    count={totals.users} />
          <Tab active={activeTab === "foods"}    onClick={() => setActiveTab("foods")}    icon={FiPackage}     label="Foods"    count={totals.foods} />
          <Tab active={activeTab === "payments"} onClick={() => setActiveTab("payments")} icon={FiDollarSign}  label="Orders"   count={totals.payments} />
        </div>

        {/* ══════════════════════════════════════════ */}
        {/*  OVERVIEW                                  */}
        {/* ══════════════════════════════════════════ */}
        {activeTab === "overview" && stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={FiUsers}       label="Total Users"   value={stats.totalUsers}   sub="Registered"                    color="bg-sky-500"    bg="bg-sky-50 text-sky-900" />
              <StatCard icon={FiPackage}     label="Total Foods"   value={stats.totalFoods}   sub={`${stats.activeFoods} active`} color="bg-emerald-500" bg="bg-emerald-50 text-emerald-900" />
              <StatCard icon={FiShoppingBag} label="Total Orders"  value={stats.totalOrders}  sub={`${stats.pendingOrders} pending`} color="bg-amber-500" bg="bg-amber-50 text-amber-900" />
              <StatCard icon={FiDollarSign}  label="Total Revenue" value={`৳${stats.totalRevenue.toFixed(0)}`} sub={`৳${stats.totalRevenuePaid.toFixed(0)} paid online`} color="bg-violet-500" bg="bg-violet-50 text-violet-900" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Orders Breakdown</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-amber-600"><FiClock /> Pending</span>
                    <span className="font-bold">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-emerald-600"><FiCheck /> Accepted</span>
                    <span className="font-bold">{stats.acceptedOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-violet-600"><FiDollarSign /> Paid Online</span>
                    <span className="font-bold">{stats.paidOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-sky-600"><FiPackage /> Bookings</span>
                    <span className="font-bold">{stats.totalBookings}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Foods Breakdown</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-sky-600"><FiPackage /> Active</span>
                    <span className="font-bold">{stats.activeFoods}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-400"><FiX /> Sold Out</span>
                    <span className="font-bold">{stats.totalFoods - stats.activeFoods}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl p-5 shadow-sm md:col-span-1 col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Revenue</p>
                <p className="text-3xl font-black">৳{stats.totalRevenue.toFixed(2)}</p>
                <p className="text-gray-400 text-xs mt-1">All accepted orders</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400">Online paid</p>
                  <p className="text-xl font-bold">৳{stats.totalRevenuePaid.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/*  USERS                                     */}
        {/* ══════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                Search
              </button>
            </form>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-semibold text-gray-700 text-sm">All Users <span className="text-gray-400 font-normal">({totals.users})</span></p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="py-16 text-center text-gray-400">No users found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                        <th className="px-5 py-3 text-left">User</th>
                        <th className="px-5 py-3 text-left">Email</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">Joined</th>
                        <th className="px-5 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar src={u.photoURL} name={u.displayName || u.email} />
                              <span className="font-medium text-gray-800">{u.displayName || "—"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-500">{u.email}</td>
                          <td className="px-5 py-3">
                            {u.role === "admin"
                              ? <Badge status="admin" />
                              : <span className="text-gray-400 text-xs">user</span>
                            }
                          </td>
                          <td className="px-5 py-3 text-gray-400">{fmt(u.createdAt)}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {/* Make / Remove Admin */}
                              <button
                                onClick={() => handleMakeAdmin(u._id, u.role === "admin")}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                  u.role === "admin"
                                    ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                }`}
                                title={u.role === "admin" ? "Remove Admin" : "Make Admin"}
                              >
                                {u.role === "admin"
                                  ? <><FiUserX /> Remove Admin</>
                                  : <><FiShield /> Make Admin</>
                                }
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setConfirm({ type: "users", id: u._id, name: u.displayName || u.email })}
                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/*  FOODS                                     */}
        {/* ══════════════════════════════════════════ */}
        {activeTab === "foods" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title or address..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <button type="submit" className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                  Search
                </button>
              </form>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-semibold text-gray-700 text-sm">All Foods <span className="text-gray-400 font-normal">({totals.foods})</span></p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : foods.length === 0 ? (
                <div className="py-16 text-center text-gray-400">No foods found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                        <th className="px-5 py-3 text-left">Food</th>
                        <th className="px-5 py-3 text-left">Price</th>
                        <th className="px-5 py-3 text-left">Qty</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Posted</th>
                        <th className="px-5 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {foods.map((f) => (
                        <tr key={f._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {f.image && <img src={f.image?.replace('http://localhost:5000', 'https://food-waste-server-pio7.onrender.com')} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                              <div>
                                <p className="font-medium text-gray-800 truncate max-w-[180px]">{f.title}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[180px]">{f.location?.address || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            {f.isFree
                              ? <span className="text-emerald-600 font-semibold">Free</span>
                              : <span className="font-semibold">৳{f.price}</span>
                            }
                          </td>
                          <td className="px-5 py-3 text-gray-600">{f.quantity}</td>
                          <td className="px-5 py-3"><Badge status={f.status} /></td>
                          <td className="px-5 py-3 text-gray-400">{fmt(f.createdAt)}</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => setConfirm({ type: "foods", id: f._id, name: f.title })}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/*  ORDERS / PAYMENTS                         */}
        {/* ══════════════════════════════════════════ */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-semibold text-gray-700 text-sm">All Orders & Payments <span className="text-gray-400 font-normal">({totals.payments})</span></p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : payments.length === 0 ? (
                <div className="py-16 text-center text-gray-400">No orders found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                        <th className="px-5 py-3 text-left">Food</th>
                        <th className="px-5 py-3 text-left">From → To</th>
                        <th className="px-5 py-3 text-left">Amount</th>
                        <th className="px-5 py-3 text-left">Type</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Payment</th>
                        <th className="px-5 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payments.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {p.foodImage && <img src={p.foodImage?.replace('http://localhost:5000', 'https://food-waste-server-pio7.onrender.com')} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                              <span className="font-medium text-gray-800 truncate max-w-[120px]">{p.foodTitle}</span>
                            </div>
                          </td>

                          
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <Avatar src={p.requesterInfo?.photoURL} name={p.requesterInfo?.displayName} size="w-6 h-6" />
                                <span className="text-gray-700 text-xs truncate max-w-[70px]">
                                  {p.requesterInfo?.displayName || p.requesterName || "—"}
                                </span>
                              </div>
                              <FiArrowRight className="text-gray-300 flex-shrink-0" />
                              <div className="flex items-center gap-1.5">
                                <Avatar src={p.ownerInfo?.photoURL} name={p.ownerInfo?.displayName} size="w-6 h-6" />
                                <span className="text-gray-700 text-xs truncate max-w-[70px]">
                                  {p.ownerInfo?.displayName || "—"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            {p.price
                              ? <span className="font-semibold text-gray-800">৳{p.price.toFixed(2)}</span>
                              : <span className="text-emerald-600 font-semibold">Free</span>
                            }
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              p.type === "order" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700"
                            }`}>
                              {p.type === "order" ? "💰 Order" : "🆓 Booking"}
                            </span>
                          </td>
                          <td className="px-5 py-3"><Badge status={p.status} /></td>
                          <td className="px-5 py-3">
                            {p.paymentStatus === "paid"
                              ? <Badge status="paid" />
                              : <span className="text-gray-300 text-xs">—</span>
                            }
                          </td>
                          <td className="px-5 py-3 text-gray-400">{fmt(p.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── Confirm Modal ─────────────────────────── */}
      {confirm && (
        <ConfirmModal
          message={`"${confirm.name}" will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;