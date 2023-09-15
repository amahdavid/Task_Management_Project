import React from "react";
import { Link } from "react-router-dom";
import "./forms.css";

const LandingPage = () => {
  return (
    <div className="outer-container">
      <div className="login-form">
        <h1>Task Management App</h1>
        <p>
          Welcome to the Task Management App! This app allows you to create
          tasks and assign them to users. You can also view tasks assigned to
          you. It can also be used as a simple to-do list.
        </p>
        <p>
          To get started, please <Link to="/signup">sign up</Link> or{" "}
          <Link to="/login">log in</Link>.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
