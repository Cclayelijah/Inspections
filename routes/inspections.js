const express = require("express");
const router = require("express").Router();
const verify = require("./verifyToken");
const authorize = require("./authorize");
const dayjs = require("dayjs");

const Inspection = require("../models/Inspection");
const User = require("../models/User");
const Inspector = require("../models/Inspector");
const Manager = require("../models/Manager");
const {
  newInspection,
  requestInspection,
  logInspection,
  updateInspection,
  clientUpdateInspection,
  schedulePending,
  cancelInspection,
} = require("../validation");
const { numDaysInMonth } = require("../client/src/globals");

getUser = async (userType, _id) => {
  if (userType == "client") {
    return User.findOne({ _id }).then((user) => user._doc);
  }
  if (userType == "inspector") {
    return Inspector.findOne({ _id }).then((user) => user._doc);
  }
  if (userType == "manager") {
    return Manager.findOne({ _id }).then((user) => user._doc);
  }
};

getStatus = async (inspectionId) => {
  return Inspection.findOne({ _id: inspectionId }).then(
    (result) => result.status
  );
};

// View relevant inspections - working
router.get("/", verify, async (req, res) => {
  //Inspector sees scheduled inspections
  //Client sees in-progress inspections (not completed or canceled)
  //Manager sees in-progress inspections

  try {
    let inspections;
    console.log(req.user.userType + ": " + req.user.id);

    if (req.user.userType === "client") {
      const inProgress = await Inspection.find(
        {
          client: req.user.organization,
          status: { $in: ["Pending", "Scheduled", "Re-Schedule"]},
        },
        "status type name inspector location timePreference start"
      );

      inspections = { inProgress };
    }

    if (req.user.userType === "inspector") {
      const scheduled = await Inspection.find(
        {
          status: "Scheduled",
          inspector: req.user.id,
        },
        "status type name client location start"
      );

      inspections = { scheduled };
    }

    if (req.user.userType === "manager") {
      const awaitingManager = await Inspection.find(
        {
          status: { $in: ["Pending", "Re-Schedule"]},
        },
        "status type name client location start"
      );
      const awaitingInspector = await Inspection.find(
        {
          status: "Scheduled",
          end: { $gt: dayjs().format("MM/DD/YYYY h:mm A") },
        },
        "status type name client inspector location start"
      );

      inspections = { awaitingManager, awaitingInspector };
    }
    console.log(inspections);
    res.json(inspections);
  } catch (err) {
    res.status(400).send("Something went wrong. ", err);
  }
});

// View completed inspections - working
router.get("/completed", verify, async (req, res) => {
  let inspections;

  try {
    if (req.user.userType === "client") {
      inspections = await Inspection.find(
        {
          client: req.user.organization,
          status: "Completed",
        },
        "status type name inspector location timePreference start"
      ).exec();
    }

    if (req.user.userType === "inspector") {
      inspections = await Inspection.find(
        {
          inspector: req.user.id,
          status: "Completed",
        },
        "status type name client location start"
      ).exec();
    }

    if (req.user.userType === "manager") {
      inspections = await Inspection.find(
        {
          status: "Completed",
        },
        "status type name client location start"
      ).exec();
    }

    res.json(inspections);
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem.");
  }
});

// View canceled inspections
router.get("/canceled", verify, async (req, res) => {
  let inspections;

  try {
    if (req.user.userType === "client") {
      inspections = await Inspection.find(
        {
          client: req.user.organization,
          status: "Canceled",
        },
        "status type name inspector location timePreference start"
      ).exec();
    }

    if (req.user.userType === "inspector") {
      inspections = await Inspection.find(
        {
          inspector: req.user.id,
          status: "Canceled",
        },
        "status type name client location start"
      ).exec();
    }

    if (req.user.userType === "manager") {
      inspections = await Inspection.find(
        {
          status: "Canceled",
        },
        "status type name client location start"
      ).exec();
    }

    console.log(inspections);
    res.json(inspections);
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem.");
  }
});

