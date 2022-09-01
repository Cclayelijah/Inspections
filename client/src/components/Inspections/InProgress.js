import React, { useEffect, useState } from "react";
import CardInspection from "./CardInspection";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { get } from "mongoose";
import AwaitingManager from "./manager/AwaitingManager";
import AwaitingInspector from "./manager/AwaitingInspector";

const InProgress = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [inspections, setInspections] = useState();
  const [pending, setPending] = useState();
  const [scheduled, setScheduled] = useState();
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const getData = async () => {
    fetch("/api/inspections", {
      headers: {
        "auth-token": token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        //setLoading(false);
        console.log(user);
        if (user.userType === "client") setInspections(data.inProgress);
        if (user.userType === "inspector") setInspections(data.scheduled);
        if (user.userType === "manager") {
          setPending(data.awaitingManager);
          setScheduled(data.awaitingInspector);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
    setLoading(false);
  }, []);

  if (user) {
    if (user.userType === "manager") {
      return loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Not Scheduled</h3>
          <div>
            {pending && true ? (
              <AwaitingManager pending={pending} />
            ) : (
              <div className="message">
                <p>There are no pending inspections.</p>
              </div>
            )}
          </div>
          <h3>Not Logged</h3>
          <div>
            {scheduled && true ? (
              <AwaitingInspector scheduled={scheduled} />
            ) : (
              <div className="message">
                <p>There are no scheduled inspections.</p>
              </div>
            )}
          </div>
        </>
      );
    } else {
      return (
        <div className="list">
          {loading ? (
            <p>Loading...</p>
          ) : inspections && true ? (
            inspections.length > 0 ?
            inspections.map((inspection) => {
              return (
                <Link
                  className="item"
                  to={`/inspections/${inspection._id}`}
                  key={inspection._id}
                >
                  <CardInspection
                    className="card"
                    type={inspection.type}
                    status={inspection.status}
                    name={inspection.name}
                    inspector={inspection.inspector}
                    client={inspection.client}
                    start={inspection.start}
                    location={inspection.location}
                  />
                </Link>
              );
            }) : <div className="message">
            {user.userType === "inspector" ? (
              <p>You have no scheduled inspections.</p>
            ) : (
              <p>You have no pending or scheduled inspections.</p>
            )}
          </div>
          ) : (
            <div className="message">
              {user.userType === "inspector" ? (
                <p>You have no scheduled inspections.</p>
              ) : (
                <p>You have no pending or scheduled inspections.</p>
              )}
            </div>
          )}
        </div>
      );
    }
  } else {
    //setUser(JSON.parse(localStorage.getItem("user")));
    return <p>Loading...</p>;
  }
};

export default InProgress;
