import { Link, NavLink, useLocation } from "react-router-dom";
import { FiLogIn, FiLogOut, FiBell, FiMessageCircle, FiClock, FiMenu, FiX, FiHome, FiSearch, FiFeather } from "react-icons/fi";
import { useContext, useState } from "react";
// Assuming the path is correct for your context
import { AuthContext } from "../../firebase/Provider/AuthProviders";
// You might need to adjust this path based on your project structure

export const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

    // Accent color: emerald-500 (A vibrant green/teal for contrast)
    const ACCENT_COLOR_CLASSES = "text-emerald-500 font-bold";
    const BASE_TEXT_CLASSES = "text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out";
    const LOGOUT_BUTTON_CLASSES = "bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition duration-300 ease-in-out shadow-lg flex items-center gap-2";

    const handleLogOut = () => {
        logOut()
            .then(() => {
                console.log('logged out');
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    };

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-1 p-2 rounded-md transition duration-300 ease-in-out ${
            isActive ? ACCENT_COLOR_CLASSES : BASE_TEXT_CLASSES
        } ${
            // Add hover/focus styling for better UX
            !isActive && "hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        }`;
    
    // Extracted navigation links for reusability
    const navBar = (
        <>
            <NavLink to="/" className={navLinkClasses}>
                <FiHome className="h-5 w-5" aria-hidden="true" /> Home
            </NavLink>
            <NavLink to="/browse" className={navLinkClasses}>
                <FiSearch className="h-5 w-5" aria-hidden="true" /> Browse
            </NavLink>
            <NavLink to="/post" className={navLinkClasses}>
                <FiFeather className="h-5 w-5" aria-hidden="true" /> Post Food
            </NavLink>
            {/* Dashboard link needs the same active logic to be styled properly */}
            <NavLink to="/dashboard" className={navLinkClasses}>
                {/* Reusing a suitable icon for Dashboard/Profile */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> Dashboard
            </NavLink>
            
            {user && (
                <>
                    <NavLink to="/notifications" className={navLinkClasses}>
                        <FiBell className="h-5 w-5" aria-hidden="true" /> Notifications
                    </NavLink>
                    <NavLink to="/messages" className={navLinkClasses}>
                        <FiMessageCircle className="h-5 w-5" aria-hidden="true" /> Messages
                    </NavLink>
                    <NavLink to="/history" className={navLinkClasses}>
                        <FiClock className="h-5 w-5" aria-hidden="true" /> History
                    </NavLink>
                </>
            )}
        </>
    );

    return (
        <nav className="bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800" aria-label="Main Navigation">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand/Logo Section - Navbar Start */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2" aria-label="FoodShare Home">
                            {/* Logo: Simple, high-contrast text logo */}
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-gray-900 font-extrabold text-xl shadow-md">FS</div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wider">FoodShare</h1>
                                <p className="text-xs text-gray-400 -mt-1 font-medium">Share safely · Reduce waste</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links - Navbar Center */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="flex items-center space-x-4">
                            {navBar}
                        </div>
                    </div>

                    {/* User Actions - Navbar End */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            // Log Out button
                            <button
                                onClick={handleLogOut}
                                className={LOGOUT_BUTTON_CLASSES}
                                aria-label="Log out of the application"
                            >
                                <FiLogOut className="h-5 w-5" aria-hidden="true" /> Log Out
                            </button>
                        ) : (
                            // Login Link
                            <Link 
                                to="/login" 
                                state={{ from: location }} 
                                className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out flex items-center gap-2"
                            >
                                <FiLogIn className="h-5 w-5" aria-hidden="true" /> Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                                aria-controls="mobile-menu"
                                aria-expanded={isMenuOpen}
                                aria-label="Toggle navigation menu"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <FiX className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <FiMenu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
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