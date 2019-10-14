const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const DiagnosisSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  wheight: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("diagnosis", DiagnosisSchema);
