import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homepage.css'; // Import your CSS file for styling

const HomePage = () => {
  const [userEmail, setUserEmail]             = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName]       = useState('');
  const [boards, setBoards]                   = useState([]);

  const navigate = useNavigate();

  const handleCreateBoard = () => {
    setIsCreatingBoard(true);
  };

  const handleSubmitNewBoard = () => {
    fetch('http://localhost:5000/create_board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ boardName: newBoardName, userEmail: userEmail }),
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then((data) => {
            const newBoardId = data.board_id;
            navigate(`/kanban-board/${newBoardId}`);
          });
          setIsCreatingBoard(false);
          setNewBoardName('');
        } else {
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
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setBoards(data.boards);
          });
        } else {
          console.error('Error fetching boards:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error fetching boards:', error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');
    console.log("email: ", userEmail)
    if (token && userEmail) {
      setUserEmail(userEmail);

      fetchBoards();
    } else {
      navigate('/login');
    }
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
          <form onSubmit={handleSubmitNewBoard}>
          <input
            type="text"
            placeholder="Board Name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button onClick={handleSubmitNewBoard}>Create</button>
          <button onClick={() => setIsCreatingBoard(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
