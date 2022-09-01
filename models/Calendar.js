const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = Schema(
  {
    user: {type: ObjectId,},
    userType: {type: String},
    inspections: [{type: ObjectId, ref: 'Inspection'}],
  },
  { timestamps: true }
);

const Calendar = mongoose.model("Calendar", schema);

module.exports = Calendar;
