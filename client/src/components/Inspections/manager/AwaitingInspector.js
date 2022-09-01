import React from "react";
import styled from "styled-components";
import CardInspection from "../CardInspection";
import { Link } from "react-router-dom";

const AwaitingInspector = ({ scheduled }) => {
  return (
    <Container>
      {scheduled.length > 0 ? (
        <div className="list">
          {scheduled.map((inspection) => {
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
                  start={inspection.start}
                  location={inspection.location}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="message">
          <p>There are no scheduled inspections.</p>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div``;

export default AwaitingInspector;
