const Post = require('../models/post');
const createError = require('http-errors');
const mongoose = require('mongoose');

exports.addComment = (req, res, next) => {
  let newComment = {
    _id: mongoose.Types.ObjectId(),
    content: req.body.content,
    author: req.user.id,
  };

  Post.findById(req.params.postId)
    .then(post => {
      if (!post) throw createError(404);
      post.comments.push(newComment);
      post.save();
      res.json({ success: 'Added comment successfully.' });
    })
    .catch(error => {
      res.status(500);
      console.error(error);
    });
};

exports.getComments = (req, res, next) => {
  Post.findById(req.params.postId)
    .populate('comments.author', 'name')
    .then(post => {
      if (!post) throw createError(404, 'No post with such id.');
      res.json(post.comments);
    })
    .catch(next);
};
