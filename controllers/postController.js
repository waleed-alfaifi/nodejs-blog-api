const Post = require('../models/post');
const createError = require('http-errors');

exports.getPosts = (req, res, next) => {
  // The populate method takes User(author) data and select wharever files we want (name in this case).

  Post.find()
    .select('-comments')
    .sort({ created_at: -1 })
    .populate('author', 'name')
    .then(posts => {
      res.json(posts);
    })
    .catch(next);
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .populate('author', 'name')
    .populate('comments.author', 'name')
    .then(post => {
      // if (!post) throw createError(404, 'Post not found.');
      res.json(post);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.addPost = (req, res, next) => {
  const { id } = req.user;
  const { title, content } = req.body;

  let newPost = new Post({
    title,
    content,
    author: id,
  });

  newPost
    .save()
    .then(post => {
      res.json({ msg: 'Added post.', post });
    })
    .catch(next);
};

exports.editPost = (req, res, next) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  Post.findOne({ _id: postId, author: req.user.id })
    .populate('author', ['_id', 'name'])
    .then(post => {
      if (!post) throw createError(404);
      post.title = title;
      post.content = content;
      post.save();
      res.json({ success: 'Edited post.', post });
    })
    .catch(next);
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;

  Post.findOneAndDelete({ _id: postId, author: req.user.id })
    .then(post => {
      if (!post) throw createError(404);
      res.json('Deleted post.');
    })
    .catch(next);
};
