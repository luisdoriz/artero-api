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
    default:false,
  },
  smoke: {
    type: Boolean,
    default: false,
  },
  hearthDisease: {
    type: Boolean,
    default: false,
  },
  hearthFailure: {
    type: Boolean,
    default: false,
  },
  diabetes: {
    type: Number,
    default: 0,
  },
  renalDisease: {
    type: Boolean,
    default: false,
  },
  prostaticHyperplasia: {
      type: Boolean,
      default: false,
  },
  hyperthyroidism: {
    type: Boolean,
    default: false,
  },
  cough: {
    type: Boolean,
    default: false,
  },
  pregnacy: {
    type: Boolean,
    default: false,
  },
  venousInsufficiency: {
    type: Boolean,
    default: false,
  },
  migraine: {
    type: Boolean,
    default: false,
  },
  goutDisease: {
    type: Boolean,
    default: false,
  },
  cholesterol: {
    type: Number,
    default: 0,
  },
  hdlCholesterol: {
    type: Number,
    default: 0,
  },
  anxiety: {
    type: Boolean,
    default: false,
  },
  cocaineAddiction: {
    type: Boolean,
    default: false,
  },
  depression: {
    type: Boolean,
    default: false,
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
