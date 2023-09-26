import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./kanbanboard.css";

const initialBoard = {
  todo: [],
  inProgress: [],
  done: [],
};

const KanbanBoard = () => {
  const{boardId} = useParams();
  const [board, setBoard] = useState(initialBoard);
  const [newTaskText, setNewTaskText] = useState("");

  const addTask = (column, text) => {
    setBoard((prev) => {
      return {
        ...prev,
        [column]: [...prev[column], { id: Date.now(), text }],
      };
    });
    setNewTaskText("");
  };

  const updateTask = (column, taskId, newText) => {
    setBoard((prev) => {
      return {
        ...prev,
        [column]: prev[column].map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              text: newText,
            };
          }
          return task;
        }),
      };
    });
  };

  const moveTask = (taskId, from, to) => {
    const taskToMove = board[from].find((task) => task.id === taskId);
    const updatedFromColumn = board[from].filter((task) => task.id !== taskId);
    const updatedToColumn = [...board[to], taskToMove];

    setBoard((prev) => {
      return {
        ...prev,
        [from]: updatedFromColumn,
        [to]: updatedToColumn,
      };
    });
  };

  const deleteTask = (taskId, column) => {
    setBoard((prev) => {
      return {
        ...prev,
        [column]: prev[column].filter((task) => task.id !== taskId),
      };
    });
  };

  return (
    <div className="kanban-board">
      <div className="column">
        <h2>To Do</h2>
        <ul>
          {board.todo.map((task) => (
            <li key={task.id}>
              {task.text}
              <button
                onClick={() => updateTask("todo", task.id, "Updated Task")}
              >
                Update
              </button>
              <button onClick={() => deleteTask("todo", task.id)}>
                Delete
              </button>
              <button onClick={() => moveTask(task.id, "todo", "inProgress")}>
                Move to In Progress
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="New Task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button onClick={() => addTask("todo", newTaskText)}>Add Task</button>
      </div>
      {/* Similar code for "In Progress" and "Done" columns */}
    </div>
  );
};

export default KanbanBoard;
