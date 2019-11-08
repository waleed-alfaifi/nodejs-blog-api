const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/commentController');

const router = express.Router();

router.get('/:postId', authMiddleware.authenticated, controller.getComments);
router.post('/:postId', authMiddleware.authenticated, controller.addComment);

module.exports = router;
