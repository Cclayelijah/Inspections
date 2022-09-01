import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

import { residential, commercial } from "../../globals";
import Header from "../Header";

const NewInspection = ({ completeSubmit }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [nameDisabled, setNameDisabled] = useState(true);
  const [type, setType] = useState("");
  const [names, setNames] = useState([]);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  //const [count, setCount] = useState(1);

  // copied over from Schedule.js
  const [inspectors, setInspectors] = useState([]);
  const [inspector, setInspector] = useState();
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(dayjs().month());
  const [dayNum, setdayNum] = useState(dayjs().date());
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [startList, setStartList] = useState([]);
  const [disableStart, setDisableStart] = useState(true);
  const [endList, setEndList] = useState([]);
  const [disableEnd, setDisableEnd] = useState(true);
  const [timeSlots, setTimeSlots] = useState([])

  let eventCount = [0, 1, 2, 3, 4];
  const working = [9, 10, 11, 12, 13, 14, 15]; // from 9 to 4 (9 through 3)
  let year = dayjs().year();

  const updateName = () => {
    setType(document.getElementById("type").value);
  };

  useEffect(() => {
      // populate client list
    fetch("/api/account/clients", {
        headers: {
          "Content-type": "application/json",
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
          setClients(data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

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

  const pageNext = (e) => {
    e.preventDefault();
    setPage(2);
  }

  const pageBack = (e) => {
    e.preventDefault();
    setPage(1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = {
      createdBy: {
        userType: user.userType,
        userId: user.id,
      },
      client: user.organization, // only hardcoded for client users
      
    };

    fetch("/api/inspections/new", {
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
        //history.push("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
    <Header title="New Inspection" />
    <Container>
      <div className="contain">
        <h2 id="title">Request Inspection</h2>
        <form onSubmit={handleSubmit}>
          <div className={`page ${page === 1 ? "" : "hide"}`}>
            <label htmlFor="client">Client</label>
              <select
                name="client"
                id="client"
                onChange={updateName}
                autoFocus
              >
                <option value="" disabled selected>
                  Choose one
                </option>
                {clients ? (
                    clients.map((client) => {
                      return <option value={client._id}>{client.name}</option>
                    })
                ) : null}
              </select>
            <label>Location</label>
            <input
              name="address"
              type="text"
              placeholder="Address"
            />
            <input name="city" type="text" placeholder="City" />
            <div className="row">
              <input
                name="state"
                type="text"
                placeholder="State"
              />
              <input
                name="zip"
                type="text"
                placeholder="Zip"
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
            <textarea
              name="comment"
              type="text"
              rows="5"
              placeholder="Comments"
            />
            <button className="fright" onClick={pageNext}>Next</button>
          </div>
          <div className={`page ${page === 2 ? "" : "hide"}`}>
            <div className="space">
              <button onClick={pageBack}>
                Back
              </button>
              <button type="submit">
                Submit
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </Container>
    </>
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
    .fright{
      margin-left: auto;
    }
    .space{
      display: flex;
      justify-content: space-between;
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

export default NewInspection;
