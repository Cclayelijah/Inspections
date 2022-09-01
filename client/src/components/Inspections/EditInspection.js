import React, { useEffect, useState } from "react";
import Header from "../Header";
import Info from "../Info";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import dayjs from "dayjs";

const EditInspection = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  let inspection;

  // ----------- form values
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [zip, setZip] = useState();
  const [timePreference, setTimePreference] = useState();
  // todo implement guests array user control

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
  };

  // ------------- form functions
  const cancelEdit = (e) => {
    e.preventDefault(); // preventDefault stops saveEdit from running
    history.push(`/inspections/${id}`);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    const updated = {
      location: {
        address,
        city,
        state,
        zip,
      },
      timePreference,
    };

    fetch(`/api/inspections/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        history.push(`/inspections/${id}`);
      })
      .catch((err) => console.log(err));
  };

  const setCanceled = () => {
    history.push(`/inspections/cancel/${id}`);
  };

  useEffect(() => {
    fetch(`/api/inspections/${id}`, {
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
        inspection = data;
        console.log(inspection);
        setAddress(inspection.location.address);
        setCity(inspection.location.city);
        setState(inspection.location.state);
        setZip(inspection.location.zip);
        setTimePreference(inspection.timePreference);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container>
      <Header title="Edit Inspection" />
      <div className="main">
        <h1>Edit Inspection</h1>
        <div className="top">{/* <h5>Inspection # {id}</h5> */}</div>
        <form onSubmit={saveEdit}>
          <div className="section">
            <h3 id="title">Location</h3>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={handleAddress}
            />
            <label htmlFor="city">City</label>
            <input type="text" name="city" value={city} onChange={handleCity} />
            <label htmlFor="state">State</label>
            <input
              type="text"
              name="state"
              value={state}
              onChange={handleState}
            />
            <label htmlFor="zip">Zip</label>
            <input type="text" name="zip" value={zip} onChange={handleZip} />
          </div>
          <label htmlFor="timePreference">Time Preference</label>
          <select
            name="timePreference"
            id="timePreference"
            onChange={handleTimePreference}
          >
            <option selected={timePreference === "AM" ? true : false}>
              AM
            </option>
            <option selected={timePreference === "PM" ? true : false}>
              PM
            </option>
          </select>

          <div className="row">
            <button id="cancel" onClick={cancelEdit}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
        <div className="bottom">
          <span onClick={setCanceled}>Cancel Appointment</span>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .main {
    padding: 10px;
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
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      flex: 1;
      align-self: center;
      justify-content: flex-end;
      span {
        color: #c30c16;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  @media (min-width: 768px) {
    h1 {
      display: none;
    }
  }
`;

export default EditInspection;
