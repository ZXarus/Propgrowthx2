import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Lock, UserCogIcon, Eye, EyeOff } from "lucide-react";
import "../styles/authPage.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("owner");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:6876/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.setItem("token", data.token);
      navigate(role === "owner" ? "/dashboard_owner" : "/dashboard_tenant");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:6876/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Registration successful. Please login.");
      setIsLogin(true);
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:6876/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowOtp(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:6876/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowOtp(false);
      setShowResetPassword(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePasswordHandler = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:6876/api/auth/update-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Password updated successfully");

      setShowForgot(false);
      setShowResetPassword(false);
      setIsLogin(true);
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={isLogin ? handleLogin : handleRegister}
      >
        <div className="auth-header">
          <UserCogIcon size={32} />
          <h2>
            {showForgot ? "Forgot Password" : isLogin ? "Login" : "Register"}
          </h2>
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* EMAIL */}
        <div className="input-group">
          <User size={18} />
          <input
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        {!showForgot && (
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <EyeOff onClick={() => setShowPassword(false)} cursor="pointer" />
            ) : (
              <Eye onClick={() => setShowPassword(true)} cursor="pointer" />
            )}
          </div>
        )}

        {/* ROLE */}
        {!showForgot && (
          <div className="input-group">
            <Home size={18} />
            <select
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="owner">Owner</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
        )}

        {/* LOGIN / REGISTER BUTTON */}
        {!showForgot && (
          <button className="auth-btn" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        )}

        {/* FORGOT PASSWORD */}
        {!showForgot && (
          <p className="forgot-password" onClick={() => setShowForgot(true)}>
            Forgot Password?
          </p>
        )}

        {/* SEND OTP */}
        {showForgot && !showOtp && !showResetPassword && (
          <button className="auth-btn" onClick={sendOtp} type="button">
            Send OTP
          </button>
        )}

        {/* VERIFY OTP */}
        {showOtp && (
          <>
            <input
              className="auth-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="auth-btn"
              onClick={verifyOtpHandler}
              type="button"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* RESET PASSWORD */}
        {showResetPassword && (
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showNewPassword ? "text" : "password"}
              className="auth-input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {showNewPassword ? (
              <EyeOff
                onClick={() => setShowNewPassword(false)}
                cursor="pointer"
              />
            ) : (
              <Eye onClick={() => setShowNewPassword(true)} cursor="pointer" />
            )}
            <button
              className="auth-btn"
              onClick={updatePasswordHandler}
              type="button"
            >
              Update Password
            </button>
          </div>
        )}

        {/* SWITCH LOGIN / REGISTER */}
        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="switch-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setShowForgot(false);
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
