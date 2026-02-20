import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleHomeClick = () => {
    const token = sessionStorage.getItem("token");
    let roleRaw = sessionStorage.getItem("role");

    console.log("HOME CLICKED - Token:", token, "Role Raw:", roleRaw);

    if (!token) {
      // Not logged in - scroll to home
      const el = document.getElementById("home");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Parse role - it's stored as JSON {"role":"tenant"}
    let role = null;
    try {
      const parsed = JSON.parse(roleRaw);
      role = parsed.role; // Extract "tenant" or "owner" from the object
    } catch (e) {
      role = roleRaw; // Fallback if it's already a string
    }

    console.log("Parsed role:", role);

    // Logged in - navigate to dashboard based on role
    if (role === "tenant") {
      console.log("Navigating to /dashboard/tenant");
      window.location.href = "/dashboard/tenant";  // ✅ Changed from navigate() to window.location.href
    } else if (role === "owner") {
      console.log("Navigating to /dashboard-nav");
      window.location.href = "/dashboard-nav";  // ✅ Changed from navigate() to window.location.href
    } else {
      console.log("Unknown role:", role);
      window.location.href = "/";
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const token = sessionStorage.getItem("token");
  const id = sessionStorage.getItem("id");

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[calc(100%-32px)] max-w-6xl -translate-x-1/2 rounded-full border border-white/20 bg-white/60 backdrop-blur-xl shadow-lg">
      <style>
        {`
          @media (max-width: 768px) {
            .navbar-container {
              top: 16px !important;
              width: calc(100% - 24px) !important;
              padding: 12px 20px !important;
            }
            .navbar-logo {
              font-size: 16px !important;
            }
            .navbar-logo img {
              width: 32px !important;
              height: 32px !important;
            }
          }
          @media (max-width: 480px) {
            .navbar-container {
              top: 12px !important;
              width: calc(100% - 16px) !important;
              padding: 10px 16px !important;
            }
          }
        `}
      </style>

      <div className="navbar-container flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
          <img src="/logo.png" className="navbar-logo h-9 w-9" />
          <span className="navbar-logo text-lg font-semibold text-gray-800">
            PropGrowthX
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {/* HOME BUTTON */}
          {token && (
            <button
              onClick={handleHomeClick}
              className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
            >
              Home
            </button>
          )}

          {/* LANDING PAGE BUTTONS */}
          {!token && (
            <>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
              >
                How it Works
              </button>

              <button
                onClick={() => scrollToSection("features")}
                className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("get-started")}
                className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
              >
                Get Started
              </button>
            </>
          )}

          {/* SUPPORT & ABOUT */}
          <Link
            to="/contact"
            className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
          >
            Support
          </Link>
          <Link
            to="/about-us"
            className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
          >
            About Us
          </Link>

          {/* PROFILE */}
          {token && (
            <Link
              to={`/profile/${id}`}
              className="nav-link border-b-2 border-transparent hover:border-red-500 hover:text-red-600 transition"
            >
              Profile
            </Link>
          )}

          {/* LOGOUT */}
          {token && (
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/";
              }}
              className="flex items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}

          {/* SIGN UP */}
          {!token && (
            <Link to="/auth">
              <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 transition">
                Sign Up
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-6 py-6 space-y-1">
            {/* HOME */}
            {token && (
              <button
                onClick={() => {
                  handleHomeClick();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
              >
                Home
              </button>
            )}

            {/* LANDING BUTTONS */}
            {!token && (
              <>
                <button
                  onClick={() => {
                    scrollToSection("home");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
                >
                  Home
                </button>

                <button
                  onClick={() => {
                    scrollToSection("how-it-works");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
                >
                  How it Works
                </button>

                <button
                  onClick={() => {
                    scrollToSection("features");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
                >
                  Features
                </button>

                <button
                  onClick={() => {
                    scrollToSection("get-started");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
                >
                  Get Started
                </button>
              </>
            )}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
            >
              Support
            </Link>

            <Link
              to="/about-us"
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
            >
              About Us
            </Link>

            {token && (
              <>
                <Link
                  to={`/profile/${id}`}
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 font-medium"
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}

            {!token && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <button className="w-full rounded-lg bg-red-500 px-6 py-3 text-white font-semibold hover:bg-red-600 transition-all duration-200">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}