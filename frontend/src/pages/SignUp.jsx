import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import { useAuth } from "../context/AuthContext"; 
import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const response = await registerUser(userData);

    if (response.success) {
      login(response.user, response.token);
      console.log("Redirecting to onboarding...");
      navigate("/onboarding");
    } else {
      console.error("Signup failed:", response.error);
    }
  };

  return (
    <div className="signup-container"> {/* ✅ Apply container class */}
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}> {/* ✅ Apply form class */}
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
};

export default SignUp;