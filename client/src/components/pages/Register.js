import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Register = () => {
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    localStorage.setItem("token", token);
  });

  const handleRegister = (e) => {
    e.preventDefault();

    const form = e.target;
    const user = {
      firstName: form[0].value,
      lastName: form[1].value,
      phone: form[2].value,
      email: form[3].value,
      password: form[4].value,
      repeatPass: form[5].value,
    };

    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        // auto login
        fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: user.email, password: user.password }),
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
      });
  };

  useEffect(() => {
    fetch("/isUserAuth", {
      headers: {
        "auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => (data.isLoggedIn ? history.push("/home") : null));
  }, []);

  return (
    <Container>
      <div className="contain">
        <div className="center">
          <div className="title">
            <img src="/images/logo.png" alt="" />
            <h1>Register</h1>
          </div>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Re-enter Password" />
            <button type="submit">Register</button>
          </form>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  .contain {
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .center {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    text-align: center;
  }
  img {
    width: 100px;
  }
  h1 {
    margin-top: 0;
  }

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .img {
      width: default;
    }
    h1 {
      margin: 20px 0 0;
    }
    .contain {
      background-color: #f0f0f0;
      width: 100%;
      height: auto;
      padding: 0;
    }
    .center {
      width: 80%;
      padding: 100px;
      justify-content: center;
      button {
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
  @media screen and (min-width: 900px) {
  } // 1 row = 2 fields
`;

export default Register;
