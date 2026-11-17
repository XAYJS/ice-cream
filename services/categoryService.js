const categoryModel = require('../models/categoryModel');

const fetchAllCategories = async () => {
    return await categoryModel.getAllCategories();
};

const addNewCategory = async (name, description) => {
    if (!name) {
        throw new Error('กรุณากรอกชื่อหมวดหมู่ (name)');
    }
    
    // ตรวจสอบว่ามีชื่อหมวดหมู่นี้อยู่แล้วหรือยัง
    const existing = await categoryModel.getAllCategories();
    const isDuplicate = existing.some(cat => cat.name === name);
    if (isDuplicate) {
        throw new Error('มีชื่อหมวดหมู่นี้ในระบบแล้ว');
    }

    return await categoryModel.createCategory(name, description);
};

const editCategory = async (id, name, description) => {
    const category = await categoryModel.getCategoryById(id);
    if (!category) {
        throw new Error('ไม่พบหมวดหมู่ที่ต้องการแก้ไข');
    }

    return await categoryModel.updateCategory(id, name, description);
};

const removeCategory = async (id) => {
    const category = await categoryModel.getCategoryById(id);
    if (!category) {
        throw new Error('ไม่พบหมวดหมู่ที่ต้องการลบ');
    }

    await categoryModel.deleteCategory(id);
    return { message: 'ลบหมวดหมู่สำเร็จ' };
};

module.exports = {
    fetchAllCategories,
    addNewCategory,
    editCategory,
    removeCategory
};