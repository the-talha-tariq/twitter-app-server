const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/auth');

router.post('/register',userController.create);
router.post('/login',userController.authenticate);

router.get("/profile", verifyToken, userController.getProfile);

module.exports = router;