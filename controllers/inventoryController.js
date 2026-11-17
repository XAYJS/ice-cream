const inventoryService = require('../services/inventoryService');

// GET /api/v1/inventory
const getInventory = async (req, res) => {
    try {
        const summary = await inventoryService.fetchInventorySummary();
        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/v1/inventory/restock
const restockItem = async (req, res) => {
    try {
        const { productId, quantity, cost } = req.body;
        const result = await inventoryService.processRestock(productId, quantity, cost);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /api/v1/inventory/adjust
const adjustItemStock = async (req, res) => {
    try {
        const { productId, newStock } = req.body;
        const result = await inventoryService.processManualAdjustment(productId, newStock);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// GET /api/v1/inventory/alerts/low-stock
const getLowStock = async (req, res) => {
    try {
        const alerts = await inventoryService.fetchLowStockAlerts();
        res.status(200).json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/v1/inventory/alerts/expiry
const getExpiry = async (req, res) => {
    try {
        const alerts = await inventoryService.fetchExpiryAlerts();
        res.status(200).json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getInventory,
    restockItem,
    adjustItemStock,
    getLowStock,
    getExpiry
};