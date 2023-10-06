import React, { useState } from "react";
import LoginForm from "./components/loginform";
import SignupForm from "./components/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landingpage";
import Homepage from "./components/homepage";
import Boards from "./components/boards";
import Members from "./components/members";
import Calendar from "./components/calendar";
import Settings from "./components/settings";
import KanbanBoard from "./components/kanbanboard";

function App() {
  const [userEmail, setUserEmail] = useState(""); // Initialize userEmail state

  // Function to set userEmail when a user logs in or signs up
  const updateUserEmail = (email) => {
    setUserEmail(email);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage userEmail={userEmail} />} // Pass userEmail as a prop
        />
        <Route
          path="/login"
          element={<LoginForm updateUserEmail={updateUserEmail} />} // Pass updateUserEmail as a prop
        />
        <Route
          path="/signup"
          element={<SignupForm updateUserEmail={updateUserEmail} />} // Pass updateUserEmail as a prop
        />
        <Route
          path="/homepage"
          element={<Homepage userEmail={userEmail} />} // Pass userEmail as a prop
        />
        <Route 
          path="/boards" 
          element={<Boards userEmail={userEmail} />} />
        <Route path="/kanban-board/:boardId" element={<KanbanBoard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
