const mongoose = require("mongoose");

const snapSchema =
  new mongoose.Schema({

    title: {
      type: String,
      default: ""
    },

    videoUrl: {
      type: String,
      default: ""
    },

    timestamp: {
      type: Number,
      default: 0
    },

    note: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: ""
    },

    channelName: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: null
    },

    lastViewed: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      default: "Pending"
    },
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

  }, {

    timestamps: true

  });

module.exports =
  mongoose.model(
    "Snap",
    snapSchema
  );