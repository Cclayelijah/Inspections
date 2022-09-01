import React from "react";
import styled from "styled-components";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

const Card = ({ type, name, status, inspector, client, start, location }) => {
  dayjs.extend(customParseFormat);

  const time = dayjs(start);
  const day = time.format("MMM DD");
  const hour = time.format("h:mm A");

  return (
    <Container>
      <h3>{name}</h3>
      {status === "Scheduled" ? (
        <div className="time">
          <h4>{hour}</h4>
          <h4>{day}</h4>
        </div>
      ) : (
        <div className="time">
          <p>{status}</p>
        </div>
      )}
      <img
        src={
          type === "residential"
            ? "../images/residential.png"
            : "../images/commercial.png"
        }
        alt=""
      />
      <div className="content">
        <li>
          {location.address.toUpperCase()}
          <br />
          {location.city.toUpperCase()}
          <br />
          {location.state.toUpperCase()}, {location.zip}
        </li>
      </div>
    </Container>
  );
};

const Container = styled.div`
  color: #212f3d;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 200px;
  height: 310px;
  min-width: 150px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 10px 10px 0px 0px #5d6d7e;
  padding: 10px;
  text-align: center;
  img {
    margin-top: 10px;
    width: 30%;
    margin-left: auto;
    margin-right: auto;
  }
  h3 {
    margin: 10px 0 0;
  }
  .time {
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    margin: 0;
  }
  p {
    margin: 0;
  }
  li {
    list-style: none;
    text-align: center;
    margin: 10px 0;
  }
  &:hover {
    box-shadow: 10px 10px 0px 0px #0daddd;
    transition: 0.3s ease;
    /* transform: scale(1.1);
    transition: 0.2s ease; */
  }

  @media (max-width: 500px) {
  }
  @media (max-width: 768px) {
    width: 200px;
    max-width: 100%;
    height: auto;
  }
  @media (max-width: 986px) {
    min-width: 200px;
    width: 250px;
    max-width: 100%;
  }
`;

export default Card;
