import React, { useState, useEffect } from "react";

const Boards = ({ userEmail }) => {
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
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <div>
      <h1>Boards</h1>
      <ul>
        {boards.map((board) => (
          <li key={board.board_id}>
            {/* You can make each board clickable and navigate to its Kanban board */}
            <a href={`/kanban-board/${board.board_id}`}>{board.board_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Boards;
