const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/addPatient', passport.authenticate('jwt', { session: false }), (req, res) => {
  const email = req.body.email;
  // Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      
      return res.status(200).json({ 
        response: { 
          message: 'An email have been delivered to'+ email,
          status: 'new',
        } 
      });
    }
    res.status(200).json({
      response: {
        message: user.name + ' is your new patient',
        status: 'done',
      }
    });
  });
});

module.exports = router;