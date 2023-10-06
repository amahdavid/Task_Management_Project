import React, { useState, useRef, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./column.jsx";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom

export default function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]); // Separate state for column titles
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [taskCounter, setTaskCounter] = useState(1);
  const [columnCounter, setColumnCounter] = useState(1);

  // Use a ref to scroll to the right when a new column is added
  const boardRef = useRef(null);
  // Get the board_id from the URL
  const { boardId } = useParams();

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get_columns/${boardId}`
        );
        const responseData = await response.json();
        setColumns(responseData.columns);
        setColumnTitles(responseData.column_names);
        setColumnCounter(responseData.columns.length + 1);
      } catch (err) {
        console.log(err);
      }
    };
    fetchColumns();
  }, [boardId]);

  const handleAddColumn = async () => {
    // create a new column with the title newColumnTitle
    if (newColumnTitle.trim() === "") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/create_column/${boardId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            columnName: newColumnTitle,
          }),
        }
      );

      if (response.status === 201) {
        const responseData = await response.json();
        const newColumn = {
          id: `column-${columnCounter}`,
          title: newColumnTitle,
          tasks: [],
        };
        setColumns([...columns, newColumn]);
        setColumnTitles([...columnTitles, newColumnTitle]);
      } else {
        console.log("Failed to add column");
      }
    } catch (err) {
      console.log(err);
    }
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddColumn();
    }
  };

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
          return { ...task, title: newTitle };
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
    const sourceColumnIndex = columns.findIndex(
      (column) => column.id === sourceColumnId
    );
    const destColumnIndex = columns.findIndex(
      (column) => column.id === destColumnId
    );

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
            {columns.map((column, index) => (
              <div
                key={column.id}
                style={{
                  flex: "0 0 300px", // Set a fixed width for each column
                  minWidth: "300px", // Ensure a minimum width
                  margin: "0 8px", // Add margin between columns
                }}
              >
                <Column
                  title={columnTitles[index]}
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
