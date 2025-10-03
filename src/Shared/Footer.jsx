const Footer = () => {
  return (
    <footer className="bg-slate-500 text-gray-700 mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">

        {/* Branding */}
        <div>
          <h2 className="text-lg font-heading font-semibold text-teal-700 mb-2">FoodShare</h2>
          <p className="text-gray-950">Connecting surplus food with those who need it. Built for community impact.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="/browse" className="text-gray-950 hover:text-teal-700">Browse Food</a></li>
            <li><a href="/post" className="text-gray-950 hover:text-teal-700">Post Food</a></li>
            <li><a href="/dashboard" className="text-gray-950 hover:text-teal-700">Dashboard</a></li>
            <li><a href="/faq" className="text-gray-950 hover:text-teal-700">FAQ</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
          <p className="text-gray-950">Email: support@foodshare.org</p>
          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook" className="text-gray-950 hover:text-teal-700">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-950 hover:text-teal-700">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-950 hover:text-teal-700">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-950">
        © {new Date().getFullYear()} FoodShare. All rights reserved. | <a href="/privacy" className="hover:text-teal-700">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
