const mongoose= require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const schemaOptions = {
  collection: "gameplay",

};

const Users = new mongoose.Schema(
  {
    username: {
        type: String,
        index: true,
        unique: true // Unique index. If you specify `unique: true`
        // specifying `index: true` is optional if you do `unique: true`
      },
  },
  schemaOptions
);
Users.plugin(uniqueValidator,{ type: 'mongoose-unique-validator' });
module.exports = mongoose.model("Users", Users);
