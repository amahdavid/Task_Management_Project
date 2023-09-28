import React, {useState} from "react";
import {DragDropContext} from "react-beautiful-dnd";
import Column from "./column.jsx";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);

  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddColumn = () => { 
    // create a new column with the title newColumnTitle
    const newCol = {
      title: newColumnTitle,
      tasks: [],
      id: columns.length + 1,
    };

    // add the new column to the columns array
    const updatedColumns = [...columns, newCol];

    // update the state
    setColumns(updatedColumns);

    // reset the newColumnTitle
    setNewColumnTitle("");
  }

  return (
    <DragDropContext>
      <h2 style={{textAlign: "center"}}>PROGRESS BOARD</h2>  

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title}
          tasks={column.tasks}
          id={column.id}
        />  
        ))}
      <div>
        <input
        type="text"
        placeholder="Enter column title"
        value={newColumnTitle}
        onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button onClick={handleAddColumn}>Add Column</button>
      </div>
      </div>

    </DragDropContext>
  );
}