// View Inspection - working
router.get("/:inspectionId", verify, async (req, res) => {
  const inspection = await Inspection.findById(req.params.inspectionId).catch(
    (err) => {
      console.log(err);
      return res.status(400).send("There was a problem.");
    }
  );
  if (!inspection)
    return res.status(400).send("This inspection could not be found.");

  let data;
  const {
    status,
    type,
    name,
    location,
    client,
    inspector,
    timePreference,
    start,
    end,
    guests,
    comments,
    log,
    createdAt,
    updatedAt,
  } = inspection;

  if (req.user.userType == "client") {
    let public = []; // only show public comments to client
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].public) public.push(comments[i]);
    }
    data = {
      status,
      type,
      name,
      inspector,
      location,
      timePreference, // only show if not already scheduled
      start,
      end,
      guests,
      comments: public,
    };
  }
  if (req.user.userType == "inspector") {
    data = {
      status,
      type,
      name,
      client,
      location,
      start,
      end,
      comments,
      log,
    };
  }
  if (req.user.userType == "manager") {
    data = {
      status,
      type,
      name,
      client,
      inspector,
      location,
      timePreference,
      start,
      end,
      comments,
      log,
      createdAt,
      updatedAt,
    };
  }

  res.json(data);
});

// View inspections by inspector
router.get("/:inspectorId", verify, authorize, async (req, res) => {});

// View inspections by client
router.get("/:cliendId", verify, authorize, async (req, res) => {});

// inspection request form - working
router.post("/request", verify, async (req, res) => {
  const { value, error } = requestInspection.validate(req.body);
  console.log(value);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await getUser(req.user.userType, req.user.id);

  let addedInspections = new Array(Inspection);
  for (i = 0; i < value.inspections.length; i++) {
    let inspection;
    if (value.inspections[i].comment) {
      inspection = new Inspection({
        status: "Pending",
        type: value.inspections[i].type,
        name: value.inspections[i].name,
        timePreference: value.inspections[i].timePreference,
        comments: [
          {
            userType: req.user.userType,
            firstName: user.firstName,
            lastName: user.lastName,
            comment: value.inspections[i].comment,
            public: value.inspections[i].publicComment,
            timestamp: dayjs().format("MM/DD/YYYY h:mm A"),
          },
        ],
        location: {
          address: value.address,
          city: value.city,
          state: value.state,
          zip: value.zip,
        },
        client: value.client,
        createdBy: value.createdBy,
        guests: value.inspections[i].guests,
      });
    } else {
      inspection = new Inspection({
        status: "Pending",
        type: value.inspections[i].type,
        name: value.inspections[i].name,
        timePreference: value.inspections[i].timePreference,
        location: {
          address: value.address,
          city: value.city,
          state: value.state,
          zip: value.zip,
        },
        comments: [],
        client: value.client,
        createdBy: value.createdBy,
        guests: value.inspections[i].guests,
      });
    }

    try {
      const savedInspection = await inspection.save();
      addedInspections.push(savedInspection);
      console.log(savedInspection);
    } catch (err) {
      return res.status(400).send("Failed to create inspection: " + err);
    }
  }
  res.json({ message: "Success!" });
});

