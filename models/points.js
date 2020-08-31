const mongoose= require("mongoose");
const schemaOptions = {
  collection: "gameplay",
};

const Points = new mongoose.Schema(
  {
    points_added: Number,
  },
  schemaOptions
);

module.exports = mongoose.model("Points", Points);
