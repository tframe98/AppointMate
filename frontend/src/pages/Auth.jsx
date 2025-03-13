import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();   
    navigate("/dashboard"); 
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        {!isLogin && <input type="password" placeholder="Confirm Password" required />}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
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