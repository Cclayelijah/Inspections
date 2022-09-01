const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const authorize = require("./authorize");
const dayjs = require("dayjs");
const { createClient, clientUpdateAccount } = require("../validation");
const Client = require("../models/Client");
const User = require("../models/User");
const Manager = require("../models/Manager");
const Inspector = require("../models/Inspector");
const { ObjectId } = require("mongodb");
require("dotenv").config();

// Route: /api/account/

// return a user's information
router.get("/user", verify, async (req, res) => {
  try {
    if (req.user.userType === "client") {
      const user = await User.findOne({ _id: req.user.id });
      res.json(user);
    }
    if (req.user.userType === "inspector") {
      const user = await Inspector.findOne({ _id: req.user.id });
      res.json(user);
    }
    if (req.user.userType === "manager") {
      const user = await Manager.findOne({ _id: req.user.id });
      res.json(user);
    }
  } catch (err) {
    res.status(400).json({ message: "something went posting the comment." });
  }
});

// a user can create a new organization
router.post("/organization/register", verify, async (req, res) => {
  if (req.user.userType != "client") {
    return res.status(400).json({
      message:
        "You are not a client user and cannot join an organization from this account",
    });
  }

  const { value, error } = createClient.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const client = new Client({
    name: value.name,
    address: value.address,
    users: value.users,
    contact: value.contact,
    timePreference: value.timePreference,
    website: value.website,
  });
  try {
    const savedClient = await client.save();

    const savedUser = await User.updateOne(
      { _id: req.user.id },
      {
        $set: { organization: savedClient._id },
      }
    );
    if (!savedUser) {
      res
        .status(400)
        .json({ message: "Something went wrong when updating the user's org" });
    } else {
      //sign a new token with organization data
      const payload = {
        id: req.user.id,
        organization: savedClient._id,
        email: req.user.email,
        userType: req.user.userType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.json({
        token,
        user: payload,
        message: "Organization was setup successfully.",
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// User can request to join existing organization
router.post("/organization/join", verify, async (req, res) => {
  const organization = req.body;
  console.log(organization);
});

router.get("/search-organization", verify, async (req, res) => {
  const searchResults = Client.find(
    { $text: { $search: req.body } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  res.json(searchResults);
});

// User updating account info - working
router.post("/update", verify, async (req, res) => {
  const { value, error } = clientUpdateAccount.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedUser = await User.updateOne(
      { _id: req.user.id },
      { $set: value }
    );
    res.json({ message: "User was updated", value });
    console.log(value);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get user organization data
router.get("/organization", verify, async (req, res) => {
  if (req.user.userType !== "client")
    return res
      .status(403)
      .json({ message: "You must be a client user to access this page." });

  try {
    // todo make aggregate join query work!
    const org = Client.aggregate([
      {
        $match: {
          _id: new ObjectId("618ed5d13ef10d550a59e13c"),
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          address: 1,
          timePreference: 1,
          website: 1,
          users: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
    ]);
    //console.log(req.user.organization);
    //const org = Client.findOne({ _id: req.user.organization });
    console.log(org);
    const organization = {
      name: org.name,
      address: org.address,
      timePreference: org.timePreference,
      website: org.website,
      users: org.users,
    };
    console.log(organization);
    res.json(organization);
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});

// returns list of all clients (organizations)
router.get("/clients", verify, authorize, async (req, res) => {
  try {
    const clients = await Client.find();
    console.log(clients);
    res.json(clients);
  }
  catch (err) {
    console.log(err);
  }
})

// returns list of users in an organization
router.get("/organization/users", verify, async (req, res) => {
  // iterate through list of users
  req.body.forEach((id) => {
    console.log(id);
  });
});

// User updating organization info
//router.post();

// Get a list of inspectors
router.get("/inspectors", verify, async (req, res) => {
  try {
    const inspectors = await Inspector.find();
    console.log(inspectors);
    res.json(inspectors);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
