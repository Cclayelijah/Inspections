const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const schema = Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    certs: [String],
    isManager: { type: Boolean, required: true },
    resetPass: { type: Boolean, required: true },
    userType: { type: String, required: true },
  },
  { timestamps: true }
);

const Inspector = mongoose.model("Inspector", schema);

module.exports = Inspector;
