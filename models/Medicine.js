const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const MedicineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  symptoms: [
    {
      type: String,
    }
  ],
  avoid: [
    {
      type: String,
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("medicine", MedicineSchema);
