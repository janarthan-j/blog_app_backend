// router/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController'); // Adjust the path as needed

router.put('/edit-user/:id', userController.editUser);
router.delete('/delete-user/:id', userController.deleteUser);

module.exports = router;
