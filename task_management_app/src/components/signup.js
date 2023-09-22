import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forms.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap icons CSS

const SignupForm = ({ updateUserEmail }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // client-side validation
    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
      formData.email
    );
    const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(
      formData.password
    );

    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isStrongPassword) {
      alert(
        "Password must be at least 8 characters long and include both letters and numbers."
      );
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
    };

    // Send the form data to the server
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      // If the response is successful, redirect to the home page
      .then((response) => {
        console.log("before if");
        if (response.status === 201) {
          updateUserEmail(formData.email);
          console.log("Sign up successful!");
          navigate("/homepage");
        }
      })

      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("Form data:", formData);
  };

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
      <div className="signup-form">
        <h1>Sign Up</h1>
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
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account?<Link to="/login">Login</Link>
        </p>
        <p>Or sign up with:</p>

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
      </div>
    </div>
  );
};

export default SignupForm;
