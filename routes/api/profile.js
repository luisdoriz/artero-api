const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

router.post(
  "/newPatient",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newProfile = new Profile({
      handleName: req.body.name,
      email: req.body.email,
      doctor: req.user.id,
      birthday: req.body.birthday,
      height: req.body.height,
      weight: req.body.weight,
      sex: req.body.sex,
    });
    newProfile
      .save()
      .then(patientProfile => {
        Profile.findOne({ user: req.user.id }).populate('patients.patient', ['handleName']).then(doctorProfile => {
          console.log(doctorProfile.patients)
          if (
            doctorProfile.patients.filter(
              patient => patient.patient.handleName === req.body.handleName
            ).length > 0
          ) {

            newProfile.remove().then(() => res.status(200).json({
              response: {
                message: req.body.name + " is already your patient",
                status: "null"
              }
            }));
          }
          const patientData = {
            patient: patientProfile.id
          };
          doctorProfile.patients.unshift(patientData);
          doctorProfile.save().then(() => res.status(200).json({ patientProfile, doctorProfile })).catch(err =>
            res.status(200).json({ message: "An error ocurred when tried to save profile" })
          );
        });
      })
      .catch(err =>
        res.status(200).json({ message: "An error ocurred when tried to save profile" })
      );
  }
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
    ).then(profile => res.json(profile)).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

router.put(
  "/patient",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndUpdate(
      { _id: req.body.id },
      { $set: req.body },
    ).then(profile => res.json(profile)).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).populate("user", ["email"]).then(profile => {
      res.status(200).json(profile);
    }).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

router.get(
  "/patient",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findById(req.body.id).then(profile => {
      res.status(200).json(profile);
    }).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

module.exports = router;
