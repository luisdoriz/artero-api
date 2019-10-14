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
  weight: {
    type: String,
    required: true
  },
  
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("diagnosis", DiagnosisSchema);
