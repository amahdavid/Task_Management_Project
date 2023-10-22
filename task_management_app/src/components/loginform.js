import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forms.css";

const LoginForm = ({ updateUserEmail }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginSuccess = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", formData.email);
    updateUserEmail(formData.email);
    navigate("/homepage");
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();
        const {access_token, email} = data;
        console.log("token: ", access_token);
        console.log("Login successful!");
        handleLoginSuccess(access_token, email);
      } else {
        console.log("Login failed.");
        alert("Inavlid email or password. Please try again.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Once validation passes, you can send this data to your server
  console.log("Login data:", formData);

  const handleChange = (event) => {
    const { name: email, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [email]: value,
      };
    });
  };

  return (
    <div className="outer-container">
      <div className="login-form">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className = "login_button" type="submit">Log In</button>

          <p>
            Don't have an account?<Link to="/signup">Sign Up</Link>
          </p>
          <p>continue with:</p>

          <div className="socialMedia">
            <button className="google-button">
              <i className="bi bi-google"></i>
              Sign Up with Google
            </button>
            <button className="apple-button">
              <i className="bi bi-apple"></i>
              Sign Up with Apple
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
