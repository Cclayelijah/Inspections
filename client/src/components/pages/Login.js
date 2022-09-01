import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

const Login = () => {
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const input = { email: form[0].value, password: form[1].value };

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isLoggedIn) {
          setToken(data.token);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetch("/api/isUserAuth", {
      headers: {
        "auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //can't access login page when logged in
        if (data.isLoggedIn) {
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
  });

  return (
    <Container>
      <div className="contain">
        <div className="center">
          <img src="/images/logo.png" alt="" />
          <h1>Inspections</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <a href="/register">Sign-up</a>
          </p>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  .contain {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    background-color: #f0f0f0;
    .center {
      width: 80%;
      padding: 80px;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      .left {
        flex: 1;
      }
      .right {
        flex: 1;
      }
    }
  }
  @media (max-width: 768px) {
    .contain {
      width: auto;
      width: 100%;
      .center {
        padding: 10px;
        width: auto;
        background-color: white;
        h1 {
          margin-top: 50px;
        }
        p {
          margin-top: 50px;
        }
      }
    }
  }
`;

export default Login;
