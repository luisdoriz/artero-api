const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require('../../models/User');
const Profile = require('../../models/Profile');

router.post(
  "/addPatient",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.body.email.toLowerCase();
    if (req.user.email === email) {
      return res.status(200).json({
        response: {
          message: "You can't be your own patient",
          status: "null"
        }
      });
    }
    // Find user by email
    User.findOne({ email: email }).then(user => {
      //Check for user
      if (!user) {
        return res.status(200).json({
          response: {
            message: "An email have been delivered to " + email,
            status: "new"
          }
        });
      }
      Profile.findOne({ user: req.user.id })
        .populate("patients.user", ["email"])
        .then(profile => {
          if (
            profile.patients.filter(
              patient => patient.user.email === req.body.email
            ).length > 0
          ) {
            return res.status(200).json({
              response: {
                message: user.name + " is already your patient",
                status: "null"
              }
            });
          }
          const patientData = {
            user: user.id
          };
          profile.patients.unshift(patientData);
          profile.save().then(profile => {
            Profile.findOne({ user: user.id }).then(patientProfile => {
              const doctorData = {
                user: req.user.id
              };
              patientProfile.doctors.unshift(doctorData);
              patientProfile.save().then(() => res.status(200).json({
                response: {
                  message: user.name + " is your new patient",
                  status: "done"
                }
              }));
            });
          });
        }).catch(err => res.status(404).json({ error: "There is no profile for this user" }));
    });
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).populate("patients.patient", ["name"]).then(profile => {
      res.status(200).json(profile.patients);
    }).catch(err => res.status(404).json({ error: 'There is no patients for this user.' }));
  }
);

router.get(
  "/patient",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findById(req.body.id).then(profile => {
      res.status(200).json(profile);
    }).catch(err => res.status(404).json({ error: 'There is no patients for this user.' }));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.params.id }).then(patient => {
      res.status(200).json(patient);
    }).catch(err => res.status(404).json({ error: 'There is no patients for this user.' }));
  }
);

router.get(
  "/search/:search",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profiles.findById({ user: req.user.id }).populate('patients.patient', ['handleName, email']).then(profile => {
      if (profile.patients.length() === 0) {
        res.status(404).json({ error: 'There is no patients for this user.' });
      }
      const patients = profile.patients.filter(patient => {
        if (
          patient.email.includes(req.params.search)
          ||
          patient.handleName.toLowerCase().includes(req.params.search.toLowerCase())
        ) return patient;
      })
      res.status(200).json(patients);
    })
  }
)

module.exports = router;
