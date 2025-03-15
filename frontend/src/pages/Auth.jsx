import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/api";
import "../styles/Auth.css";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = isLogin
        ? await loginUser({ email: formData.email, password: formData.password })
        : await registerUser({ email: formData.email, password: formData.password });

      if (response.error) {
        setError(response.error);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}
        <button type="submit" disabled={loading}>{loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}</button>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="auth-toggle" onClick={() => navigate(isLogin ? "/register" : "/login")}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;