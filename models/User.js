const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    email: {},
    password: {},
    organization: { type: String, default: null },
    firstName: {},
    lastName: {},
    phone: {},
    userType: {},
  },
  { timestamps: true }
);

const User = mongoose.model("User", schema);

module.exports = User;
