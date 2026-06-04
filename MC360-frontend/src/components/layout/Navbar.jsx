import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-lg font-bold text-blue-700">MedConnect<span className="text-gray-800">360</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/doctors" className="hover:text-blue-600 transition">Doctors</Link>
            <Link to="/services" className="hover:text-blue-600 transition">Services</Link>
            <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/dashboard")} className="text-sm text-gray-600 hover:text-blue-600 font-medium">Dashboard</button>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-600 font-medium">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Sign In</Link>
                <Link to="/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm font-medium text-gray-700">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Home</Link>
          <Link to="/doctors" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Doctors</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Services</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">About</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Dashboard</Link>
              <button onClick={onLogout} className="block text-red-500 hover:text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-blue-600 font-semibold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;