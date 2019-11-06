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
  medicines: [
    {
      medicine: {
        type: Schema.Types.ObjectId,
        ref: 'medicine',
      },
    }
  ],
  cr: {
    type: Number,
  },
  icm: {
    type: Number,
  },
  hipertension: {
    type: String,
    default: "Normal",
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
