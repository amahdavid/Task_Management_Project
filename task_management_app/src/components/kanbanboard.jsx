import React, { useState, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./column.jsx";

export default function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Use a ref to scroll to the right when a new column is added
  const boardRef = useRef(null);

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

    // Close the column addition prompt
    setIsAddingColumn(false);

    // Scroll to the right when a new column is added
    if (boardRef.current) {
      boardRef.current.scrollLeft = boardRef.current.scrollWidth;
    }
  };

  return (
    <DragDropContext>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh", // Set a fixed height for the container
        }}
      >
        <div
          style={{
            display: "flex",
            overflowX: "auto", // Add horizontal scrollbar when columns overflow
          }}
          ref={boardRef}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: `${300 * columns.length}px`, // Set a fixed width for the container
              minWidth: "100%", // Ensure the container takes full width of the viewport
            }}
          >
            {columns.map((column) => (
              <div
                key={column.id}
                style={{
                  flex: "0 0 300px", // Set a fixed width for each column
                  minWidth: "300px", // Ensure a minimum width
                  margin: "0 8px", // Add margin between columns
                }}
              >
                <Column
                  title={column.title}
                  tasks={column.tasks}
                  id={column.id}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          {/* Button to show/hide the column addition prompt */}
          {!isAddingColumn ? (
            <button onClick={() => setIsAddingColumn(true)}>+ Add Column</button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Enter column title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                style={{ marginBottom: "4px", width: "100%" }}
              />
              <button onClick={handleAddColumn} style={{ width: "100px" }}>Add Column</button>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
