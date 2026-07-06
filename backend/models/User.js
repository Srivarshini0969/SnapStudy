const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim:true
  },

  email:{
type:String,
required:true,
unique:true,
lowercase:true,
trim:true
},
  secretName: {
  type: String,
  required: true,
  trim:true
},
 
password: {
    type: String,
    required: true
},

resetPasswordToken: String,
resetPasswordExpires: Date,

// Email Verification
isVerified: {
    type: Boolean,
    default: false
},

verificationToken: String,

verificationExpires: Date

 

});

module.exports = mongoose.model("User", UserSchema);