const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  secretName: {
  type: String,
  required: true
},
  resetPasswordToken: String,
  
  resetPasswordExpires: Date,
  password: {
    type: String,
    required: true
  }

});

module.exports =
  mongoose.model(
    "User",
    UserSchema
  );