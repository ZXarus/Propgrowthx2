import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (
    location.pathname.includes("payments") ||
    location.pathname.includes("property")
  ) {
    return null;
  }

  return (
    <nav
      className="fixed z-50 left-1/2 -translate-x-1/2 
      top-3 sm:top-4 md:top-6
      w-[calc(100%-16px)] sm:w-[calc(100%-24px)] md:w-[calc(100%-32px)]
      max-w-6xl
      rounded-full border border-white/20 
      bg-white/60 backdrop-blur-xl shadow-lg"
    >
      <div
        className="flex items-center justify-between 
        px-4 sm:px-5 md:px-6 
        py-2 sm:py-3"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-8 w-8 sm:h-9 sm:w-9" alt="logo" />
          <span className="text-base sm:text-lg font-semibold text-gray-800">
            PropGrowthX
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("home")}
            className="nav-Navlink"
          >
            Home
          </button>

          {token && (
            <NavLink to={`/dashboard/${role}`} className="nav-Navlink">
              Manage Properties
            </NavLink>
          )}

          {!token && (
            <>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="nav-Navlink"
              >
                How it Works
              </button>

              <button
                onClick={() => scrollToSection("features")}
                className="nav-Navlink"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("pricing")}
                className="nav-Navlink"
              >
                Pricing
              </button>
            </>
          )}

          <NavLink to="/contact" className="nav-Navlink">
            Support
          </NavLink>

          {token && (
            <NavLink to="/profile" className="nav-Navlink">
              Profile
            </NavLink>
          )}

          {token && (
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/";
              }}
              className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        {/* Sign Up (Desktop Only) */}
        {!token && (
          <div className="hidden lg:block">
            <NavLink to="/auth">
              <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 transition">
                Sign Up
              </button>
            </NavLink>
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-gray-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-6 py-6 space-y-1">
            <button
              onClick={() => {
                scrollToSection("home");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
            >
              Home
            </button>

            {token && (
              <NavLink
                to={`/dashboard/${role}`}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
              >
                Manage Properties
              </NavLink>
            )}

            {!token && (
              <>
                <button
                  onClick={() => {
                    scrollToSection("how-it-works");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
                >
                  How it Works
                </button>

                <button
                  onClick={() => {
                    scrollToSection("features");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
                >
                  Features
                </button>

                <button
                  onClick={() => {
                    scrollToSection("pricing");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
                >
                  Pricing
                </button>
              </>
            )}

            <NavLink
              to="/contact"
              className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
            >
              Support
            </NavLink>

            {token && (
              <>
                <NavLink
                  to="/profile"
                  className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition font-medium"
                >
                  Profile
                </NavLink>

                <button
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}

            {!token && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <NavLink to="/auth" onClick={() => setOpen(false)}>
                  <button className="w-full rounded-lg bg-red-500 px-6 py-3 text-white font-semibold hover:bg-red-600 transition">
                    Sign Up
                  </button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
