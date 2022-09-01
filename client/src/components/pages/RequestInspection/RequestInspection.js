import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Form from "./FormRequestInspection";
import { Switch, Route } from "react-router";
import Info from "../../Info";

const RequestInspection = () => {
  const [submitted, setSubmitted] = useState(false);

  const completeSubmit = () => {
    setSubmitted(true);
  };

  return (
    <>
      <Header title="Request Inspection" mobileTitle={true} />
      {submitted ? (
        <Info message="Your inspection request was received and placed in the manager's queue." />
      ) : (
        <Form completeSubmit={completeSubmit} />
      )}
    </>
  );
};

export default RequestInspection;
