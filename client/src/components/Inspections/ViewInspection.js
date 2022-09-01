import React, { useEffect, useState, Suspense } from "react";
import Header from "../Header";
import Info from "../Info";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import Schedule from "./manager/Schedule";
import Log from "./inspector/Log";
import { manager } from "../../globals";

const ViewInspection = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const { id } = useParams();
  const [inspection, setInspection] = useState();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [logged, setLogged] = useState(false);
  const [notCompleted, setNotCompleted] = useState(false);

  const isManager = user.userType === "manager" ? true : (
    user.userType === "inspector" ? (
      user.isManager ? true : false
    ) : false
  );

  let cid = 0;
  let time = dayjs();
  let guests = "";
  if (inspection) {
    time = dayjs(inspection.start);
    if (inspection.guests) {
      for (let i = 0; i < inspection.guests.length; i++) {
        if (inspection.guests[i]) {
          if (i == 0) guests += inspection.guests[i];
          else guests += ", " + inspection.guests[i];
        }
      }
    }
  }

  const day = time.format("MMMM DD, YYYY");
  const hour = time.format("h:mm A");

  const gotoEdit = () => {
    history.push(`/inspections/edit/${id}`);
  };

  const handleFormChange = () => {
    const newComment = document.getElementById("comment").value;
    setComment(newComment);
    if (newComment.length > 0) {
      document.getElementById("post").disabled = false;
    } else {
      document.getElementById("post").disabled = true;
    }
  };

  const renewInspection = () => {
    console.log("re-schedule inspection");
  }

  const deleteInspection = () => {
    console.log("delete inspection");
  }

  const postComment = (e) => {
    e.preventDefault();

    const post = {
      comment,
      firstName: user.firstName,
      lastName: user.lastName,
      public: true,
      timestamp: dayjs().format("MM/DD/YYYY h:mm A"),
      userType: user.userType,
    };

    fetch(`/api/inspections/comment/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(post),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.posted) {
          let list = comments;
          list.push(data.newComment);
          setComments(list);
          document.getElementById("comment").value = "";
          document.getElementById("post").disabled = true;
          setComment("");
          if (document.getElementById("comments")) {
            if (comments.length > 0) {
              let bottom;
              if (cid == 0) {
                bottom = comments[comments.length - 1]._id;
              } else {
                bottom = cid;
              }
              let element = document.getElementById(bottom);

              element.scrollIntoView({
                // scroll to bottom
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetch(`/api/inspections/${id}`, {
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
        setLoading(false);
        setInspection(data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      setComments(inspection.comments);
    }
  }, [inspection]);

  useEffect(() => {
    // scroll after it renders
    if (document.getElementById("comments")) {
      if (comments.length > 0) {
        let bottom;
        if (cid == 0) {
          bottom = comments[comments.length - 1]._id;
        } else {
          bottom = cid;
        }
        let element = document.getElementById(bottom);

        element.scrollIntoView({
          // scroll to bottom
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }
  }, [comments]);

  return (
    <>
      <Header title="View Inspection" />
      {loading ? (
        <Info message="Loading..." />
      ) : inspection ? (
        logged ? (
          <Info message="Inspection has been logged successfully." />
        ) : notCompleted ? <Info message="Inspection status updated successfully." /> : (
          <Wrapper>
            <Component>
              <div className="main">
                <div className="top">
                  <div className="left">
                    <img
                      src={
                        inspection.type === "residential"
                          ? "/images/residential.png"
                          : "/images/commercial.png"
                      }
                      alt=""
                    />
                    <div className="title">
                      <h2>{inspection.name}</h2>
                      <h4>{inspection.status}</h4>
                      {/* {user.userType === "inspector" ? (
                    <h4>
                      {dayjs(inspection.start).format("MM/DD/YYYY - h:mm A")}
                    </h4>
                  ) : (
                    <h4>{inspection.status}</h4>
                  )} */}
                    </div>
                  </div>
                  {inspection.status === "Canceled" ? null : <button onClick={gotoEdit}>Edit</button>}
                </div>

                {inspection.status === "Scheduled" ? (
                  <div className="time">
                    <h5>{hour}</h5>
                    <h5>{day}</h5>
                    <h4>WC3</h4>
                  </div>
                ) : null}
                {inspection.status === "Completed" ? (
                  <div className="time">
                    <h5>{day}</h5>
                  </div>
                ) : null}
                {inspection.status === "Pending" ||
                inspection.status === "Canceled" ? (
                  <div className="time">
                    <div className="block-center">
                      <h5>Preferred Time: {inspection.timePreference}</h5>
                    </div>
                    {user.userType === "inspector" ? (
                      <div className="block-center">
                        <h5>WC3 {inspection.client.name}</h5>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="content">
                  <div className="block-center">
                    <h4>Location</h4>
                    {inspection.location ? (
                      <p>
                        {inspection.location.address}
                        <br />
                        {inspection.location.city}, {inspection.location.state},{" "}
                        {inspection.location.zip}
                      </p>
                    ) : null}
                  </div>
                  {inspection.inspector ? (
                    <div className="block-center">
                      <h4>Inspector</h4>
                      <p>{inspection.inspector}</p>
                    </div>
                  ) : null}
                  {inspection.client ? (
                    <div className="block-center">
                      <h4>Contact</h4>
                      {/* <p>
                    {inspection.client.contact.firstName}{" "}
                    {inspection.client.contact.lastName}
                  </p> */}
                      <p>{inspection.client}</p>
                    </div>
                  ) : null}
                </div>
                {/* version 1?
        <div className="block">
        <h4>Guests</h4>
        <p>{guests ? guests : "There are no guests for this event."}</p>
      </div> */}
                {inspection.status === "Canceled" ? (
                  <div className="canceledForm">
                    {!isManager ? <div className="rows">
                      <button onClick={renewInspection}>Re-Schedule</button>
                      {user.userType === "client" ? <button className="warning" onClick={deleteInspection}>Delete</button> : null}
                    </div> : null}
                  </div>
                ) : null}
                {user.userType === "manager" ? (
                  <div className="scheduleWrapper">
                    <Suspense fallback={<button>Schedule Inspection</button>}>
                      <Schedule
                        inspection={inspection}
                        setInspection={setInspection}
                      />
                    </Suspense>
                  </div>
                ) : null}
                {inspection ? (
                  user.userType === "inspector" &&
                  inspection.status === "Scheduled" ? (
                    <div className="logWrapper">
                      <Suspense fallback={<button>Log Inspection</button>}>
                        <Log setLogged={setLogged} setNotCompleted={setNotCompleted} />
                      </Suspense>
                    </div>
                  ) : null
                ) : null}
              </div>
              <div className="space"></div>
              <div className="panel">
                <div className="title">
                  <h3>Comments</h3>
                  <hr />
                </div>
                <div className="block">
                  <div id="comments" className="comments scrollbar">
                    {comments
                      ? comments.map((comment) => {
                          if (comment) {
                            return (
                              <div
                                key={comment._id ? comment._id : `${++cid}`}
                                id={comment._id ? comment._id : `${cid}`}
                                className="comment-wrapper"
                              >
                                <div className="comment">
                                  <div className="left">
                                    <h4>
                                      {comment.firstName[0].toUpperCase() +
                                        comment.firstName.substring(1)}{" "}
                                      {comment.lastName[0].toUpperCase()}.
                                    </h4>
                                    <p>{comment.userType}</p>
                                  </div>
                                  <div className="right">
                                    <h4>{comment.timestamp}</h4>
                                    <p>{comment.comment}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })
                      : null}
                  </div>
                  <div className="post-comment">
                    <form onSubmit={postComment}>
                      <input
                        type="text"
                        id="comment"
                        placeholder="Leave a comment..."
                        onChange={handleFormChange}
                      />
                      <button id="post" type="submit" disabled>
                        Post
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Component>
          </Wrapper>
        )
      ) : (
        <Info message="This inspection does not exist in our records." />
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    height: 100vh;
  }
  @media (min-width: 900px) {
    padding: 30px 100px;
  }
`;

const Component = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px 10px 105px;
  p {
    margin: 5px 0;
  }
  h2,
  h3 {
    margin: 0;
  }

  button:disabled {
    background-color: #5d6d7e;
  }
  .top {
    margin: 10px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    .h2 {
      margin: 0;
    }
    .left {
      display: flex;
      align-items: flex-start;
      justify-content: left;
      gap: 10px;
    }
    img {
      flex: 1;
      margin-top: 5px;
    }

    button {
      padding: 10px 20px;
      margin: 0;
    }
  }
  .time {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .block-center {
    flex: 1;
    overflow-wrap: anywhere;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .block,
  .block-center {
    padding: 10px 0;
  }
  .time {
    padding: 20px 0 0;
    h4 {
      padding-top: 10px;
    }
  }
  .canceledForm{
    margin-top: 20px;
    .rows{
    display: flex;
    gap: 10px;
    justify-content: center;
    button{
      flex: 1;
      max-width: 300px;
    }
  }
  }
  .content {
    display: flex;
  }
  .scheduleWrapper {
    text-align: center;
    margin: 20px 0 0;
    .schedule {
      display: flex;
      gap: 40px;
      #scheduleForm {
        flex: 1;
        margin-top: 0;
        button {
          margin-left: auto;
        }
      }
      .availability {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
        .top {
          margin: 0;
          display: flex;
          gap: 20px;
          .part {
            display: flex;
            width: 100%;
            background-color: #fff;
            border: 2px solid #191414;
            .sign {
              background-color: #1c3f95;
              color: #fff;
              padding: 4px 10px;
              cursor: pointer;
            }
            .label {
              padding: 4px 10px;
              flex: 1;
            }
          }
        }
        .content {
          display: flex;
          flex: 1;
          flex-direction: column;
          background-color: #fff;
          border: 2px solid #191414;
          border-radius: 4px;
          padding: 2px;
          min-height: 140px;
          .headings {
            color: #191414;
            padding-bottom: 6px;
            #end {
              text-align: right;
            }
          }
          .rows {
            display: flex;
            flex: 1;
            padding: 1px;
            .slot {
              flex: 1;
              height: 100%;
              border-radius: 4px;
              text-align: left;
            }
            .free {
              background-color: #5d6d7e;
            }
            .busy {
              background-color: #1c3f95;
            }
            .fill {
              background-color: transparent;
            }
          }
        }
      }
    }
    .hide {
      display: none;
    }
    .show {
      display: auto;
    }
  }
  .space {
    flex: 1;
  }
  .panel {
    min-height: fit-content;
    background-color: #191414;
    color: white;
    border-radius: 10px;
    padding: 10px;
    justify-content: space-between;
    hr {
      border: 2px solid #5d6d7e;
      border-radius: 2px;
      margin-bottom: 0;
    }
    h3 {
      margin: 0 0 8px;
    }
    h4 {
      color: #0daddd;
    }
    p {
      margin: 0 0 2px;
    }
    .comments {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      max-height: 250px;
      padding-right: 8px;
    }
    .comment-wrapper {
      padding-bottom: 1px;
    }
    .comment {
      display: flex;
      background-color: #212f3d;
      border: 1px solid #fff;
      border-radius: 7px;
    }
    .left,
    .right {
      padding: 5px 6px;
    }
    .left {
      width: 90px;
      border-right: 1px solid #fff;
      h4 {
        color: #0daddd;
      }
      p {
        color: #fff;
        font-weight: 600;
      }
    }
  }
  .right {
    flex: 1;
  }
  .post-comment {
    margin-top: 10px;
    form {
      display: flex;
      input {
        padding: 6px;
        border-radius: 7px;
      }
      button {
        margin: 0;
        height: 35px;
      }
      button:hover {
        transform: translate(0);
      }
    }
  }
  @media (min-width: 768px) {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    flex-direction: row;
    .main {
      background-color: #f0f0f0;
      border-radius: 20px 0 0 20px;
      flex: 1;
      padding: 10px 50px 40px 40px;
      min-height: 400px;
    }
    .space {
      display: none;
    }
    .panel {
      display: flex;
      flex-direction: column;
      width: 30vw;
      min-width: 15rem;
      border-radius: 0 20px 20px 0;
      padding: 30px;
      h3 {
        margin-bottom: 20px;
      }
      .comments {
        max-height: 40vh;
        flex: 1;
      }
      .post-comment {
        form {
          margin: 0 0 10px;
          width: 100%;
          button {
            width: 100%;
          }
        }
      }
    }
  }
`;

export default ViewInspection;