// Manager's new inspection form - working
router.post("/new", verify, authorize, async (req, res) => {
  const { value, error } = newInspection.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // todo make array not include starting value of null
  const user = await getUser(req.user.userType, req.user.id);
  let addedInspections = new Array(Inspection);
  for (i = 0; i < value.inspections.length; i++) {
    const start =
      dayjs(value.inspections[i].date).format("MM/DD/YYYY") +
      " " +
      value.inspections[i].time;
    const end = dayjs(start)
      .add(value.inspections[i].duration, "hour")
      .format("MM/DD/YYYY h:mm A");
    let inspection = new Inspection({
      status: "Scheduled",
      type: value.inspections[i].type,
      name: value.inspections[i].name,
      client: value.client,
      inspector: value.inspections[i].inspector,
      location: {
        address: value.address,
        city: value.city,
        state: value.state,
        zip: value.zip,
      },
      start,
      end,
      comments: [
        {
          userType: req.user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          comment: value.inspections[i].comment,
          public: value.inspections[i].publicComment,
          timestamp: dayjs().format("MM/DD/YYYY h:mm A"),
        },
      ],
    });
    try {
      const savedInspection = await inspection.save();
      addedInspections.push(savedInspection);
      console.log(savedInspection);
    } catch (err) {
      return res.status(400).send("Failed to create inspection: " + err);
    }
  }
  res.send("Success!");
});

// Manager: schedule pending inspection - working
router.post("/schedule/:inspectionId", verify, authorize, async (req, res) => {
  const { value, error } = schedulePending.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const status = await getStatus(req.params.inspectionId);
  if (status == "Scheduled" || status == "Completed")
    return res.status(400).send("This inspection has already been scheduled.");

  const data = {
    status: "Scheduled",
    inspector: value.inspector,
    start: value.start,
    end: value.end,
  };

  try {
    let updated;
    await Inspection.updateOne(
      { _id: req.params.inspectionId },
      { $set: data }
    );
    if (value.comment) {
      let user = await getUser(req.user.userType, req.user.id);
      let inspection = await Inspection.findOne({
        _id: req.params.inspectionId,
      });
      inspection.comments.push({
        userType: req.user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        comment: value.comment,
        public: value.publicComment,
        timestamp: dayjs().format("MM/DD/YYYY h:mm A"),
      });
      updated = inspection.save();
    }
    //console.log(updated);
    res.json({message: "Inspection details were updated.", success: true});
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong.");
  }
});

