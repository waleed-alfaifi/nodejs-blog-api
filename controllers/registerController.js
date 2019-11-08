const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = (req, res, next) => {
  const { name, email, password } = req.body;
  let newUser = new User({
    name,
    email,
    password,
  });

  newUser
    .save()
    .then(user => {
      let token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        'super-secret-key'
      );

      res.json({ token, id: user._id });
    })
    .catch(next);
};
