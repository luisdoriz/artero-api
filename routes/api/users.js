const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
// Load User model
const User = require('../../models/User');

// @route GET api/users/test
// @desc Test users route
// @acces Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route GET api/users/forgot
// @desc recover password
// @acces Public
// router.get('/forgot', (req, res) => {
//   var text = '';
//   var possible =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < 20; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));

//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(text, salt, (err, hash) => {
//       if (err) throw err;
//       User.findOneAndUpdate({ email: req.body.email }, { password: hash }).then(
//         user => {
//           var mailOptions = {
//             to: req.body.email,
//             subject: 'Recuperacion de contrasena',
//             text: `Hola ${user.name} tu contrasena temporal es: ${text}`
//           };
//           mailPassword(mailOptions);
//         }
//       );

//       res.json({ msg: 'Correro enviado' });
//     });
//   });
// });

// @route POST api/users/recoverpassword
// @desc Change password
// @acces Private
// router.post(
//   '/recoverpassword',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(req.body.password, salt, (err, hash) => {
//         if (err) throw err;
//         User.findOneAndUpdate({ email: req.user.email }, { password: hash })
//           .then(res => res.json({ msg: 'Success' }))
//           .catch(err => res.json({ err: 'error' }));
//       });
//     });
//   }
// );

// @route POST api/users/register
// @desc Register
// @acces Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user / Returning JWT
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = { id: user.id, name: user.name, }; //Create JWT Payload
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Incorrect Password';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route GET api/users/current
// @desc Return current user
// @access Private

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);



module.exports = router;
