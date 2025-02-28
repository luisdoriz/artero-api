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
      bronchitis: req.body.bronchitis,
      hearthDisease: req.body.hearthDisease,
      renalDisease: req.body.renalDisease,
      prostaticHyperplasia: req.body.prostaticHyperplasia,
      pregnancy: req.body.pregnancy,
      hyperthyroidism: req.body.hyperthyroidism,
      cough: req.body.cough,
      venousInsufficiency: req.body.venousInsufficiency,
      cardioInsufficiency: req.body.cardioInsufficiency,
      migraine: req.body.migraine,
      goutDisease: req.body.goutDisease,
      anxiety: req.body.anxiety,
      cocaineAddiction: req.body.cocaineAddiction,
      depression: req.body.depression,
      diabetes: req.body.diabetes,
    });
    newProfile
      .save()
      .then(patientProfile => {
        console.log(patientProfile);

        Profile.findOne({ user: req.user.id }).populate('patients.patient', ['handleName']).then(doctorProfile => {
          if (
            doctorProfile.patients.filter(
              patient => patient.patient.handleName === req.body.name
            ).length > 0
          ) {

            newProfile.remove().then(() => res.status(200).json({
              response: {
                message: req.body.name + " is already your patient",
                status: "null"
              }
            }));
          } else {
            const patientData = {
              patient: patientProfile.id
            };
            doctorProfile.patients.unshift(patientData);
            doctorProfile.save().then(() => res.status(200).json({ patientProfile, doctorProfile })).catch(err =>
              res.status(200).json({ message: "An error ocurred when tried to save profile" })
            );
          }
        });
      })
      .catch(err =>
        res.status(400).json({ message: "An error ocurred when tried to save profile", err })
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
    Profile.findOne({ user: req.user.id }).populate("user", ["email"]).populate('patients.patient', ['handleName']).then(profile => {
      res.status(200).json(profile);
    }).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

router.get(
  "/patient/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(doctorProfile => {
      if (
        doctorProfile.patients.filter(
          patient => patient.user === req.params.id
        ).length > 0
      ) {
        res.status(200).json({
          response: {
            message: "You don't have this patient",
          }
        });
      } else {
        Profile.findById(req.params.id).then(patientProfile => {
          res.status(200).json(patientProfile);
        }).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
      }
    }).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

module.exports = router;
