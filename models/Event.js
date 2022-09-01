const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// todo - implement reoccurring lunches

const schema = Schema(
  {
    title: {type: String},
    start: {type: String},
    end: {type: String},
    isRecurring: {type: Boolean},
    recurrencePattern: {type: String}
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", schema);

module.exports = Event;
