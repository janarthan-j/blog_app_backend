// router/postRouter.js
const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController'); // Adjust the path as needed
const authMiddleware = require('../Middleware/authMiddleware'); // Your user authentication middleware

// router.use(authMiddleware);

router.post('/create-post', authMiddleware, postController.createPost);
router.get('/get-posts', postController.getPosts);
router.get('/get-post/:id', authMiddleware, postController.getPostById);
router.put('/edit-post/:id', authMiddleware, postController.editPost);
router.delete('/delete-post/:id', authMiddleware, postController.deletePost);

module.exports = router;
