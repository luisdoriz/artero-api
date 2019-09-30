const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  role: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true,
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
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      }
    }
  ],
  doctors: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("profile", ProfileSchema);
