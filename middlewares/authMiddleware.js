/* This middleware prevents unauthorized access. */

const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.authenticated = (req, res, next) => {
  // Get the token from the header.
  let token = req.headers['authorization'];

  // Verify the sent token.
  jwt.verify(token, 'super-secret-key', (err, decodedData) => {
    // If not authorized, throw an error.
    if (err) throw createError(401, 'Authentication failed.');

    // Get the user's decoded data.
    let data = {
      id: decodedData.id,
      name: decodedData.name,
      email: decodedData.email,
    };

    // Send the user's data inside the req object.
    req.user = data;

    // If everthing is good, the user is authorized and can go to the desired middlware.
    next();
  });
};

// Middleware to ensure the user is a visitor (e.g. when signing in or registering).
exports.guest = (req, res, next) => {
  let token = req.headers['authorization'];

  jwt.verify(token, 'super-secret-key', (err, decodedData) => {
    // If there is an error, that verifies that the user has no valid token
    // and thus means the user is a visitor.
    if (err) return next();
    throw createError(403);
  });
};
