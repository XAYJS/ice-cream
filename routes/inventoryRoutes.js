const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getInventory);
router.post('/restock', inventoryController.restockItem);
router.post('/adjust', inventoryController.adjustItemStock);
router.get('/alerts/low-stock', inventoryController.getLowStock);
router.get('/alerts/expiry', inventoryController.getExpiry);

module.exports = router;