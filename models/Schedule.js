const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = Schema(
  {
    user: { type: ObjectId, ref: "Inspector" },
    type: { type: String, default: null }, // weekly or ab
    anchor: { type: String }, // date of next monday
    week: {
      toggle: { type: Boolean }, // true means week one starts at anchor, otherwise week two
      one: {
        // index 0 = 8am, 4 = 12pm, 8 = 4pm
        monday: { start: "8:00", end: "4:00" },
        tuesday: { start: "8:00", end: "4:00" },
        wednesday: { start: "8:00", end: "4:00" },
        thursday: { start: "8:00", end: "4:00" },
        friday: { start: "8:00", end: "4:00" },
      },
      two: {
        monday: { start: "8:00", end: "4:00" },
        tuesday: { start: "8:00", end: "4:00" },
        wednesday: { start: "8:00", end: "4:00" },
        thursday: { start: "8:00", end: "4:00" },
        friday: { start: "8:00", end: "4:00" },
      },
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", schema);

module.exports = Schedule;
