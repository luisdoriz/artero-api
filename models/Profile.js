const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handleName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  birthday: {
    type: Date,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  sex: {
    type: Boolean,
  },
  patients: [
    {
      patient: {
        type: Schema.Types.ObjectId,
        ref: 'profile',
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("profile", ProfileSchema);
