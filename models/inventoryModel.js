const db = require('../config/db');

// 1. ดึงรายงานสรุปสต็อกสินค้าและวัตถุดิบทั้งหมด
const getInventorySummary = async () => {
    const [rows] = await db.query(`
        SELECT id, name, stock, min_stock, unit, cost, price, type, expiry_date, 
               (stock * cost) AS total_cost_value
        FROM products
        ORDER BY id DESC
    `);
    return rows;
};

// 2. อัปเดตเพิ่มจำนวนสต็อก (Restock)
const addStock = async (productId, quantity, newCost) => {
    // อัปเดตจำนวน stock เพิ่มขึ้น และอัปเดตต้นทุนล่าสุด (cost) ถ้ามีระบุมา
    if (newCost !== undefined) {
        await db.query(
            `UPDATE products SET stock = stock + ?, cost = ? WHERE id = ?`,
            [quantity, newCost, productId]
        );
    } else {
        await db.query(
            `UPDATE products SET stock = stock + ? WHERE id = ?`,
            [quantity, productId]
        );
    }
};

// 3. ปรับปรุง/ลดจำนวนสต็อก Manual (ตรวจนับสต็อก / ของเสีย)
const adjustStock = async (productId, newStock) => {
    await db.query(
        `UPDATE products SET stock = ? WHERE id = ?`,
        [newStock, productId]
    );
};

// 4. ดึงรายการที่สินค้าใกล้หมด (ต่ำกว่า Min Stock)
const getLowStockAlerts = async () => {
    const [rows] = await db.query(`
        SELECT * FROM products 
        WHERE stock <= min_stock
        ORDER BY stock ASC
    `);
    return rows;
};

// 5. ดึงรายการสินค้า/วัตถุดิบที่ใกล้หมดอายุ
const getExpiryAlerts = async () => {
    // ตัวอย่าง: แจ้งเตือนสินค้าที่จะหมดอายุภายใน 7 วันข้างหน้า หรือหมดอายุไปแล้ว
    const [rows] = await db.query(`
        SELECT * FROM products 
        WHERE expiry_date IS NOT NULL 
        AND expiry_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)
        ORDER BY expiry_date ASC
    `);
    return rows;
};

module.exports = {
    getInventorySummary,
    addStock,
    adjustStock,
    getLowStockAlerts,
    getExpiryAlerts
};