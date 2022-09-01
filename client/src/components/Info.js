import React from "react";
import styled from "styled-components";

const Info = ({ message }) => {
  return (
    <Container>
      <p>{message}</p>
    </Container>
  );
};

const Container = styled.div`
  color: #5d6d7e;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

export default Info;
