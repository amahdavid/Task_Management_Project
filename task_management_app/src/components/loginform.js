import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./loginform.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Perform login validation and submit data to the server here

    // Once validation passes, you can send this data to your server
    console.log("Login data:", formData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
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
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Log In</button>

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
