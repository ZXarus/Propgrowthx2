import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  return <p>Logging out...</p>;
};
