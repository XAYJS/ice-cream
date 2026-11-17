const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const verifyToken = require('../middlewares/authMiddleware'); // (ตัวเลือกเสริม: หากต้องการบังคับล็อกอิน)

// กำหนด Endpoint ตามที่คุณต้องการ
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;