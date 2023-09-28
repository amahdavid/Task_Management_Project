import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
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

const TextContent = styled.div``;

const icons = styled.div`
  display: flex;
  justify-content: end;
  padding: 2px;
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

export default function task({ task, index }) {
  return (
    <Draggable
      draggableId={`${task.id}`} key={task.id} index={index}>

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
                            {" "}
                        </small>
                    </span>
                </div>

                <div style={{display: "flex", justifyContent: "center", padding: 2}}>

                    <TextContent>{ task.title }</TextContent>

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
