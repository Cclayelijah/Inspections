import React from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import Header from "../Header";

const CancelInspection = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();

  const submit = async (e) => {
    e.preventDefault();
    const { reschedule, comment } = e.target;
    const data = {
      reschedule: reschedule.value,
      comment: comment.value,
    };

    if (user.userType === "client") {
      fetch(`/api/inspections/user/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("HTTP status " + res.status);
          }
          return res.json();
        })
        .then((result) => {
          console.log(result);
          history.push(`/inspections/${id}`);
        })
        .catch((err) => console.log(err));
    }
    else {
      fetch(`/api/inspections/staff/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("HTTP status " + res.status);
          }
          return res.json();
        })
        .then((result) => {
          console.log(result);
          history.push(`/inspections/${id}`);
        })
        .catch((err) => console.log(err));
    }
    
  };

  const back = (e) => {
    e.preventDefault();
    history.push(`/inspections/${id}`);
  };

  return (
    <>
      <Header title="Cancel Inspection" />
      <Container>
        <form onSubmit={submit}>
          <div className="row">
            <label>Would you like to reschedule?</label>
            <select name="reschedule" id="reschedule">
              <option value={true} selected>
                Yes
              </option>
              <option value={false}>No</option>
            </select>
          </div>
          <textarea
            name="comment"
            id="comment"
            cols="30"
            rows="5"
            placeholder="Please Explain..."
          ></textarea>
          <div className="row">
            <button onClick={back}>Back</button>
            <button type="submit" className="warning">Cancel</button>
          </div>
        </form>
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 30px 10px;
`;

export default CancelInspection;
