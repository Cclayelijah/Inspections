import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import Header from "../../Header";
import Info from "../../Info";
import OrgDetails from "./OrganizationDetails";
import EditOrg from "./EditOrg";
import OrgSetup from "./OrgSetup";

const Org = () => {
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [orgDetails, setOrgDetails] = useState({
    name: "Name",
    address: {
      address: "1234 Default St.",
      city: "City",
      state: "State",
      zip: "Zip",
    },
    contact: user.id,
    timePreference: "AM",
    website: "https://mywebsite.com",
    users: [user.id.toString()],
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const leaveOrganization = () => {
    // todo update client and user (backend and frontend)
  };

  const edit = () => {
    setEditing(true);
  };
  const editCancel = (e) => {
    e.preventDefault();
    setEditing(false);
  };
  const editSave = (e) => {
    e.preventDefault();
    const { address, city, state, zip, users, pendingUsers, contact, timePreference, website } =
      e.target.elements;
    const update = {
      address: address.value,
      city: city.value,
      state: state.value,
      zip: zip.value,
      users: users.value,
      pendingUsers: pendingUsers.value,
      contact: contact.value,
      timePreference: timePreference.value,
      website: website.value,
    };

    fetch("/api/organization", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(update),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setEditing(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/account/organization", {
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setOrgDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(orgDetails);

  // nested conditional rendering.
  return (
    <>
      <Header title="My Organization" />
      <Container>
        {user.organization ? loading && !orgDetails ? (
          <Info message="Loading..." />
        ) : editing ? (
          <EditOrg
            org={orgDetails}
            editCancel={editCancel}
            editSave={editSave}
          />
        ) : (
          <OrgDetails
            user={user}
            org={orgDetails}
            edit={edit}
            leaveOrganization={leaveOrganization}
          />
        ) : (<OrgSetup />)}
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 10px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default Org;
