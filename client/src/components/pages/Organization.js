import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Header from "../Header";

const Organization = () => {
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const register = () => {
    history.push("/account/organization/register");
  };

  const join = () => {
    history.push("/account/organization/join");
  };

  if (!user.organization) {
    // setup org
    // todo finish setting up join org; version 1?
    return (
      <Container>
        <Header title="Account" mobileTitle={false} />
        <div className="content">
          <h1>Finish Setting up your organization</h1>
          <div className="container">
            <button onClick={register}>New</button>
            {/* <button onClick={join}>Join</button> */}
          </div>
        </div>
      </Container>
    );
  } else {
    // display org
    return <p>My Organization</p>;
  }
};

const Container = styled.div`
  h1 {
    text-align: center;
  }
  .content {
    padding: 10px;
  }
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  button {
    width: 200px;
  }

  @media (min-width: 768px) {
  }
`;

export default Organization;
