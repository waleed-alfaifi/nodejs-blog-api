var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var createError = require('http-errors');

const dbUrl = 'mongodb://localhost:27017/blog_db';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var authRouter = require('./routes/auth');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var passportRouter = require('./routes/passport');

var app = express();
require('./passport');

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/passport', passportRouter);

/* Errors handling middlewares */
// First, middleware to handle 404 error.
app.use((req, res, next) => next(createError(404)));

// Second, middleware to handle unprocessable data error.
app.use((err, req, res, next) => {
  if (
    err.name === 'MongoError' ||
    err.name === 'ValidationError' ||
    err.name === 'CastError'
  ) {
    err.status = 422;
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error handling data.',
    body: req.body,
  });
});

mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
  },
  err => {
    if (err) throw err;
    console.log('Connected to DB successfully.');
  }
);

module.exports = app;
