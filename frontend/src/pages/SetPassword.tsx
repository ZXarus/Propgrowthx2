import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Lock } from "lucide-react";
import "../styles/authPage.css";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";
import { validateInvite } from "@/hooks/GenerateInvite";
import { useData } from "@/context/dataContext";

const SetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [con_password, setCon_Password] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inviteValid, setInviteValid] = useState(false);
  const [params] = useSearchParams();
  const inviteToken = params.get("token");
  const propId = params.get("propId");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!inviteToken) return;

    validateInvite(inviteToken)
      .then(() => {
        setInviteValid(true);
      })
      .catch(() => {
        setInviteValid(false);
      });
  }, [inviteToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  if (token) return null;

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <div className="auth-header">
          <Home size={32} color="#2563eb" />
        </div>

        <h2>Generate Account</h2>
        <h5>Enter your credentials</h5>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <div className="input-group">
          <User />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <Lock />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <Lock />
          <input
            type="password"
            placeholder="Confirm Password"
            value={con_password}
            onChange={(e) => setCon_Password(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        {
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Please wait..." : "Generate Account"}
          </button>
        }
      </form>
    </div>
  );
};

export default SetPassword;
