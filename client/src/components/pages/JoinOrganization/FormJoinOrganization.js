import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Form = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const organization = document.querySelector('[name="organization"]').value;

    fetch("/api/client/organization/join", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: organization,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("/isUserAuth", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isLoggedIn) history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <Container>Search</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .contain {
    padding: 10px;
    #time {
      align-items: center;
      .right {
        display: flex;
        flex: 1;
        justify-content: right;
        gap: 10px;
      }
      .choose {
        display: flex;
        align-items: center;
        height: 50px;
        input {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;

export default Form;
