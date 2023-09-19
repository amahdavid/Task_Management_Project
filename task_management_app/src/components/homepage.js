import React from 'react';
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
            <li>Boards</li>
            <li>Members</li>
            <li>Calendar</li>
            <li>Settings</li>
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
