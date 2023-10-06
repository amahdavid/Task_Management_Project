import React, { useState, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./column.jsx";

export default function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [taskCounter, setTaskCounter] = useState(1);
  const [columnCounter, setColumnCounter] = useState(1);

  // Use a ref to scroll to the right when a new column is added
  const boardRef = useRef(null);

  const handleAddColumn = () => {
    // create a new column with the title newColumnTitle
    if (newColumnTitle.trim() === "") {
      return;
    }
  
    // Check if a column with the same title already exists
    const columnExists = columns.some((column) => column.title === newColumnTitle);
  
    // Create a unique column title
    let uniqueColumnTitle = newColumnTitle;
    let counter = 2;
    while (columnExists) {
      uniqueColumnTitle = `${newColumnTitle} (${counter})`;
      columnExists = columns.some((column) => column.title === uniqueColumnTitle);
      counter++;
    }
  
    // Create a new column with the unique title
    const newCol = {
      title: uniqueColumnTitle,
      tasks: [],
      id: `column-${columnCounter}`,
    };
  
    // Increment the column counter
    setColumnCounter(columnCounter + 1);
  
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
  
  const handleInputKeyDown = (e) => {
    if(e.key === "Enter") {
      handleAddColumn();
    }
  }

  // Function to add a task to a specific column
  const addTaskToColumn = (columnId, task) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const newTask = {
          id: `task-${taskCounter}`,
          title: task,
        };
        column.tasks.push(newTask);
      }
      return column;
    });
    setTaskCounter(taskCounter + 1);
    setColumns(updatedColumns);
  };

  // Function to update tastk title
  const updateTaskTitle = (taskId, newTitle) => {
    const updatedColumns = columns.map((column) => {
      column.tasks = column.tasks.map((task) => {
        if (task.id === taskId) {
          return {...task, title: newTitle};
        }
        return task;
      });
      return column;
    });
    setColumns(updatedColumns);
  };

  const handleTaskDragEnd = (result) => {
    if (!result.destination) {
      console.log("No destination, nothing to do");
      return; // No destination, nothing to do
    }
  
    // Get the source and destination column IDs
    const sourceColumnId = result.source.droppableId;
    const destColumnId = result.destination.droppableId;
  
    // Find the source and destination columns
    const sourceColumnIndex = columns.findIndex((column) => column.id === sourceColumnId);
    const destColumnIndex = columns.findIndex((column) => column.id === destColumnId);
  
    // Check if the source and destination columns exist
    if (sourceColumnIndex === -1 || destColumnIndex === -1) {
      console.log("Source or destination column not found");
      return; // Handle the case where the columns don't exist
    }
  
    // Get the source and destination columns using their indices
    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];
  
    // Get the source and destination task indices
    const sourceTaskIndex = result.source.index;
    const destTaskIndex = result.destination.index;
  
    // Get the task to move
    const taskToMove = sourceColumn.tasks[sourceTaskIndex];
  
    // Remove the task from the source column
    sourceColumn.tasks.splice(sourceTaskIndex, 1);
  
    // Add the task to the destination column
    destColumn.tasks.splice(destTaskIndex, 0, taskToMove);
  
    // Create a copy of the columns array with the updates
    const updatedColumns = [...columns];
  
    // Update the state with the new columns array
    setColumns(updatedColumns);
  };
  
  return (
    <DragDropContext onDragEnd={handleTaskDragEnd}>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "auto", // Set a fixed height for the container
        }}
      >
        <div
          style={{
            display: "flex",
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
                  addTaskToColumn={addTaskToColumn}
                  updateTaskTitle={updateTaskTitle}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          {/* Button to show/hide the column addition prompt */}
          {!isAddingColumn ? (
            <button onClick={() => setIsAddingColumn(true)}>
              + Add Column
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Enter column title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={{ marginBottom: "4px", width: "100%" }}
              />
              <button onClick={handleAddColumn} style={{ width: "100px" }}>
                Add Column
              </button>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
