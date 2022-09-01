const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = Schema(
  {
    name: { type: String },
    address: {},
    users: [{ type: ObjectId, ref: "User" }], // Array of user IDs
    pendingUsers: [{ type: ObjectId, ref: "User" }],
    contact: { type: ObjectId, ref: "User" }, // User ID
    timePreference: { type: String },
    website: {},
    calendar: { type: ObjectId, ref: "Calendar" },
    billingSchedule: { type: String }, // billing not in version 1
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", schema);

module.exports = Client;
