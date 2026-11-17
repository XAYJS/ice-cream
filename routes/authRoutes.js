const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// เส้นทาง API: POST /api/auth/register และ POST /api/auth/login
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;