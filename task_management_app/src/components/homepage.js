import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css'; // Import your CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <button className="create-button">Create +</button>
      </nav>
      <div className="content-container">
        <aside className="sidebar">
          <ul>
            <li>
                <Link to={"/boards"}>Boards</Link>
            </li>
            <li>
                <Link to={"/members"}>Members</Link>
            </li>
            <li>
                <Link to={"/calendar"}>Calendar</Link>
            </li>
            <li>
                <Link to={"/settings"}>Settings</Link>
            </li>
          </ul>
        </aside>
        <main className="main-content">
          <div className="content-header">
            <h1>Boards</h1>
          </div>
          <div className="content-body">
            {/* You can display your boards here */}
            <p>No boards created</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
