const express = require("express");
const router = express.Router();
const passport = require("passport");

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
    User.findOne({ email }).then(user => {
      //Check for user
      if (!user) {
        return res.status(200).json({
          response: {
            message: "An email have been delivered to" + email,
            status: "new"
          }
        });
      }
      Profile.findOne({ user: req.user.id })
        .populate("user", ["email"])
        .then(profile => {
          if (
            profile.patients.filter(
              patient => patient.email === req.params.email
            ).length > 0
          ) {
            res.status(200).json({
              response: {
                message: user.name + " is already your patient",
                status: "null"
              }
            });
          }
          profile.patients.unshift({ user: user.id });
          profile.save().then(profile => {
            res.status(200).json({
              response: {
                message: user.name + " is your new patient",
                status: "done"
              }
            });
          });
        });
    });
  }
);

module.exports = router;
