import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Form from "./FormRegisterOrganization";

const RegisterOrganization = () => {
  return (
    <>
      <Header title="Setup Organization" mobileTitle={true} />
      <Form />
    </>
  );
};

export default RegisterOrganization;
