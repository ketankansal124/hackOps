import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
        withCredentials: true, // Ensures cookies are sent/received
      });

      // Store token in browser cookie
      document.cookie = `token=${res.data.token}; path=/; secure; samesite=strict`;

      // Store role in a cookie as well
      document.cookie = `role=${res.data.role}; path=/; secure; samesite=strict`;

      // Redirect based on role
      if (res.data.role === "investor") {
        navigate("/investor/dashboard");
      } else {
        navigate("/startup/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
