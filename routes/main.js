const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Client = require("../models/Client");
const Manager = require("../models/Manager");
const Inspector = require("../models/Inspector");
const User = require("../models/User");
const {
  checkLogin,
  createManager,
  createInspector,
  createUser,
} = require("../validation");

router.get("/isUserAuth", async (req, res) => {
  const token = req.header("auth-token");
  //console.log("token: " + token);
  if (!token) return res.json({ message: "No token", isLoggedIn: false });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: verified, isLoggedIn: true });
  } catch (err) {
    res.json({ message: "Invalid Token", isLoggedIn: false });
  }
});

router.post("/signup", async (req, res) => {
  const { value, error } = createUser.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let takenEmail = await User.findOne({ email: value.email });
  if (!takenEmail) {
    takenEmail = await Inspector.findOne({ email: value.email });
    if (!takenEmail) takenEmail = await Manager.findOne({ email: value.email });
  }

  if (takenEmail) return res.status(409).send("Email has already been taken.");

  const hashed = await bcrypt.hash(value.password, 10);
  const user = new User({
    email: value.email,
    password: hashed,
    userType: "client",
    firstName: value.firstName,
    lastName: value.lastName,
    phone: value.phone,
  });
  try {
    const savedUser = await user.save();
    return res.json("Account has been created successfully.");
    //TODO automatic login after signing up
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { value, error } = checkLogin.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const login = (
    hashed,
    userType,
    id,
    firstName,
    lastName,
    access,
    organization
  ) => {
    bcrypt.compare(value.password, hashed).then((validPassword) => {
      if (!validPassword)
        return res.status(400).send({
          message: "Email or password is incorrect.",
          isLoggedIn: false,
        });
      else {
        let payload;
        if (userType === "client") {
          payload = {
            id,
            organization,
            email: value.email,
            userType,
            firstName,
            lastName,
          };
        }
        if (userType === "inspector") {
          payload = {
            id,
            email: value.email,
            userType,
            access, // for inspectors
            firstName,
            lastName,
          };
        }
        if (userType === "manager") {
          payload = {
            id,
            email: value.email,
            userType,
            firstName,
            lastName,
          };
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.json({ token, message: "logged in!", isLoggedIn: true });
      }
    });
  };

  try {
    let exists = await User.findOne({ email: value.email });
    if (exists) {
      login(
        exists.password,
        "client",
        exists._id,
        exists.firstName,
        exists.lastName,
        false,
        exists.organization
      );
    } else {
      exists = await Inspector.findOne({ email: value.email });
      if (exists) {
        login(
          exists.password,
          "inspector",
          exists._id,
          exists.firstName,
          exists.lastName,
          exists.isManager
        );
      } else {
        exists = await Manager.findOne({ email: value.email });
        if (exists) {
          login(
            exists.password,
            "manager",
            exists._id,
            exists.firstName,
            exists.lastName
          );
        } else {
          return res.status(400).send({
            message: "Email or password is incorrect.",
            isLoggedIn: false,
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/inspectors/add", async (req, res) => {
  const { value, error } = createInspector.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  // data is valid

  try {
    let exists = await User.findOne({ email: value.email });
    if (exists) {
      return res.status(409).send("Email has already been taken.");
    } else {
      exists = await Inspector.findOne({ email: value.email });
      if (exists) {
        return res.status(409).send("Email has already been taken.");
      } else {
        exists = await Manager.findOne({ email: value.email });
        if (exists) {
          return res.status(409).send("Email has already been taken.");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  const hashed = await bcrypt.hash(value.password, 10);
  const inspector = new Inspector({
    email: value.email,
    password: hashed,
    firstName: value.firstName,
    lastName: value.lastName,
    phone: value.phone,
    resetPass: value.resetPass,
    isManager: value.isManager,
    userType: "inspector",
  });

  try {
    inspector.save().then((result) => {
      return res.json("Inspector has been successfully created.");
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/managers/add", async (req, res) => {
  const { value, error } = createManager.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  // data is valid

  try {
    let exists = await User.findOne({ email: value.email });
    if (exists) {
      return res.status(409).send("Email has already been taken.");
    } else {
      exists = await Inspector.findOne({ email: value.email });
      if (exists) {
        return res.status(409).send("Email has already been taken.");
      } else {
        exists = await Manager.findOne({ email: value.email });
        if (exists) {
          return res.status(409).send("Email has already been taken.");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  const hashed = await bcrypt.hash(value.password, 10);
  const manager = new Manager({
    email: value.email,
    password: hashed,
    firstName: value.firstName,
    lastName: value.lastName,
    phone: value.phone,
    resetPass: value.resetPass,
    userType: "manager",
  });

  try {
    await manager.save();
    res.json("Manager has been successfully created.");
  } catch (err) {
    res.status(400).send(err);
  }
});

// router.get("/clients/:clientId", async (req, res) => {
//   try {
//     const client = Client.findById(req.client);
//     res.json(client);
//   } catch (err) {
//     res.status(400).json({ message: "There was an error getting the client." });
//   }
// });

module.exports = router;
