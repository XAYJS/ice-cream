const db = require('../config/db'); // ປັບ path ตามการเชื่อมต่อ DB ของคุณ

// 1. ดึงข้อมูลหมวดหมู่ทั้งหมด
const getAllCategories = async () => {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
    return rows;
};

// 2. ค้นหาตาม ID
const getCategoryById = async (id) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
};

// 3. สร้างหมวดหมู่ใหม่
const createCategory = async (name, description) => {
    const [result] = await db.query(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description]
    );
    return { id: result.insertId, name, description };
};

// 4. แก้ไขข้อมูลหมวดหมู่
const updateCategory = async (id, name, description) => {
    await db.query(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
    );
    return { id, name, description };
};

// 5. ลบหมวดหมู่
const deleteCategory = async (id) => {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};