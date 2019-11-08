const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/postController');

const router = express.Router();

// Get all posts
router.get('/', controller.getPosts);

// Get one post by its id
router.get('/:postId', controller.getPost);

// Create a new post
router.post('/', authMiddleware.authenticated, controller.addPost);

// Edit a post
router.put('/:id', authMiddleware.authenticated, controller.editPost);

// Delete a post
router.delete('/:id', authMiddleware.authenticated, controller.deletePost);

module.exports = router;
