import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css'; // Import your CSS file for styling

const HomePage = ({ userEmail }) => {
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [boards, setBoards] = useState([]); // State variable to store boards

  const handleCreateBoard = () => {
    // Open the dialog for creating a new board
    setIsCreatingBoard(true);
  };

  const handleSubmitNewBoard = () => {
    // Send a request to create a new board with the provided board name and user email
    fetch('http://localhost:5000/create_board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ boardName: newBoardName, userEmail: userEmail }),
    })
      .then((response) => {
        if (response.status === 201) {
          // Board created successfully, you can close the dialog and update the UI as needed
          setIsCreatingBoard(false);
          setNewBoardName('');
          // After creating a board, you can fetch the updated list of boards
          fetchBoards();
        } else {
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating board:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error creating board:', error);
      });

    setIsCreatingBoard(false);
    setNewBoardName('');
  };

  const fetchBoards = () => {
    fetch(`http://localhost:5000/get_boards/${userEmail}`
    , {
      method: 'GET',
    })
      .then((response) => {
        if (response.status === 200) {
          // Handle the response here, e.g., update the boards state variable
          response.json().then((data) => {
            setBoards(data.boards);
          });
        } else {
          // Handle errors, e.g., display an error message to the user
          console.error('Error fetching boards:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error fetching boards:', error);
      });
  };

  useEffect(() => {
    // Fetch the user's boards when the component mounts
    fetchBoards();
  }, [userEmail]);

  return (
    <div className="homepage">
      <nav className="navbar">
        <button className="create-button" onClick={handleCreateBoard}>
          Create +
        </button>
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
            {/* Display your boards here */}
            <p>Welcome, {userEmail}!</p>
            <ul>
              {boards.map((board) => (
                <li key={board.board_id}>{board.board_name}</li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      {isCreatingBoard && (
        <div className="create-board-dialog">
          <h2>Create a New Board</h2>
          <input
            type="text"
            placeholder="Board Name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button onClick={handleSubmitNewBoard}>Create</button>
          <button onClick={() => setIsCreatingBoard(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
