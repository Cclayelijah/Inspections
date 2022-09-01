import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

const UserDetails = ({ edit, user, handleLogout }) => {
  const history = useHistory();
  let type;
  if (user.userType === "client") type = "User";
  if (user.userType === "inspector") type = "Inspector";
  if (user.userType === "manager") type = "Manager";
  const since = dayjs(user.createdAt);
  //console.log(user);

  const myOrganization = () => {
    history.push("/account/organization");
  };

  // todo remove hardcoded organization

  return (
    <Container>
      <div className="top">
        <div className="left">
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <h4>{type} Account</h4>
        </div>
        <Link className="link" to="/login">
          <div className="right" onClick={handleLogout}>
            <img src="/images/logout.png" alt="" />
            <span>Logout</span>
          </div>
        </Link>
      </div>

      <div className="details">
        {user.userType === "client" ? (
          <div className="row">
            <h3 id="org">{user.organization ? user.organization : "No Organization"}</h3>
            <button onClick={myOrganization}>Manage Organization</button>
          </div>
        ) : null}

        <h3>
          Email: <span>{user.email}</span>
        </h3>
        <h3>
          Phone: <span>{user.phone}</span>
        </h3>
      </div>

      <div className="row">
        <button onClick={edit}>Edit User</button>
      </div>
      <div className="bottom">
        <span>Joined {since.format("MMMM DD, YYYY")}</span>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .left {
      display: flex;
      flex-direction: column;
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
      h1 {
        margin-bottom: 0;
      }
    }
    .link {
      display: flex;
      align-items: bottom;
      padding-right: 10px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
    img {
      width: 40px;
      height: 40px;
    }
  }
  .details {
    margin: 10px 0 0;
    text-align: center;
    .row {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    button {
      margin: 0;
      padding: 10px 20px;
    }
  }
  .bottom {
    padding-bottom: 115px;
    display: flex;
    flex-direction: column;
    flex: 1;
    align-self: center;
    justify-content: flex-end;
  }

  @media (min-width: 768px) {
    width: 60%;
    margin-right: auto;
    margin-left: auto;
  }
`;

export default UserDetails;
