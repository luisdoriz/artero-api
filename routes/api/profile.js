const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

router.post(
  "/newProfile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newProfile = new Profile({
      user: req.user.id,
      role: req.body.role
    });

    newProfile
      .save()
      .then(user => res.status(200).json(user))
      .catch(err =>
        res.status(200).json({ message: "An error ocurred when tried to save profile" })
      );
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      res.status(200).json(profile);
    }).catch(err => res.status(404).json({ error: 'There is no profile for this user.' }));
  }
);

module.exports = router;
