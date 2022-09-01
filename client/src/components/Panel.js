import React from "react";
import styled from "styled-components";

const Panel = () => {
  return (
    <Container>
      <div className="content">
        <img src="../images/calendar.png" alt="" />
        {/* <Calendar /> */}
        <h3>Today</h3>
        <p>Looks like you don't have any inspections for today.</p>
        <h3>Activity</h3>
        <p>
          Kyle M - Temp Power
          <br />
          Currently, Eagle Mountain
        </p>
        <p>
          George W - Footings
          <br />
          4:00 PM, Saratoga Springs
        </p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin: 0;
  width: 20vw;
  min-width: 15rem;
  background-color: #191414;
  border-radius: 0 20px 20px 0;
  padding: 20px;
  h3 {
    color: #0daddd;
  }
  color: white;
  img {
    max-width: 100%;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 10px 0 0;
    max-width: none;
    min-width: none;
    border-radius: 0;
    width: 100%;
    .content {
      padding: 20px 10px 100px;
    }
  }
`;

export default Panel;
