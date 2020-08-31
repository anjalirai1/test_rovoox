const mongoose= require("mongoose");
const schemaOptions = {
  collection: "timetrack",
};

const Time = new mongoose.Schema(
  {
    start_time: Number,
    request:Number,
    username:{
      type: String,
      index: true
    },
    end_time: Number
  },
  schemaOptions
);

module.exports = mongoose.model("Time", Time);
