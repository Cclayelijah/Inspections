import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Panel from "./Panel";
import InProgress from "./Inspections/InProgress";
import Completed from "./Inspections/Completed";
import Canceled from "./Inspections/Canceled";

const Dashboard = () => {
  const [page, setPage] = useState("inProgress");
  const user = JSON.parse(localStorage.getItem("user"));

  const changePage = () => {
    setPage(document.getElementById("page").value);
  };


  let isManager = false;
  
  if (user){
    isManager = user.userType === "manager" ? true : (
      user.userType === "inspector" ? (
        user.isManager ? true : false
      ) : false
    );
  }

  return (
    <Container>
      <div className="main">
        <div className="inspections">
          <div className="top">
            <div className="left">
              <h1>Inspections</h1>
            </div>
            <div className="actions">
              <form onChange={changePage}>
                <select name="page" id="page">
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </form>
              {/* todo add viewType options */}
              <Link to={isManager ? "/inspections/new" : "/inspections/add"}>
                <div className="link">
                  <i className="far fa-plus-square"></i>
                </div>
              </Link>
            </div>
          </div>
          <hr />
          {page === "inProgress" ? <InProgress /> : null}
          {page === "completed" ? <Completed /> : null}
          {page === "canceled" ? <Canceled /> : null}
        </div>
        <Panel />
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 30px 100px;
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    min-height: 520px;
  }
  .inspections {
    overflow-x: hidden;
    flex-wrap: wrap;
    background-color: #f0f0f0;
    padding: 10px 50px 40px 40px;
    border-radius: 20px 0 0 20px;
    flex: 1;
    p {
      margin: 0;
      color: #5d6d7e;
    }
    h3 {
      color: #212f3d;
    }
    hr {
      background-color: #212f3d;
      margin: 0 0 30px;
      border: none;
      height: 3px;
    }
    .top {
      color: #5d6d7e;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        padding-right: 10px;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      form {
        margin: 2px 0 0;
        width: 150px;
        select {
          border: 3px solid #212f3d;
          padding: 4px;
          max-height: 2.5rem;
          color: #212f3d;
          transition: 0.2s;
        }
        select:hover {
          border: 3px solid #0daddd;
          transform: translate(0, -3px);
        }
      }
      h3 {
        display: inline-block;
        margin: 0;
      }
      .link {
        font-size: 2.5rem;
        color: #212f3d;
        transition: 0.2s;
      }
      .link:hover {
        color: #0daddd;
        transform: translate(0, -3px);
      }
      .line {
        flex: 1;
        border-bottom: 2px solid #0daddd;
      }
    }
    .list {
      margin-top: 10px;
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
      margin-bottom: 30px;
      .item {
        width: auto;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 0;
    .main {
      flex-direction: column;
      .inspections {
        border-radius: 0;
        padding: 10px 10px 30px;
      }
    }
  }
  @media (max-width: 986px) {
    .top {
      flex-direction: column;
      text-align: left;
      .left {
        width: 100%;
      }
      h1 {
        margin: 10px 0;
        width: 100%;
      }
      .actions {
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
      }
    }
    .list {
      gap: 0;
      justify-content: center;
    }
  }
`;

export default Dashboard;
