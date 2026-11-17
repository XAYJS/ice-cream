const inventoryModel = require('../models/inventoryModel');
const productModel = require('../models/productModel');

const fetchInventorySummary = async () => {
    return await inventoryModel.getInventorySummary();
};

const processRestock = async (productId, quantity, newCost) => {
    if (!productId || quantity === undefined || quantity <= 0) {
        throw new Error('กรุณาระบุรหัสสินค้า (productId) และจำนวนที่รับเข้าให้ถูกต้อง (> 0)');
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
        throw new Error('ไม่พบสินค้าหรือวัตถุดิบนี้ในระบบ');
    }

    await inventoryModel.addStock(productId, quantity, newCost);
    return { message: 'บันทึกรับสินค้าเข้าสต็อกสำเร็จ', productId, added_quantity: quantity };
};

const processManualAdjustment = async (productId, newStock) => {
    if (!productId || newStock === undefined || newStock < 0) {
        throw new Error('กรุณาระบุรหัสสินค้าและจำนวนสต็อกคงเหลือจริงที่ถูกต้อง');
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
        throw new Error('ไม่พบสินค้าหรือวัตถุดิบนี้ในระบบ');
    }

    await inventoryModel.adjustStock(productId, newStock);
    return { message: 'ปรับปรุงสต็อกคงเหลือสำเร็จ', productId, new_stock: newStock };
};

const fetchLowStockAlerts = async () => {
    return await inventoryModel.getLowStockAlerts();
};

const fetchExpiryAlerts = async () => {
    return await inventoryModel.getExpiryAlerts();
};

module.exports = {
    fetchInventorySummary,
    processRestock,
    processManualAdjustment,
    fetchLowStockAlerts,
    fetchExpiryAlerts
};