import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "owner" | "tenant";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<Role>("owner");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOGIN / REGISTER ================= */
  const handleLoginRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin
      ? "http://localhost:6876/api/auth/login"
      : "http://localhost:6876/api/auth/register";

    try {
      const res = await fetch(url, {
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

  /* ================= SEND OTP ================= */
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

      alert("Your OTP: " + data.otp); // DEV ONLY
      setShowOtp(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
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

      alert("OTP Verified Successfully");
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
          body: JSON.stringify({
            email,
            password: newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Password updated successfully");

      // reset UI
      setShowForgot(false);
      setShowResetPassword(false);
      setEmail("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLoginRegister}
        style={{ width: 350, padding: 30, background: "#fff" }}
      >
        <h2>
          {showForgot ? "Forgot Password" : isLogin ? "Login" : "Register"}
        </h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!showForgot && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {!showForgot && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
          </select>
        )}

        {!showForgot && (
          <button type="submit">
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        )}

        {showForgot && !showOtp && !showResetPassword && (
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {showOtp && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" onClick={verifyOtpHandler}>
              Verify OTP
            </button>
          </>
        )}

        {showResetPassword && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" onClick={updatePasswordHandler}>
              Update Password
            </button>
          </>
        )}

        {!showForgot && (
          <p
            onClick={() => setShowForgot(true)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Forgot Password?
          </p>
        )}

        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
          {isLogin ? "Register" : "Login"}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
