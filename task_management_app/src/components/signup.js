import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./signupform.css";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons CSS

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Perform validation and submit data to the server here

    // Once validation passes, you can send this data to your server
    console.log("Form data:", formData);
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
      <div className="signup-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>

        <p>Already have an account?<Link to="/">Login</Link></p>
        <p>Or sign up with:</p>

        <div className="socialMedia"> 
        <button className="google-button">
          <i className="bi bi-google"></i>
          Sign Up with Google
          </button>
        <button className="apple-button">
          <i className="bi bi-apple"></i>
          Sign Up with Apple</button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
