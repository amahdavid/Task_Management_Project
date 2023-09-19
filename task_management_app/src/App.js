import LoginForm from "./components/loginform";
import React from "react";
import SignupForm from "./components/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landingpage";
import Homepage from "./components/homepage";
import Boards from "./components/boards";
import Members from "./components/members";
import Calendar from "./components/calendar";
import Settings from "./components/settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/members" element={<Members />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
