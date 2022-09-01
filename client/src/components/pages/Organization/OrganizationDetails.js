import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import Info from "../../Info";

const OrganizationDetails = ({ user, edit, org, leaveOrganization }) => {
  let userType;
  if (user.userType === "client") userType = "User";
  if (user.userType === "inspector") userType = "Inspector";
  if (user.userType === "manager") userType = "Manager";
  //const since = dayjs(org.createdAt);
  let userList = [];

  const addUser = async () => {};

  const removeUser = async (id) => {};

  const handleFormChange = () => {};

  useEffect(() => {
    for (let id in org.users) {
      // todo
      const userInfo = {
        firstName: "first",
        lastName: "last",
      };
      userList.push(userInfo);
    }
  }, []);

  return (
    <>
      {userType === "User" ? (
        <Wrapper>
          <Container>
            <div className="main">
              <div className="top">
                <div className="left">
                  <div className="title">
                    <h2>{org.name}</h2>
                    <span>ID# {user.organization}</span>
                  </div>
                </div>
                <button onClick={edit}>Edit</button>
              </div>
              <div className="content">
                <h3>Address</h3>
                {org.address ? (
                  <p>
                    {org.address.address}
                    <br />
                    {org.address.city}, {org.address.state}, {org.address.zip}
                  </p>
                ) : null}
                <h3>Time Preference</h3>
                {org.timePreference ? <p>{org.timePreference}</p> : null}
                <h3>Website</h3>
                {org.website ? (
                  <p>
                    <a href={org.website}>{org.website}</a>
                  </p>
                ) : null}
              </div>
            </div>
            <div className="space"></div>
            <div className="panel">
              <div className="title">
                <h3>Primary Contact</h3>
                <hr />
              </div>
              {org.pendingUsers ? (
                <div className="title">
                  <h3>Requesting to Join</h3>
                  <hr />
                </div>
              ) : null}
              <div className="title">
                <h3>Users</h3>
                <hr />
              </div>
              <div id="users" className="users scrollbar">
                {org.users
                  ? userList.map((member, index) => {
                      if (member) {
                        return (
                          <div key={index} className="user">
                            <div className="left">
                              <p>
                                {member.firstName[0].toUpperCase() +
                                  member.firstName.substring(1)}{" "}
                                {member.lastName[0].toUpperCase() +
                                  member.lastName.substring(1)}
                              </p>
                            </div>
                            <div className="right">
                              <div
                                className="remove"
                                onClick={removeUser(index)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  : null}
              </div>
              <div className="add-user">
                <form onSubmit={addUser}>
                  <input
                    type="text"
                    id="user"
                    placeholder="Enter User ID..."
                    onChange={handleFormChange}
                  />
                  <button id="post" type="submit" disabled>
                    Add User
                  </button>
                </form>
              </div>
            </div>
          </Container>
        </Wrapper>
      ) : (
        <Info message="Your user account type does not allow you to have an organization." />
      )}
    </>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  @media (min-width: 768px) {
  }
  @media (min-width: 900px) {
    padding: 30px 100px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px 10px 105px;
  p {
    margin: 5px 0;
  }
  h2,
  h3 {
    margin: 0;
    color: #212f3d;
  }
  .top {
    margin: 10px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    .h2 {
      margin: 0;
    }
    .left {
      display: flex;
      align-items: flex-start;
      justify-content: left;
      gap: 10px;
      border-bottom: 3px solid transparent;
      border-image: linear-gradient(
        to bottom right,
        #000000 0%,
        #0daddd 40%,
        #1c3f95 75%,
        #191414 100%
      );
      border-image-slice: 1;
      padding-bottom: 10px;
    }

    button {
      padding: 10px 20px;
      margin: 0;
    }
  }
  .address {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .block {
    padding: 10px 0;
    display: flex;
  }
  .time {
    padding: 20px 0;
  }
  .content {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    p {
      margin-bottom: 20px;
      a {
        color: inherit;
      }
      a:hover {
        color: #0daddd;
      }
    }
  }
  .space {
    flex: 1;
  }
  .panel {
    background-color: #191414;
    color: white;
    border-radius: 10px;
    padding: 10px;
    max-height: 100%;
    justify-content: space-between;
    hr {
      border: 2px solid #5d6d7e;
      border-radius: 2px;
    }
    h3 {
      margin: 0 0 8px;
      color: white;
    }
    h4 {
      color: #0daddd;
    }
    p {
      margin: 0 0 2px;
    }
    .users {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      max-height: 250px;
      padding-right: 8px;
    }
    .user {
      display: flex;
      background-color: #212f3d;
      border: 1px solid white;
      border-radius: 7px;
    }
    .left,
    .right {
      padding: 5px 6px;
    }
    .left {
      width: 90px;
      border-right: 1px solid white;
    }
    .right {
      flex: 1;
    }
    .add-user {
      margin-top: 10px;
      form {
        display: flex;
        input {
          padding: 6px;
          border-radius: 7px;
        }
        button {
          margin: 0;
          height: 35px;
        }
        button:disabled {
          background-color: #5d6d7e;
        }
      }
    }
  }
  @media (min-width: 768px) {
    //desktop
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    flex-direction: row;
    .main {
      background-color: #f0f0f0;
      border-radius: 20px 0 0 20px;
      flex: 1;
      padding: 10px 50px 40px 40px;
      min-height: 400px;
    }
    .space {
      display: none;
    }
    .panel {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 30vw;
      min-width: 15rem;
      border-radius: 0 20px 20px 0;
      padding: 30px;
      h3 {
        margin-bottom: 20px;
      }
      .users {
        max-height: 40vh;
        flex: 1;
      }
      .add-user {
        form {
          margin: 0 0 10px;
          width: 100%;
          button {
            width: 100%;
          }
        }
      }
    }
  }
`;

export default OrganizationDetails;
