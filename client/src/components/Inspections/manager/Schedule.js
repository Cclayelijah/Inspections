import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { numDaysInMonth } from "../../../globals";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {useHistory} from "react-router-dom"

const Schedule = ({ inspection, setInspection }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [scheduling, setScheduling] = useState("hide");
  const [showAvailability, setShowAvailibility] = useState("hide");
  const [inspectors, setInspectors] = useState([]);
  const [inspector, setInspector] = useState();
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(dayjs().month());
  const [dayNum, setdayNum] = useState(dayjs().date());
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [startList, setStartList] = useState([]);
  const [disableStart, setDisableStart] = useState(true);
  const [endList, setEndList] = useState([]);
  const [disableEnd, setDisableEnd] = useState(true);
  const [timeSlots, setTimeSlots] = useState([])

  let eventCount = [0, 1, 2, 3, 4];
  const working = [9, 10, 11, 12, 13, 14, 15]; // from 9 to 4 (9 through 3)
  let year = dayjs().year();

  useEffect(() => {
    // load inspectors
    try {
      fetch(`/api/account/inspectors`, {
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
          setInspectors(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    let inspector; 
    if (inspection){
      if (inspection.status === "Pending" || inspection.status === "Re-Schedule" || inspection.status === "Canceled") {
        inspector = document.getElementById('inspector').value;
        if (inspector){
          getAvailability();
        }
      }
    }
    
  if (month < dayjs().month()) year = dayjs().year() + 1;
  }, [month]);

  useEffect(() => {
    let available = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
    if (events[dayNum]) {
      events[dayNum].forEach(inspection => {
        const slots = document.getElementById(inspection._id).children;
        for (let i = 0; i < slots.length; i++) {
          if (slots[i].className.includes("busy")){
            for (let j = 0; j < available.length; j++) { // remove start time
              if (available[j] === i) {
                available.splice(j, 1);
              }
            }
          }
        }
      });
      let list = [];
      for (let i = 0; i < available.length; i++) {
        let sign = "AM";
        let hour = Math.floor(available[i] / 2) + 9;
        const min = (available[i] % 2) * 3;
        if (hour > 11){
          sign = "PM";
        }
        if (hour > 12){
          hour -= 12;
        }
        list.push({key: available[i], value: `${hour}:${min}0 ${sign}`})
      }
      setStartList(list);
      available.push(14);
      setTimeSlots(available);
    }
  }, [dayNum, inspector]);

  const getAvailability = async () => {
    // returns list of their inspections for the month
    
    const inspector = document.getElementById('inspector').value;
    const send = {
      userId: inspector,
      month
    };

    fetch("/api/inspections/availability/inspector", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(send),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setEvents(data);
        populateStart();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const scheduleShow = () => {
    setScheduling("show");
    // populate Inspector List
  };

  const lastMonth = () => {
    let mo = month;
    mo--;
    if (mo < 1) mo = 12;
    setMonth(mo);
  };

  const nextMonth = () => {
    let mo = month;
    mo++;
    if (mo > 12) mo = 1;
    setMonth(mo);
  };

  const setDayMax = () => {
    setdayNum(numDaysInMonth(month));
  };

  const lastDay = () => {
    let currDay = dayNum;
    currDay--;
    setdayNum(currDay);
    if (currDay < 1) {
      lastMonth();
      setDayMax();
    }
  };

  const nextDay = () => {
    // event objects are stored in an array (day) which is stored in an array (month)
    //  whose index corresponds to what day of the month it is.
    let currDay = dayNum;
    currDay++;
    if (currDay > numDaysInMonth(month)) {
      currDay = 1;
      nextMonth();
    }
    setdayNum(currDay);
  };

  const populateStart = () => {
    setInspector(document.getElementById('inspector').value);
    setDisableStart(false);
  };

  const populateEnd = () => {
    let list = [];
    for (let i = Number(document.getElementById('start').value) + 1; i <= timeSlots.length && timeSlots[i] - 1 == timeSlots[i-1]; i++) {
      let sign = "AM";
      let hour = Math.floor(timeSlots[i] / 2) + 9;
      const min = (timeSlots[i] % 2) * 3;
      if (hour > 11){
        sign = "PM";
      }
      if (hour > 12) {
        hour -= 12;
      }
      list.push(`${hour}:${min}0 ${sign}`)
      
    }

    setEndList(list);
    setDisableEnd(false);
  };

  const submitEnable = () => {
    setDisableSubmit(false);
  };

  const scheduleInspection = (e) => {
    //e.preventDefault();
    const { start, end, inspector } = e.target.elements;
    const d = new Date(dayjs().year(), month, dayNum);
    let date = dayjs(d);
    if (date < dayjs()) {
      // ensures inspections are scheduled in the future and never in the past
      date.year(date.year() + 1);
    }
    let startTime = date.format("MM/DD/YYYY") + " " + start.options[start.selectedIndex].text;
    let endTime = date.format("MM/DD/YYYY") + " " + end.value;
    const scheduleBody = {
      start: startTime,
      end: endTime,
      inspector: inspector.value,
    };

    console.log(scheduleBody);

    fetch(`/api/inspections/schedule/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(scheduleBody),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.message);
        if (data.success) {
          window.location.reload(); // reload page
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (inspection.status != "Scheduled" && inspection.status != "Completed")
    return (
      <Container>
        <div className={`schedule ${scheduling}`}>
          <div className={`availability ${showAvailability}`}>
            <div className="top">
              <div className="part">
                <div className="sign" onClick={lastMonth}>
                  -
                </div>
                <div className="label">{months[month]}</div>
                <div className="sign" onClick={nextMonth}>
                  +
                </div>
              </div>
              <div className="part">
                <div className="sign" onClick={lastDay}>
                  -
                </div>
                <div className="label">{dayNum}</div>
                <div className="sign" onClick={nextDay}>
                  +
                </div>
              </div>
            </div>
            <span>Working 9 - 4</span>
            <div className="content">
              <div className="rows headings">
                <div className="slot fill">9</div>
                <div className="slot fill"></div>
                <div className="slot fill">10</div>
                <div className="slot fill"></div>
                <div className="slot fill">11</div>
                <div className="slot fill"></div>
                <div className="slot fill">12</div>
                <div className="slot fill"></div>
                <div className="slot fill">1</div>
                <div className="slot fill"></div>
                <div className="slot fill">2</div>
                <div className="slot fill"></div>
                <div className="slot fill">3</div>
                <div className="slot fill" id="end">
                  4
                </div>
              </div>

              
              {events ? (events[dayNum] ? (
                events[dayNum].length > 0 ? 
                events[dayNum].map(inspection => {
                  eventCount.pop();
                  return <div key={inspection._id} id={inspection._id} className="rows">
                  {working.map(hour => {
                  return <>
                    <div key={hour} className={`slot ${dayjs(new Date(inspection.start)) <= dayjs(new Date(year, month, dayNum, hour))
                  && dayjs(new Date(inspection.end)) > dayjs(new Date(year, month, dayNum, hour)) ? "busy" : "free"}`}></div>
                    <div key={(hour * 2 + 1) / 2} className={`slot ${dayjs(new Date(inspection.start)) <= dayjs(new Date(year, month, dayNum, hour, 30))
                  && dayjs(new Date(inspection.end)) > dayjs(new Date(year, month, dayNum, hour, 30)) ? "busy" : "free"}`}></div>
                  </>
                  })}
                </div>
                }) : null
              ) : null) : null}
              
              {eventCount.map(i => {
                return <div key={i} className="rows">
                <div className="slot free">{/* 9 */}</div>
                <div className="slot free"></div>
                <div className="slot free">{/* 10 */}</div>
                <div className="slot free"></div>
                <div className="slot free">{/* 11 */}</div>
                <div className="slot free"></div>
                <div className="slot free">{/* 12 */}</div>
                <div className="slot free"></div>
                <div className="slot free">{/* 1 */}</div>
                <div className="slot free"></div>
                <div className="slot free">{/* 2 */}</div>
                <div className="slot free"></div>
                <div className="slot free">{/* 3 */}</div>
                <div className="slot free"></div>
              </div>
              })}
            </div>
          </div>
          <form id="scheduleForm" onSubmit={scheduleInspection}>
            <select
              name="inspector"
              id="inspector"
              required
              onChange={getAvailability} // populate next field based on calendar
            >
              <option value="" disabled selected>
                Inspector
              </option>
              {inspectors
                ? inspectors.map((inspector) => {
                    return (
                      <option key={inspector._id} value={inspector._id}>
                        {inspector.firstName[0].toUpperCase()}
                        {inspector.firstName.substring(1)}{" "}
                        {inspector.lastName[0].toUpperCase()}
                      </option>
                    );
                  })
                : null}
            </select>
            <select
              name="start"
              id="start"
              required
              disabled={disableStart}
              onChange={populateEnd} // populate next field based on calendar
            >
              <option value="" disabled selected>
                Start Time
              </option>
              {startList
                ? startList.map((time) => {
                    return <option value={time.key} key={time.key}>{time.value}</option>;
                  })
                : null}
            </select>
            <select
              name="end"
              id="end"
              required
              disabled={disableEnd}
              onChange={submitEnable} // populate next field based on calendar
            >
              <option value="" disabled selected>
                End Time
              </option>
              {endList
                ? endList.map((time) => {
                    return <option key={time}>{time}</option>;
                  })
                : null}
            </select>
            <button type="submit" disabled={disableSubmit}>
              Schedule
            </button>
          </form>
        </div>
        <button
          onClick={scheduleShow}
          className={scheduling === "hide" ? "show" : "hide"}
        >
          {inspection.status === "Canceled" || inspection.status === "Re-Schedule" ? "Re-" : null}Schedule Inspection
        </button>
      </Container>
    );
  else return null;
};

const Container = styled.div``;

export default Schedule;
