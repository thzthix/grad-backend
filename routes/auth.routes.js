const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/verify-token', authController.verifyToken); 
module.exports = router;
