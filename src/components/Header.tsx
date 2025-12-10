import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

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
    navigate("/login");
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
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
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
