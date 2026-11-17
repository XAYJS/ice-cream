const db = require('../config/db');

// 1. ดึงข้อมูลสินค้าทั้งหมด (พร้อมดึงชื่อหมวดหมู่มาแสดงด้วย JOIN)
const getAllProducts = async () => {
    const [rows] = await db.query(`
        SELECT p.*, c.name AS category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.id DESC
    `);
    return rows;
};

// 2. ค้นหาตาม ID
const getProductById = async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
};

// 3. เพิ่มสินค้าหรือวัตถุดิบใหม่
const createProduct = async (data) => {
    const { name, category_id, price, cost, stock, unit, type } = data;
    const [result] = await db.query(
        `INSERT INTO products (name, category_id, price, cost, stock, unit, type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, category_id, price || 0, cost || 0, stock || 0, unit || 'ชิ้น', type || 'product']
    );
    return { id: result.insertId, ...data };
};

// 4. แก้ไขข้อมูลสินค้า
const updateProduct = async (id, data) => {
    const { name, category_id, price, cost, stock, unit, type } = data;
    await db.query(
        `UPDATE products SET name = ?, category_id = ?, price = ?, cost = ?, stock = ?, unit = ?, type = ? WHERE id = ?`,
        [name, category_id, price, cost, stock, unit, type, id]
    );
    return { id, ...data };
};

// 5. ลบสินค้า
const deleteProduct = async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};