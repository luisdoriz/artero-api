const express = require("express");
const router = express.Router();
const passport = require("passport");

const Appointment = require("../../models/Appointment");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newAppointment = new Appointment({
      patient: req.body.patientId,
      doctor: req.user.id,
      systolicPressure: req.body.systolicPressure,
      diastolicPressure: req.body.diastolicPressure,
    });
    newAppointment.save().then((appointment) => res.status(200).json(appointment)).catch(err =>
      res.status(404).json({ message: "An error ocurred when tried to save appointment" })
    );
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Appointment.find({ patient: req.params.id }).then((appointments) => res.status(200).json(appointments)).catch(err =>
      res.status(404).json({ message: "No appointments" })
    );
  }
);

module.exports = router;
