import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import "./scroll.css"
import Task from "./task.jsx";

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 300px;
  height: 500px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid grey;
  scrollbar-color: #ccc #f4f5f7;
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const TaskList = styled.div`
  padding: 3px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
  flex-grow: 1;
`;

export default function Column({ title, tasks, id, updateTaskTitle, addTaskToColumn  }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = () => {
    if(newTaskTitle.trim() !== "") {
      addTaskToColumn (id, newTaskTitle);
      setNewTaskTitle("");
    }
  }

  const handleInputKeyDown = (e) => {
    if(e.key === "Enter") {
      handleAddTask();
    }
  }
  
  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: "lightblue",
          position: "stick",
          top: "0",
        }}
      >
        {title}
      </Title>

      <Droppable droppableId={id} key={id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks && tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                updateTask={updateTaskTitle}
              />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>

      <div>
        <input
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {handleInputKeyDown(e)}}
          />
          <button onClick={handleAddTask} style={{ width: "100px" }}>Add task</button>
      </div>
    </Container>
  );
}
