import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, ChevronDown, Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate("/login");
  };

  const handleAdminPanel = () => {
    setIsUserDropdownOpen(false);
    navigate("/admin");
  };

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Real Estate Pro</div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${isOpen ? "block" : "hidden"} md:flex gap-8 absolute md:static top-16 left-0 right-0 md:top-auto bg-blue-600 md:bg-transparent p-4 md:p-0 items-center justify-between w-full md:w-auto`}>
          <ul className="flex flex-col md:flex-row gap-8 w-full md:w-auto">
            <li><a href="#home" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Home</a></li>
            <li><a href="#services" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Services</a></li>
            <li><a href="#projects" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Projects</a></li>
            <li><a href="#testimonials" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Testimonials</a></li>
            <li><a href="#contact" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Contact</a></li>
          </ul>

          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm">{username}</span>
                  <ChevronDown size={18} className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={handleAdminPanel}
                      className="w-full flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-gray-100 transition text-left"
                    >
                      <Layout size={18} />
                      <span>Admin Panel</span>
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hover:bg-blue-700 px-4 py-2 rounded transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
