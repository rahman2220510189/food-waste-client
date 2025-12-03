import React from 'react'
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';

const MyFooter = () => {
  const ACCENT_COLOR_CLASSES = "text-emerald-500 hover:text-emerald-400 transition duration-300";
    const BASE_TEXT_CLASSES = "text-gray-400 hover:text-white transition duration-300";

    return (
        <footer className="bg-gray-900 border-t border-gray-800" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* 1. Logo and Brand Info */}
                    <div className="space-y-8 xl:col-span-1">
                        <Link to="/" className="flex items-center gap-3">
                            {/* Logo: Simple, high-contrast text logo */}
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-gray-900 font-extrabold text-xl shadow-md">FS</div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-wider">FoodShare</h3>
                                <p className="text-sm text-gray-400 font-medium">Sharing food, reducing waste.</p>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-base max-w-md">
                            Dedicated to connecting local communities to share surplus food safely and sustainably.
                        </p>
                        <div className="flex space-x-6">
                            <a href="https://facebook.com" className={ACCENT_COLOR_CLASSES} aria-label="Facebook">
                                <FiFacebook className="h-6 w-6" />
                            </a>
                            <a href="https://instagram.com" className={ACCENT_COLOR_CLASSES} aria-label="Instagram">
                                <FiInstagram className="h-6 w-6" />
                            </a>
                            <a href="https://twitter.com" className={ACCENT_COLOR_CLASSES} aria-label="Twitter">
                                <FiTwitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* 2. Quick Links Section */}
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white tracking-wider uppercase">
                                    Quick Links
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    <li><Link to="/browse" className={BASE_TEXT_CLASSES}>Browse Food</Link></li>
                                    <li><Link to="/post" className={BASE_TEXT_CLASSES}>Post Food</Link></li>
                                    <li><Link to="/dashboard" className={BASE_TEXT_CLASSES}>Dashboard</Link></li>
                                    <li><Link to="/about" className={BASE_TEXT_CLASSES}>About Us</Link></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-lg font-semibold text-white tracking-wider uppercase">
                                    Support
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    <li><Link to="/contact" className={BASE_TEXT_CLASSES}>Contact</Link></li>
                                    <li><Link to="/faq" className={BASE_TEXT_CLASSES}>FAQ</Link></li>
                                    <li><Link to="/privacy" className={BASE_TEXT_CLASSES}>Privacy Policy</Link></li>
                                    <li><Link to="/terms" className={BASE_TEXT_CLASSES}>Terms of Service</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Contact and Newsletter (Combined for mobile layout) */}
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-lg font-semibold text-white tracking-wider uppercase">
                                Stay Connected
                            </h3>
                            <div className="mt-4 space-y-4">
                                <p className="flex items-center gap-2 text-gray-400">
                                    <FiMail className="h-5 w-5 text-emerald-500" />
                                    <a href="mailto:support@foodshare.com" className={BASE_TEXT_CLASSES}>support@foodshare.com</a>
                                </p>
                                <p className="flex items-center gap-2 text-gray-400">
                                    <FiPhone className="h-5 w-5 text-emerald-500" />
                                    <a href="tel:+1234567890" className={BASE_TEXT_CLASSES}>+1 (234) 567-890</a>
                                </p>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-white tracking-wider uppercase mt-8">
                                Newsletter
                            </h3>
                            <p className="mt-4 text-gray-400">
                                Subscribe for updates on food sharing events.
                            </p>
                            <form className="mt-4 sm:flex sm:max-w-md">
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email-address"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full min-w-0 appearance-none rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:max-w-xs"
                                    placeholder="Enter your email"
                                />
                                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8">
                    <p className="text-base text-gray-500 xl:text-center">
                        &copy; {new Date().getFullYear()} FoodShare. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default MyFooter
