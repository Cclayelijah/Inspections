import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Form = () => {
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  let push = false;

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("user info was updated", user);
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const organization = {
      name: form[0].value,
      address: {
        street: form[1].value,
        city: form[2].value,
        state: form[3].value,
        zip: form[4].value,
      },
      users: [user.id],
      contact: user.id,
      timePreference: document.querySelector('[name="timePreference"]').value,
      website: form[5].value,
    };

    fetch("/api/account/organization/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(organization),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.token);
        setToken(data.token);
        setUser(data.user);
        history.push("/Account");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <div className="contain">
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            name="name"
            type="text"
            placeholder="My Organization"
            required
            autoFocus
          />
          <label>Location</label>
          <input name="address" type="text" placeholder="Address" required />
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
          <label id="website">
            Inspections Website <i className="fas fa-info"></i>
          </label>
          {/* todo implement tooltip 
          <span className="text">
            This website is for our inspector's convenience. include a link to a
            website if you require us to log any inspection details in your
            system.
          </span> */}
          <input name="website" type="text" placeholder="https://" />
          <div className="row" id="time">
            {/* <label htmlFor="type">1.</label> */}
            <label className="col-6">Inspection Time Preference</label>
            <div className="right">
              <div className="choose">
                <label htmlFor="AM">AM</label>
                <input
                  type="radio"
                  id="AM"
                  name="timePreference"
                  value="AM"
                  required
                />
              </div>
              <div className="choose">
                <label htmlFor="PM">PM</label>
                <input
                  type="radio"
                  id="PM"
                  name="timePreference"
                  value="PM"
                  required
                />
              </div>
            </div>
          </div>

          <button name="zip" type="submit">
            Submit
          </button>
        </form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .contain {
    padding: 10px;
    #website {
      display: flex;
      justify-content: left;
      i {
        font-size: 12px;
        margin-left: 6px;
        margin-top: 2px;
      }
    }
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
`;

export default Form;
