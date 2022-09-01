import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";

const Header = ({ title }) => {
  const history = useHistory();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token"));

  const checkInfo = () => {
    // redirect user if not affiliated with an organization
    if (
      user.organization === null &&
      (history.location.pathname === "/inspections/add" ||
        history.location.pathname === "/account/organization")
    ) {
      console.log(history.location.pathname.substr(0, 8));
      history.push("/account/organization");
    }
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
        if (data.isLoggedIn) {
          console.log(data.user);
          setUser(data.user);
          checkInfo();
        } else {
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  });

  return (
    // shows button to edit organization
    <Container>
      <div className="top">
        <div className="logo">
          <img src="/images/logo.png" alt="" />
          <h1 className="big">{title}</h1>
        </div>
        <div className="nav">
          <ul>
            <Link className="link" to="/">
              <div>
                <img src="/images/home.png" alt="" />
                <li>Home</li>
              </div>
            </Link>
            <Link className="link" to="/account">
              <div>
                <img src="/images/account.png" alt="" />
                <li>Account</li>
              </div>
            </Link>
          </ul>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  h1 {
    margin: 10px 0 0;
  }
  .top {
    padding: 5px 10px;
    display: flex;
  }
  .logo {
    padding-bottom: 8px;
    padding-top: 2px;
    display: flex;
    align-items: baseline;
    img {
      max-width: 100px;
      width: 70px;
      margin-right: 20px;
    }
    .big {
      margin: 0;
      color: #1c3f95;
    }
  }
  .nav {
    display: flex;
    flex: 1;
    justify-content: right;
    ul {
      display: flex;
      justify-content: space-around;
      margin: 0;
      .link {
        width: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #191414;
        transition: 0.4s;
        border-bottom: 3px solid transparent;
        div {
          text-align: center;
        }

        img {
          width: 35px;
          margin: 0;
        }
        li {
          font-weight: 600;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: row;
          font-size: 16px;
          list-style: none;
        }
      }
      .link:hover {
        border-bottom: 3px solid #0c71c3;
      }
    }
  }

  @media (max-width: 768px) {
    //mobile
    background-color: white;
    .big {
      display: none;
    }
    position: fixed;
    left: 0;
    bottom: 0;
    border-top: 5px solid #5d6d7e;
  }
  @media (min-width: 768px) {
    //desktops
    .big {
      display: inline-block;
    }
  }
`;

export default Header;
