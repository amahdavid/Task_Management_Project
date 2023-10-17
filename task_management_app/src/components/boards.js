import React, { useState, useEffect } from "react";
import "./board.css"; // Import your CSS file

const randomImageURLs = [
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/301",
  "https://picsum.photos/200/302",
];

const getRandomImageURL = () => {
  const randomIndex = Math.floor(Math.random() * randomImageURLs.length);
  return randomImageURLs[randomIndex];
};

const Boards = () => {
  const userEmail = localStorage.getItem("email");
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // Fetch the user's boards data from your API
    fetch(`http://localhost:5000/get_boards/${userEmail}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          // Handle the response here, e.g., update the boards state variable
          response.json().then((data) => {
            setBoards(data.boards);
          });
        } else {
          // Handle errors, e.g., display an error message to the user
          console.error("Error fetching boards:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error fetching boards:", error);
      });
  }, [userEmail]);

  return (
    <div className="boards-container">
      <h1>Boards</h1>
      <ul className="board-list">
        {boards.map((board) => (
          <li key={board.board_id} className="board-item">
            <a href={`/kanban-board/${board.board_id}`} className="board-link">
              <img
                src={getRandomImageURL()}
                alt="placeholder"
                className="board-image"
              />
              {board.board_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Boards;
