import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import RequestInspection from "./components/pages/RequestInspection/RequestInspection";
import Organization from "./components/pages/Organization/Org";
import RegisterOrganization from "./components/pages/RegisterOrganization/RegisterOrganization";
import JoinOrganization from "./components/pages/JoinOrganization/JoinOrganization";
import Account from "./components/pages/Account/Account";
import ViewInspection from "./components/Inspections/ViewInspection";
import EditInspection from "./components/Inspections/EditInspection";
import CancelInspection from "./components/Inspections/CancelInspection";
import NewInspection from "./components/pages/NewInspection";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/inspections/add" component={RequestInspection} />
        <Route exact path="/inspections/new" component={NewInspection} />
        <Route exact path="/inspections/:id" component={ViewInspection} />
        <Route exact path="/inspections/edit/:id" component={EditInspection} />
        <Route
          exact
          path="/inspections/cancel/:id"
          component={CancelInspection}
        />
        <Route exact path="/account" component={Account} />
        <Route exact path="/account/organization" component={Organization} />
        <Route
          exact
          path="/account/organization/register"
          component={RegisterOrganization}
        />
        <Route
          exact
          path="/account/organization/join"
          component={JoinOrganization}
        />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}

export default App;
