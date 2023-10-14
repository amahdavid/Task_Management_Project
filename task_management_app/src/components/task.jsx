import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import Icon from "./Icon.js";
import Avatar from "./Avatar.js";

const Container = styled.div`
  border-radius: 10px;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  margin-right: 10px;
  margin-left: 10px;
  background-color: ${(props) => bgcolorchange(props)};
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

function bgcolorchange(props) {
  return props.isDragging
    ? "skyblue"
    : props.isDragable
    ? props.isBacklog
      ? "lightblue"
      : "lightgreen"
    : props.isBacklog
    ? "lightblue"
    : "lightgreen";
}

export default function Task({ task, index, updateTask, columnId }) {
  const [taskTitle, setTaskTitle] = useState(task.task_name);
  const [isEditing, setIsEditing] = useState(false);

  const handleTaskTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (taskTitle !== task.task_name) {
      updateTask(columnId, task._id, taskTitle);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      updateTask(columnId, task.id, taskTitle);
      setIsEditing(false);
    }
  };

  return (
    <Draggable
      draggableId={`task-${task._id}`} key={task._id} index={index}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div style={{ display: "flex", justifyContent: "center", padding: 2 }}>
            {isEditing ? (
              <input
                type="text"
                value={taskTitle}
                onChange={handleTaskTitleChange}
                onBlur={handleBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
              />
            ) : (
              <div onClick={handleEditClick}>{task.task_name}</div>
            )}
          </div>
          <Icon>
            <div>
              <Avatar
                src={"https://wallpaperswide.com/adventure_time___finn-wallpapers.html" + task.id}
              />
            </div>
          </Icon>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}