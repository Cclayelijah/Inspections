import React, { useEffect, useState } from "react";
import Header from "../Header";
import Dashboard from "../Dashboard";

const Home = () => {
  return (
    <>
      <Header title="Dashboard" />
      <Dashboard />
    </>
  );
};

export default Home;
