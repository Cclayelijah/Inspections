import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { residential, commercial } from "../../../globals";

const Form = ({ completeSubmit }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [nameDisabled, setNameDisabled] = useState(true);
  const [type, setType] = useState("");
  const [names, setNames] = useState([]);
  //const [count, setCount] = useState(1);

  const updateName = () => {
    setType(document.getElementById("type").value);
  };

  useEffect(() => {
    //console.log(document.getElementById("name").selectedIndex); for resetting name option on type change
    let names = [];
    if (type === "residential") {
      setNameDisabled(false);
      residential.map((i) => {
        names.push(i.name);
      });
    }
    if (type === "commercial") {
      setNameDisabled(false);
      if (commercial) {
        commercial.map((i) => {
          names.push(i.name);
        });
      }
    }
    setNames(names);
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = {
      createdBy: {
        userType: user.userType,
        userId: user.id,
      },
      client: user.organization, // only hardcoded for client users
      address: document.querySelector('[name="address"]').value,
      city: document.querySelector('[name="city"]').value,
      state: document.querySelector('[name="state"]').value,
      zip: document.querySelector('[name="zip"]').value,
      inspections: [
        {
          type: document.querySelector('[name="type"]').value,
          name: document.querySelector('[name="name"]').value,
          timePreference: document.querySelector('[name="timePreference"]')
            .value,
          comment: document.querySelector('[name="comment"]').value,
          publicComment: true,
        },
      ],
    };

    fetch("/api/inspections/request", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(request),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        completeSubmit();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <div className="contain">
        <h2 id="title">Request Inspection</h2>
        <form onSubmit={handleSubmit}>
          <label>Location</label>
          <input
            name="address"
            type="text"
            placeholder="Address"
            required
            autoFocus
          />
          <input name="city" type="text" placeholder="City" required />
          <div className="row">
            <input
              name="state"
              className="col-6"
              type="text"
              placeholder="State"
              required
            />
            <input
              name="zip"
              className="col-6"
              type="text"
              placeholder="Zip"
              required
            />
          </div>
          {/* save for later version
          <label htmlFor="guests">Event Guests</label>
          <textarea name="guests" type="text" placeholder="email@email.com" /> */}
          <label>Inspection Needed</label>
          {/* todo make adding multiple inspections at once possible (max 3)*/}
          <div className="row">
            {/* <label htmlFor="type">1.</label> */}
            <select
              name="type"
              id="type"
              className="col-6"
              required
              onChange={updateName}
            >
              <option value="" disabled selected>
                Choose one
              </option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            <select
              name="name"
              id="name"
              className="col-6"
              required
              disabled={nameDisabled}
            >
              <option value="" disabled selected>
                Choose one
              </option>
              {names.map((name) => {
                return <option key={name}>{name}</option>;
              })}
            </select>
          </div>
          <div className="row" id="time">
            {/* <label htmlFor="type">1.</label> */}
            <label className="col-6">Time Preference</label>
            <div className="right">
              <div className="choose">
                <label htmlFor="AM">AM</label>
                <input type="radio" id="AM" name="timePreference" value="AM" />
              </div>
              <div className="choose">
                <label htmlFor="PM">PM</label>
                <input type="radio" id="PM" name="timePreference" value="PM" />
              </div>
            </div>
          </div>
          <textarea
            name="comment"
            type="text"
            rows="5"
            placeholder="Comments"
          />
          <button name="zip" type="submit">
            Submit
          </button>
        </form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  #title {
    display: none;
  }
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

  @media (max-width: 768px) {
    #title {
      display: inline-block;
      width: 100%;
      text-align: center;
    }
  }
`;

export default Form;
