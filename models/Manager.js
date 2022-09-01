const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    userType: { type: String, required: true },
  },
  { timestamps: true }
);

const Manager = mongoose.model("Manager", schema);

module.exports = Manager;
