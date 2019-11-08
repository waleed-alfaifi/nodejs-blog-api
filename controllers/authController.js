const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({
    email,
    password,
  })
    .then(user => {
      if (!user) throw createError(401, 'Incorrect email or password.');

      let dataToBeSent = {
        id: user._id,
        name: user.name,
        email: user.email,
      };

      let token = jwt.sign(dataToBeSent, 'super-secret-key');
      res.json({
        token,
        id: user._id,
      });
    })
    .catch(next);
};

exports.me = (req, res, next) => {
  res.json(req.user);
};
