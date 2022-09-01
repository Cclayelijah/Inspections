import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import Header from "../../Header";
import Info from "../../Info";
import UserDetails from "./UserDetails";
import EditUserDetails from "./EditUserDetails";

const Account = () => {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/login");
  };

  const edit = () => {
    setEditing(true);
  };
  const editCancel = (e) => {
    e.preventDefault();
    setEditing(false);
  };
  const editSave = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone } = e.target.elements;
    const update = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
    };

    fetch("/api/account/update", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(update),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        let newUser = user;
        newUser.firstName = data.value.firstName;
        newUser.lastName = data.value.lastName;
        newUser.email = data.value.email;
        setUser(newUser);
        setEditing(false);
      })
      .catch((err) => console.log(err));
  };
  const deleteAccount = () => {
    //todo implement logic to remove/archive user account
    setDeleted(true);
  };

  useEffect(() => {
    localStorage.setItem("token", token); // might create problems later on if I am updating the user and not the token because the user is pulled from the token
    localStorage.setItem("user", JSON.stringify(user));
  });

  useEffect(() => {
    //setUserDetails
    //setLoading(true);
    fetch("/api/account/user", {
      headers: {
        "auth-token": token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUserDetails(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [editing]);

  // nested conditional rendering. 1) check if account was deleted.
  // 2) check if loading. 3) check if editing.
  return (
    <Container>
      <Header title="My Account" />
      {deleted ? (
        <Info message="Your account has been removed from our system." />
      ) : loading ? (
        <Info message="Loading..." />
      ) : editing ? (
        <EditUserDetails
          user={userDetails}
          editCancel={editCancel}
          editSave={editSave}
          deleteAccount={deleteAccount}
        />
      ) : (
        <UserDetails
          user={userDetails}
          edit={edit}
          handleLogout={handleLogout}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default Account;
