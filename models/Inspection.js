const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = Schema(
  {
    status: { type: String },
    type: { type: String }, // event info
    name: { type: String }, // event info
    start: { type: String }, // event info
    end: { type: String }, // event info
    timePreference: { type: String },
    location: {},
    inspector: {
      type: ObjectId,
      ref: "Inspector",
    },
    client: {
      type: ObjectId,
      ref: "Client",
    },
    createdBy: {
      userType: { type: String },
      userId: { type: String },
    },
    guests: [String], // for client to use
    comments: [
      {
        userType: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        comment: { type: String },
        public: { type: Boolean },
        timestamp: { type: String },
      },
    ],
    log: {
      hours: { type: Number },
      miles: { type: Number },
      notes: { type: String },
      submitted: { type: String },
      updated: { type: String },
      updatedBy: { type: ObjectId, ref: "Manager" },
    },
    reverted: { type: String },
  },
  { timestamps: true }
);

const Inspection = mongoose.model("Inspection", schema);

module.exports = Inspection;
