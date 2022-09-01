import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const Log = ({ setLogged, setNotCompleted }) => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [logging, setLogging] = useState("hide");
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [hours, setHours] = useState("");
  const [miles, setMiles] = useState("");
  const [notes, setNotes] = useState("");

  const logInspection = (e) => {
    e.preventDefault();
    const log = {
      hours: Number(hours),
      miles: Number(miles),
      notes,
    };

    fetch(`/api/inspections/log/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(log),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.message);
        if (data.updated) {
          setLogged(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const logShow = () => {
    document.getElementById("hours").focus();
    setLogging("show");
  };

  const notCompleted = (e) => {
    e.preventDefault();

    fetch(`/api/inspections/log/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.message);
        if (data.updated) {
          setNotCompleted(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleHours = (e) => {
    setHours(e.target.value);
  };

  const handleMiles = (e) => {
    setMiles(e.target.value);
  };

  const handleNotes = (e) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    if (hours && miles) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [hours, miles]);

  return (
    <Container>
      <div className={`log ${logging}`}>
        <form id="scheduleForm" onSubmit={logInspection}>
          <div className="row"></div>
          <div className="row">
            <div className="group">
              <label>Hours</label>
              <input
                type="text"
                name="hours"
                id="hours"
                value={hours}
                placeholder={0}
                onChange={handleHours}
                autoComplete="off"
              />
            </div>
            <div className="group">
              <label>Miles</label>
              <input
                type="text"
                name="miles"
                value={miles}
                placeholder={0}
                onChange={handleMiles}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="group">
            <label>Internal Note</label>
            <textarea
              name="notes"
              rows="2"
              value={notes}
              onChange={handleNotes}
              placeholder="Leave a note..."
            />
          </div>
          <div className="row">
            <button type="submit" disabled={disableSubmit}>
              Submit
            </button>
            <button className="warning" onClick={notCompleted}>Not Completed</button>
          </div>
        </form>
      </div>
      <button
        onClick={logShow}
        className={logging === "hide" ? "show" : "hide"}
      >
        Log Inspection
      </button>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  max-width: 100%;
  margin: 20px 0;
  .log {
    form {
      margin: 0;
      .row {
        flex: 1;
      }
      .group {
        display: flex;
        flex-direction: column;
        flex: 1;
        label {
          text-align: left;
          width: auto;
        }
      }
    }
  }
  .hide {
    display: none;
  }
  .show {
    display: auto;
  }
  @media (min-width: 768px) {
    form {
      width: 100%;
    }
  }
  @media (max-width: 768px) {
    .row {
      flex-direction: row;
      input {
        flex: 1;
      }
    }
  }
`;

export default Log;
