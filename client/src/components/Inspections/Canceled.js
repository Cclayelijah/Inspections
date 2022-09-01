import React, { useEffect, useState } from "react";
import CardInspection from "./CardInspection";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Canceled = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [inspections, setInspections] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inspections/canceled", {
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
        if (data.length > 0) {
          setInspections(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="list">
      {loading ? (
        <p>Loading...</p>
      ) : inspections ? ( // cannot map undefined
        inspections.map((inspection) => {
          return (
            <Link to={`/inspections/${inspection._id}`} key={inspection._id}>
              <CardInspection
                type={inspection.type}
                status={inspection.status}
                name={inspection.name}
                inspector={inspection.inspector}
                start={inspection.start}
                location={inspection.location}
              />
            </Link>
          );
        })
      ) : (
        <div className="message">
          <p>You have no canceled inspections.</p>
        </div>
      )}
    </div>
  );
};

export default Canceled;
