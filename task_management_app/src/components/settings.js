import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forms.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap icons CSS

const SettingsForm = ({ updateUserEmail }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Client-side validation
    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
      formData.email
    );
    const isStrongPassword = isPasswordStrong(formData.password);

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

    // Send the updated email and password to the server
    // You should implement the server-side logic for updating email and password
    console.log("Updated Email:", formData.email);
    console.log("Updated Password:", formData.password);
  };

  const isPasswordStrong = (password) => {
    // Basic example: check if the password length is greater than 8 characters and contains both letters and numbers
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(password);
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
      <div className="settings-form">
        <h1>Account Settings</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="New Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {isPasswordStrong(formData.password) || !formData.password ? (
            <p>Password is strong enough</p>
          ) : (
            <p style={{ color: "red" }}>
              Password is not strong enough
            </p>
          )}
          <button className = "login_button" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
