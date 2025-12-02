import { Link, NavLink, useLocation } from "react-router-dom";
import { FiLogIn, FiBell, FiMessageCircle, FiClock } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Provider/AuthProviders";

export const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const location = useLocation();
    
    const handleLogOut = () => {
        logOut()
            .then(() => {
                console.log('logged out')
            })
    }

    const navBar = <>
        <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-slate-700 hover:text-primary"}>
            Home
        </NavLink>
        <NavLink to="/browse" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-slate-700 hover:text-primary"}>
            Browse
        </NavLink>
        <NavLink to="/post" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-slate-700 hover:text-primary"}>
            Post Food
        </NavLink>
        <NavLink to="/dashboard" className="text-slate-700 hover:text-primary">
            Dashboard
        </NavLink>
        
        {user && (
            <>
                <NavLink 
                    to="/notifications" 
                    className={({ isActive }) => isActive ? "text-primary font-medium flex items-center gap-1" : "text-slate-700 hover:text-primary flex items-center gap-1"}
                >
                    <FiBell /> Notifications
                </NavLink>
                <NavLink 
                    to="/messages" 
                    className={({ isActive }) => isActive ? "text-primary font-medium flex items-center gap-1" : "text-slate-700 hover:text-primary flex items-center gap-1"}
                >
                    <FiMessageCircle /> Messages
                </NavLink>
                <NavLink 
                    to="/history" 
                    className={({ isActive }) => isActive ? "text-primary font-medium flex items-center gap-1" : "text-slate-700 hover:text-primary flex items-center gap-1"}
                >
                    <FiClock /> History
                </NavLink>
            </>
        )}
    </>

    return (
        <div className="navbar bg-slate-500">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow gap-3">
                        {navBar}
                    </ul>
                </div>
                <Link to="/" className="flex items-center gap-2 ml-10">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">FW</div>
                    <div>
                        <h1 className="text-lg font-semibold">FoodShare</h1>
                        <p className="text-xs text-slate-900 -mt-1">Share safely · Reduce waste</p>
                    </div>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-6 font-semibold text-base">
                    {navBar}
                </ul>
            </div>
            <div className="navbar-end">
                <div className="md:hidden">
                </div>
                {
                    user ? (
                        <button
                            onClick={handleLogOut}
                            className="bg-blue-700 font-bold text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Log Out
                        </button>
                    ) : (
                        <div className="flex gap-3 ml-6">
                            <Link to="/login" state={{ from: location }} className="px-3 py-2 mr-10 bg-primary text-white rounded-md flex items-center gap-2">
                                <FiLogIn /> Login
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
};