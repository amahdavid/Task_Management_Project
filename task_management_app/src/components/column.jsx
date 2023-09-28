import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import "./scroll.css"
import Task from "./task.jsx";

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 300px;
  height: 475px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid grey;
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
  min-height: 100px;
`;

export default function column({ title, tasks, id }) {
  
  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: "lightblue",
          position: "stick",
        }}
      >
        {title}
      </Title>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            <Task
              task={{id: 1, title: "Finish project", description: "This is task 1"}}
              index={0}
            ></Task>
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
