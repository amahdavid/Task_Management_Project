import React, { useState, useRef, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./column.jsx";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom

export default function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]); // Separate state for column titles
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskTitles, setTaskTitles] = useState([]); // Separate state for task titles
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
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
        if (!response.ok) {
          throw new Error("Failed to fetch columns");
        }

        const responseData = await response.json();

        if (!responseData.columns) {
          throw new Error("Failed to fetch columns");
        }

        console.log("Response data:", responseData);
        setColumns(responseData.columns);
        setColumnTitles(responseData.column_names);
        setTasks(responseData.tasks);
        setTaskTitles(responseData.task_names);
      } catch (err) {
        console.error(err);
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
        console.log("Response data:", responseData);
        const newColumn = {
          id: `column-${columnCounter}`,
          title: newColumnTitle,
          tasks: [],
        };
        setColumns([...columns, newColumn]);
        setColumnTitles([...columnTitles, newColumnTitle]);
        setTasks(responseData.tasks)
        setTaskTitles(responseData.task_names)
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
  const addTaskToColumn = async (columnId, task) => {
    if (task.trim() === "") {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/create_task/${boardId}/${columnId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskTitle: task,
          }),
        }
      );
  
      if (response.status === 201) {
        const responseData = await response.json();
        console.log("Response data (Add Task):", responseData);
  
        // Create a new task object
        const newTask = {
          id: responseData.task_id,
          title: responseData.task_title,
        };
  
        // Find the target column to add the task
        const targetColumnIndex = columns.findIndex(
          (column) => column._id === columnId
        );
  
        if (targetColumnIndex === -1) {
          console.log("Target column not found");
          return;
        }
  
        // Create a copy of the columns array
        const updatedColumns = [...columns];
        // Append the new task to the target column's tasks array
        updatedColumns[targetColumnIndex].tasks.push(newTask);
  
        // Update the state with the new columns array
        setColumns(updatedColumns);

        setTasks(responseData.tasks)
      } else {
        console.log("Failed to add task");
      }
    } catch (err) {
      console.log(err);
    }
    setNewTaskTitle("");
    setIsAddingTask(false);
  };
  

  useEffect(() => {
    console.log("Updated columns:", columns);
  }, [columns]);

  // Function to update tastk title
  const updateTaskTitle = async (taskId, columnId, newTitle) => {
    try {
      console.log("Updating task title:", taskId, newTitle);

      // make a put request to update the task title
      const response = await fetch(
        `http://localhost:5000/update_task/${boardId}/${columnId}/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskTitle: newTitle,
          }),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        // update the columns state wit the new task
        const updatedColumns = columns.map((column) => {
          const updatedTasks = column.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, title: newTitle };
            }
            return task;
          });
          return { ...column, tasks: updatedTasks };
        });

        setColumns(updatedColumns);
      } else {
        console.log("Failed to update task title");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskDragEnd = (result) => {
    if (!result.destination) {
      console.log("No destination, nothing to do");
      return; // No destination, nothing to do
    }
    const sourceColumnId = result.source.droppableId;
    const destColumnId = result.destination.droppableId;

    const sourceColumnIndex = columns.findIndex(
      (column) => column.id === sourceColumnId
    );
    const destColumnIndex = columns.findIndex(
      (column) => column.id === destColumnId
    );
    if (sourceColumnIndex === -1 || destColumnIndex === -1) {
      console.log("Source or destination column not found");
      return; // Handle the case where the columns don't exist
    }
    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];
    const sourceTaskIndex = result.source.index;
    const destTaskIndex = result.destination.index;
    const taskToMove = sourceColumn.tasks[sourceTaskIndex];
    sourceColumn.tasks.splice(sourceTaskIndex, 1);
    destColumn.tasks.splice(destTaskIndex, 0, taskToMove);
    const updatedColumns = [...columns];
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
                key={column._id}
                style={{
                  flex: "0 0 300px", // Set a fixed width for each column
                  minWidth: "300px", // Ensure a minimum width
                  margin: "0 8px", // Add margin between columns
                }}
              >
                <Column
                  title={columnTitles[index]}
                  tasks={column.tasks}
                  id={column._id}
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
