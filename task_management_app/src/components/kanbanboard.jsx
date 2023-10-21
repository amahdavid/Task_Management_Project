import React, { useState, useRef, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./column.jsx";
import { useParams } from "react-router-dom";

export default function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskTitles, setTaskTitles] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);

  const boardRef = useRef(null);
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
        setColumns(responseData.columns);
        setColumnTitles(responseData.column_names);
        setTasks(responseData.tasks);
        const storedColumnId = localStorage.getItem("columnId");
        if (storedColumnId) {
          setActiveColumnId(storedColumnId);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchColumns();
  }, [boardId]);

  const switchActiveColumn = (columnId) => {
    setActiveColumnId(columnId);
    localStorage.setItem("columnId", columnId);
};

  const handleAddColumn = async () => {
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
        console.log("Column id:", responseData.column_id);

        const newColumn = {
          id: responseData.column_id,
          title: newColumnTitle,
          tasks: [],
        };
        setColumns([...columns, newColumn]);
        setColumnTitles([...columnTitles, newColumnTitle]);
        setTasks(responseData.tasks);
        setTaskTitles(responseData.task_names);

        switchActiveColumn(responseData.column_id);
      } else {
        console.log("Failed to add column");
      }
    } catch (err) {
      console.log(err);
    }
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const addTaskToColumn = async (task) => {
    console.log("activeColumnId in addTaskToColumn:", activeColumnId);
    if (newTaskTitle.trim()) {
      console.log("No title");
    }
    try {
      const response = await fetch(
        `http://localhost:5000/create_task/${boardId}/${activeColumnId}`,
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
        const newTask = {
          id: responseData.task_id,
          task_name: task,
        };
        const targetColumnIndex = columns.findIndex(
          (column) => column._id === activeColumnId
        );
        if (targetColumnIndex === -1) {
          console.log("Target column not found");
          return;
        }
        const updatedColumns = [...columns];
        updatedColumns[targetColumnIndex].tasks.push(newTask);
        setColumns(updatedColumns);
      } else {
        console.log("Failed to add task");
      }
    } catch (err) {
      console.log(err);
    }
    setNewTaskTitle("");
    setIsAddingTask(false);
  };
  
  const updateTaskTitle = async (columnId, taskId, newTitle) => {
    try {
      console.log("Updating task title:", taskId, newTitle);
      const response = await fetch(
        `http://localhost:5000/update_task/${boardId}/${columnId}/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_name: newTitle,
          }),
        }
      );

      if (response.status === 200) {
        //const responseData = await response.json();
        const updatedColumns = columns.map((column) => {
          const updatedTasks = column.tasks.map((task) => {
            if (task._id === taskId) {
              return { ...task, task_name: newTitle };
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

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isAddingColumn) {
        handleAddColumn();
      } else if (isAddingTask) {
        if (editingTaskId) {
          const taskToUpdate = tasks.find((task) => task._id === editingTaskId);
          updateTaskTitle(taskToUpdate.columnId, editingTaskId, newTaskTitle);
          setEditingTaskId(null);
        } else {
          console.log("Adding new task to column:", activeColumnId);
          addTaskToColumn(newTaskTitle);
        }
      } else {
        console.log("No action to take");
      }
    }
  };

  const updateTaskPositionOnServer = async (
    taskId,
    oldColumnId,
    newColumnId,
    newPosition
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/update_task_position/${boardId}/${newColumnId}/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldColumnId,
            newColumnId,
            newPosition,
          }),
        }
      );
      if (response.status === 200) {
        console.log("Task position updated on the server.");
      } else {
        console.log("Failed to update task position on the server");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskDragEnd = (result) => {
    if (!result.destination) {
      console.log("No destination, nothing to do");
      return;
    }
    const sourceColumnId = result.source.droppableId;
    const destColumnId = result.destination.droppableId;

    const sourceColumnIndex = columns.findIndex(
      (column) => column._id === sourceColumnId
    );
    const destColumnIndex = columns.findIndex(
      (column) => column._id === destColumnId
    );
    if (sourceColumnIndex === -1 || destColumnIndex === -1) {
      console.log("Source or destination column not found");
      return;
    }
    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];
    const sourceTaskIndex = result.source.index;
    const destTaskIndex = result.destination.index;
    const taskToMove = sourceColumn.tasks[sourceTaskIndex];
    updateTaskPositionOnServer(
      taskToMove._id,
      sourceColumnId,
      destColumnId,
      destTaskIndex
    );
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
          height: "auto",
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
              width: `${300 * columns.length}px`,
              minWidth: "100%",
            }}
          >
            {columns.map((column, index) => (
              <div
                key={column._id}
                style={{
                  flex: "0 0 300px",
                  minWidth: "300px",
                  margin: "0 8px",
                }}
                onClick={() => setActiveColumnId(column._id)}
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
