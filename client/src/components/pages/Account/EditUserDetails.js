import React, { useState } from "react";
import styled from "styled-components";

const EditUserDetails = ({ editCancel, editSave, deleteAccount, user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const handleFirst = (e) => {
    setFirstName(e.target.value);
  };
  const handleLast = (e) => {
    setLastName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  return (
    <Container>
      <h1>Edit Account Details</h1>
      <form onSubmit={editSave}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={handleFirst}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={handleLast}
        />
        <label className="email" htmlFor="email">
          Email
        </label>
        <input
          className="email"
          type="text"
          name="email"
          value={email}
          onChange={handleEmail}
          disabled
        />
        <label htmlFor="phone">Phone</label>
        <input type="text" name="phone" value={phone} onChange={handlePhone} />
        <div className="row">
          <button id="cancel" onClick={editCancel}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
      <div className="bottom">
        <span onClick={deleteAccount}>Delete Account</span>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  .email {
    display: none;
  }
  .row {
    margin-top: 20px;
    #cancel {
      background-color: #5d6d7e;
    }
    #cancel:hover {
      background-color: #212f3d;
    }
  }
  .bottom {
    padding-bottom: 115px;
    display: flex;
    flex-direction: column;
    flex: 1;
    align-self: center;
    justify-content: flex-end;
    span {
      color: #c30c16;
    }
  }
`;

export default EditUserDetails;
