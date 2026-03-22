import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiLogIn, FiLogOut, FiBell, FiMessageCircle,
  FiClock, FiMenu, FiX, FiHome, FiSearch, FiFeather, FiShield,
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../firebase/Provider/AuthProviders";

const socket = io("http://localhost:5000");

export const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchNotifCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/notifications?userId=${user.uid}`
        );
        const data = await res.json();
        const pending = data.filter((n) => n.status === "pending").length;
        setUnreadNotifCount(pending);
      } catch (err) {
        console.error("Notif count error:", err);
      }
    };

    fetchNotifCount();

    // Admin role check
    const checkAdmin = async () => {
      try {
        const res  = await fetch(`http://localhost:5000/api/users/${user.uid}`);
        const data = await res.json();
        setIsAdmin(data?.role === "admin");
      } catch (err) {
        console.error("Admin check error:", err);
      }
    };
    checkAdmin();

    socket.emit("join-user", user.uid); 

    socket.on("new-notification", () => {
      setUnreadNotifCount((prev) => prev + 1);
    });

    // Message unread count
    socket.on("new-message", (message) => {
      if (message.senderId !== user.uid) {
        setUnreadMsgCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("new-notification");
      socket.off("new-message");
    };
  }, [user]);

  // Notification page
  useEffect(() => {
    if (location.pathname === "/notifications") {
      setUnreadNotifCount(0);
    }
    if (location.pathname === "/messages") {
      setUnreadMsgCount(0);
    }
  }, [location.pathname]);

  const ACCENT_COLOR_CLASSES = "text-emerald-500 font-bold";
  const BASE_TEXT_CLASSES =
    "text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out";
  const LOGOUT_BUTTON_CLASSES =
    "bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition duration-300 ease-in-out shadow-lg flex items-center gap-2";

  const handleLogOut = () => {
    logOut()
      .then(() => console.log("logged out"))
      .catch((error) => console.error("Logout error:", error));
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-1 p-2 rounded-md transition duration-300 ease-in-out ${
      isActive ? ACCENT_COLOR_CLASSES : BASE_TEXT_CLASSES
    } ${!isActive && "hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"}`;

  const navBar = (
    <>
      <NavLink to="/" className={navLinkClasses}>
        <FiHome className="h-5 w-5" /> Home
      </NavLink>
      <NavLink to="/browse" className={navLinkClasses}>
        <FiSearch className="h-5 w-5" /> Browse
      </NavLink>
      <NavLink to="/post" className={navLinkClasses}>
        <FiFeather className="h-5 w-5" /> Post Food
      </NavLink>
      <NavLink to="/dashboard" className={navLinkClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>{" "}
        Dashboard
      </NavLink>

      {user && (
        <>
          {/* Notification badge */}
          <NavLink to="/notifications" className={navLinkClasses}>
            <span className="relative">
              <FiBell className="h-5 w-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                  {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                </span>
              )}
            </span>
            Notifications
          </NavLink>

          {/* Message badge */}
          <NavLink to="/messages" className={navLinkClasses}>
            <span className="relative">
              <FiMessageCircle className="h-5 w-5" />
              {unreadMsgCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                  {unreadMsgCount > 99 ? "99+" : unreadMsgCount}
                </span>
              )}
            </span>
            Messages
          </NavLink>

          <NavLink to="/history" className={navLinkClasses}>
            <FiClock className="h-5 w-5" /> History
          </NavLink>

          {/* Admin link — শুধু admin role এ দেখাবে */}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClasses}>
              <FiShield className="h-5 w-5" /> Admin
            </NavLink>
          )}
        </>
      )}
    </>
  );

  return (
    <nav
      className="bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800"
      aria-label="Main Navigation"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" aria-label="FoodShare Home">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-gray-900 font-extrabold text-xl shadow-md">
                FS
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wider">FoodShare</h1>
                <p className="text-xs text-gray-400 -mt-1 font-medium">Share safely · Reduce waste</p>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-4">{navBar}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button onClick={handleLogOut} className={LOGOUT_BUTTON_CLASSES}>
                <FiLogOut className="h-5 w-5" /> Log Out
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from: location }}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out flex items-center gap-2"
              >
                <FiLogIn className="h-5 w-5" /> Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {navBar}
          </div>
        </div>
      )}
    </nav>
  );
};