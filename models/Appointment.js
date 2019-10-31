const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const AppointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  systolicPressure: {
    type: Number,
    required: true,
  },
  wheight: {
    type: Number,
  },
  cr: {
    type: Number,
  },
  icm: {
    type: Number,
  },
  diastolicPressure: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("appointment", AppointmentSchema);
