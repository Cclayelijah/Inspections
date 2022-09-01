import React, { useState } from "react";
import styled from "styled-components";

const EditUserDetails = ({ editCancel, editSave, deleteAccount, org }) => {
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [zip, setZip] = useState();
  const [timePreference, setTimePreference] = useState("AM");
  const [website, setWebsite] = useState();
  const [contact, setContact] = useState(org.contact);

  //address, users, pendingUsers, contact, timePreference, website
  // todo add timePreference in editSave
  console.log(JSON.stringify(org));

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleCity = (e) => {
    setCity(e.target.value);
  };
  const handleState = (e) => {
    setState(e.target.value);
  };
  const handleZip = (e) => {
    setZip(e.target.value);
  };
  const handleTimePreference = (e) => {
    setTimePreference(e.target.value);
  }
  const handleContact = (e) => {
    setContact(e.target.value);
  }
  const handleWebsite = (e) => {
    setWebsite(e.target.value);
  }

  return (
    <Container>
      <h1>Edit Details</h1>
      <form onSubmit={editSave}>
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleAddress}
          placeholder="Street Address"
        />
        <input
          type="text"
          name="city"
          value={city}
          onChange={handleCity}
          placeholder="City"
        />
        <input
          type="text"
          name="state"
          value={state}
          onChange={handleState}
          placeholder="State"
        />
        <input
          type="text"
          name="zip"
          value={zip}
          onChange={handleZip}
          placeholder="Zip"
        />
        <div className="row">
          <div className="division">
            <label htmlFor="timePreference">Time Preference</label>
            <select name="timePreference" id="timePreference" value={timePreference} onChange={handleTimePreference}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
          <div className="division">
            <label htmlFor="contact">Contact</label>
            <select name="contact" value={contact} onChange={handleContact}>
              <option value="" selected disabled>Choose One</option>
              <option value=""></option>
            </select>
          </div>
        </div>
        <label htmlFor="website">Website</label>
        <input type="text" name="website" placeholder="https://" value={website} onChange={handleWebsite} />
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
