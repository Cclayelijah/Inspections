import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const OrgSetup = () => {
    const history = useHistory();

    const handleNew = () => {
        history.push("/account/organization/register");
    }

    const handleJoin = () => {
        history.push("/account/organization/join");
    }

    return (<Container>
        <div className="container">
            <h3>Your account doesn't have an organization. Please finish setting this up now.</h3>
            <div className="row">
                <button onClick={handleNew}>Create New</button>
                <button onClick={handleJoin}>Join Existing</button>
            </div>
        </div>
    </Container>);
}

const Container = styled.div``;

export default OrgSetup;