// Client can edit inspections that aren't already scheduled - working
router.patch("/user/:inspectionId", verify, async (req, res) => {
  const { value, error } = clientUpdateInspection.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const status = getStatus(req.params.inspectionId);
  if (status == "Scheduled" || status == "Completed")
    return res.status(400).send("You are unable to edit this inspection.");

  try {
    const updated = await Inspection.updateOne(
      { _id: req.params.inspectionId },
      { $set: value }
    );
    console.log(value);
    res.json({ message: "Inspection details were updated." });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Managers can revert completed inspections to undo an accidental log - working
router.post("/revert/:inspectionId", verify, authorize, async (req, res) => {
  let status = await getStatus(req.params.inspectionId);
  if (status != "Completed")
    return res.status(400).send("You can only revert completed inspections.");

  try {
    const updated = await Inspection.updateOne(
      { _id: req.params.inspectionId },
      {
        $set: {
          status: "Scheduled",
          reverted: dayjs().format("MM/DD/YYYY h:mm A"),
        },
        $unset: { log: {} },
      }
    );
    res.send("Inspection was reverted.");
  } catch (err) {
    res.send("There was a problem.");
    console.log(err);
  }
});

// Manager can edit any inspection - working
router.patch("/:inspectionId", verify, authorize, async (req, res) => {
  const { value, error } = updateInspection.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let insertObj = {
    start: value.start,
    end: value.end,
    timePreference: value.timePreference,
    location: {
      address: value.location.address,
      city: value.location.city,
      state: value.location.state,
      zip: value.location.zip,
    },
    inspector: value.inspector,
  };

  // log information can only be edited when status = completed
  let status = await getStatus(req.params.inspectionId);
  if (
    status == "Completed" &&
    (value.log.hours || value.log.miles || value.log.notes)
  ) {
    insertObj = {
      start: value.start,
      end: value.end,
      timePreference: value.timePreference,
      location: {
        address: value.location.address,
        city: value.location.city,
        state: value.location.state,
        zip: value.location.zip,
      },
      inspector: value.inspector,
      log: {
        hours: value.log.hours,
        miles: value.log.miles,
        notes: value.log.notes,
        updated: dayjs().format("MM/DD/YYYY h:mm A"),
        updatedBy: req.user.id,
      },
    };
  }

  try {
    const result = await Inspection.updateOne(
      { _id: req.params.inspectionId },
      {
        $set: insertObj,
      }
    );
    if (result) return res.send("Inspection details were updated.");
  } catch (err) {
    console.log(err);
  }
  return res.status(400).send("There was a problem.");
});

// Inspectors and managers can cancel any In-Progress inspection
router.post("/staff/:inspectionId", verify, async (req, res) => {
  if (req.user.userType === "client")
    return res.status(403).send("Access Denied.");

  let inspection = await Inspection.findOne({ _id: req.params.inspectionId });
  if (!inspection)
    return res.status(400).send("This inspection could not be found.");

  if (inspection.status === "Canceled")
    return res.status(400).send("This inspection was already canceled.");

  if (inspection.status === "Completed")
    return res.status(400).send("This inspection was already completed.");
  
    const { value, error } = cancelInspection.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  try {
    let updated;
    if (value.comment) {
      const user = await getUser(req.user.userType, req.user.id);
      inspection.comments.push({
        userType: "client",
        firstName: user.firstName,
        lastName: user.lastName,
        comment: value.comment,
        public: false,
        timestamp: dayjs().format("MM/DD/YYYY h:mm A"),
      });
      updated = await inspection.save();
    }
    let status;
    if (value.reschedule) {
      status = "Re-Schedule";
    } else {
      status = "Canceled";
    }
    await Inspection.updateOne(
      { _id: req.params.inspectionId },
      {
        $set: {
          status,
        },
      }
    );

    console.log(updated);
    if (status === "Re-Schedule")
      res.json({message: "Inspection will be re-scheduled."});
    if (status === "Canceled") res.json({message: "Inspection was canceled."});
  } catch (err) {
    res.status(400).json({message: "Something went wrong.", err});
  }
});

// Client can cancel inspections 24 hours before startDate -
router.post("/user/:inspectionId", verify, async (req, res) => {
  if (req.user.userType != "client")
    return res.status(403).send("Access Denied.");

  let inspection = await Inspection.findOne({ _id: req.params.inspectionId });
  if (!inspection)
    return res.status(400).send("This inspection could not be found.");

  if (inspection.status === "Canceled")
    return res.status(400).send("This inspection was already canceled.");

  if (inspection.status === "Completed")
    return res.status(400).send("This inspection was already completed.");
  else {
    // if scheduled, check if not too late to cancel
    if (inspection.status === "Scheduled") {
      if (dayjs(inspection.start).diff(dayjs(), "hours") < 24)
        // also returns true if startDate is in the past
        return res
          .status(403)
          .send("You cannot cancel within 24 hours of the inspection.");
    }

    const { value, error } = cancelInspection.validate(req.body);
    if (error) {
      return res.status(400).json({message: error.details[0].message});
    }

    try {
      let updated;
      if (value.comment) {
        const user = await getUser(req.user.userType, req.user.id);
        inspection.comments.push({
          userType: "client",
          firstName: user.firstName,
          lastName: user.lastName,
          comment: value.comment,
          public: true,
          timestamp: dayjs().format("MM/DD/YYYY h:mm A"),
        });
        updated = await inspection.save();
      }
      let status;
      if (value.reschedule) {
        status = "Re-Schedule";
      } else {
        status = "Canceled";
      }
      await Inspection.updateOne(
        { _id: req.params.inspectionId },
        {
          $set: {
            status,
          },
        }
      );

      console.log(updated);
      if (status === "Re-Schedule")
        res.json({message: "Inspection will be re-scheduled."});
      if (status === "Canceled") res.json({message: "Inspection was canceled."});
    } catch (err) {
      res.status(400).json({message: "Something went wrong.", err});
    }
  }
});

//todo
// Client can re-submit canceled inspections
router.patch("/user/:inspectionId", verify, async (req, res) => {});

// Client can delete canceled inspections - working
router.delete("/user/:inspectionId", verify, async (req, res) => {
  const { status } = req.body.status;
  if (status != "Canceled")
    return res.status(403).send("You cannot delete this inspection.");

  try {
    const removed = await Inspection.remove({ _id: req.params.inspectionId });
    res.send("Inspection was deleted.");
  } catch (err) {
    res.json({ message: err });
  }
});

// Manager can delete any inspection that hasn't been completed - working
router.delete("/:inspectionId", verify, authorize, async (req, res) => {
  const { status } = req.body;
  if (status == "Completed")
    return res.status(400).send("You cannot delete this inspection.");

  try {
    const removed = await Inspection.remove({ _id: req.params.inspectionId });
    res.send("Inspection was deleted.");
  } catch (err) {
    res.json({ message: err });
  }
});

// Inspector logging inspection - working
router.post("/log/:inspectionId", verify, async (req, res) => {
  if (req.user.userType != "inspector")
    return res.status(403).send("Only inspectors can log inspection reports.");

  const { value, error } = logInspection.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  console.log(value);

  try {
    Inspection.findOne({ _id: req.params.inspectionId }).then((result) => {
      if (result) {
        if (result.status === "Scheduled") {
          Inspection.updateOne(
            { _id: req.params.inspectionId },
            {
              $set: {
                status: "Completed",
                log: {
                  hours: value.hours,
                  miles: value.miles,
                  notes: value.notes,
                  submitted: dayjs().format("MM/DD/YYYY h:mm A"),
                },
              },
            }
          )
            .then(() => {
              console.log("logged");
              res.json({ message: "Inspection was logged.", updated: true });
            })
            .catch((err) => console.log(err));
        } else {
          return res
            .status(403)
            .send("You can only log reports for Scheduled inspections.");
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Inspector marking inspection "not completed" - working
router.patch("/log/:inspectionId", verify, async (req, res) => {
  if (req.user.userType != "inspector")
    return res.status(403).send("Only inspectors can log inspection reports.");

  try {
    const updated = await Inspection.updateOne(
      { _id: req.params.inspectionId },
      { $set: { status: "Not Completed" } }
    );
    res.json({ message: "Inspection was marked not completed.", updated: true });
  } catch (err) {
    res.json({ message: err });
  }
});

// post a comment to inspection
router.post("/comment/:inspectionId", verify, async (req, res) => {
  const newComment = req.body;
  console.log(newComment);
  try {
    const updated = await Inspection.updateOne(
      { _id: req.params.inspectionId },
      {
        $push: { comments: newComment },
      }
    );
    console.log(updated);
    res.json({ message: "Comment was posted", posted: true, newComment });
  } catch (err) {
    console.log(err);
    res.json({ error: err, posted: false });
  }
});

// gets a list of events(inspections) for a given inspector in the month
router.post("/availability/inspector", verify, async (req, res) => {
  const { userId, month } = req.body;
  let year = dayjs().year();
  if (month < dayjs().month()) year++;

  try {
    const events = await Inspection.find(
      {
        inspector: userId,
        status: "Scheduled",
      },
      "name location start end"
    );
    let calendar = new Array(numDaysInMonth(month) + 1);
    for (let i = 1; i <= numDaysInMonth(month) + 1; i++) {
      calendar[i] = [];
    }
    for (let i = 1; i <= numDaysInMonth(month) + 1; i++ ) {
        events.map((inspection) => {
          const startDate = dayjs(new Date(inspection.start)).format("MM/DD/YYYY");
          if (startDate == dayjs(new Date(year, month, i)).format("MM/DD/YYYY")) {
            calendar[i].push(inspection);
          }
        });
      }
      
    res.json(calendar);
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem.");
  }
});

module.exports = router;
