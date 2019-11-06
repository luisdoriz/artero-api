const express = require("express");
const router = express.Router();
const passport = require("passport");

const Medicine = require("../../models/Medicine");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const data = new Medicine({
      name: req.body.name,
      symptoms: req.body.symptoms,
      avoid: req.body.avoid,
    });

    data.save().then(med => res.status(200).json({ status: "Success", data: med })).catch(err => res.status(404).json({ message: "An error ocurred when tried to save the medicine." }));
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Medicine.find().then(medicines => res.status(200).json({ status: "success", data: medicines }));
  }
);

module.exports = router;