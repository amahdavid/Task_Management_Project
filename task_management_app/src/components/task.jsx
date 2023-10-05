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
  min-height: 90px;
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

export default function Task({ task, index, updateTask }) {

  const [taskTitle, setTaskTitle] = useState(task.title);

  const handleTaskTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  useEffect(() => {
    console.log("Task state has been updated:", taskTitle);
  }, [taskTitle]);


  return (
    <Draggable
      draggableId={`task-${task.id}`} key={task.id} index={index}>

        {(provided, snapshot) => (
            <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
                // isDragable={task.isDragable}
                // isBacklog={task.isBacklog}
            >
                <div style={{display: "flex", justifyContent: "start", padding: 2}}>
                    <span>
                        <small>
                            #{task.id}
                        </small>
                    </span>
                </div>

                <div style={{display: "flex", justifyContent: "center", padding: 2}}>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={handleTaskTitleChange}
                    onBlur={() => updateTask(task.id, taskTitle)}
                  />
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
