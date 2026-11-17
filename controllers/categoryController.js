const categoryService = require('../services/categoryService');

// GET /api/v1/categories
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.fetchAllCategories();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/v1/categories
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await categoryService.addNewCategory(name, description);
        res.status(201).json({
            message: 'เพิ่มหมวดหมู่สำเร็จ',
            category: newCategory
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /api/v1/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedCategory = await categoryService.editCategory(id, name, description);
        res.status(200).json({
            message: 'แก้ไขข้อมูลหมวดหมู่สำเร็จ',
            category: updatedCategory
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/v1/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoryService.removeCategory(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};