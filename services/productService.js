const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel'); // ไว้เช็กว่ามี category_id นี้จริงไหม

const fetchAllProducts = async () => {
    return await productModel.getAllProducts();
};

const addNewProduct = async (data) => {
    if (!data.name) {
        throw new Error('กรุณากรอกชื่อสินค้าหรือวัตถุดิบ (name)');
    }

    // ถ้ามีการระบุหมวดหมู่ ให้เช็กก่อนว่าหมวดหมู่นี้มีอยู่จริงไหม
    if (data.category_id) {
        const category = await categoryModel.getCategoryById(data.category_id);
        if (!category) {
            throw new Error('ไม่พบหมวดหมู่สินค้าที่ระบุ');
        }
    }

    return await productModel.createProduct(data);
};

const editProduct = async (id, data) => {
    const product = await productModel.getProductById(id);
    if (!product) {
        throw new Error('ไม่พบสินค้าหรือวัตถุดิบที่ต้องการแก้ไข');
    }

    return await productModel.updateProduct(id, data);
};

const removeProduct = async (id) => {
    const product = await productModel.getProductById(id);
    if (!product) {
        throw new Error('ไม่พบสินค้าหรือวัตถุดิบที่ต้องการลบ');
    }

    await productModel.deleteProduct(id);
    return { message: 'ลบสินค้าหรือวัตถุดิบสำเร็จ' };
};

module.exports = {
    fetchAllProducts,
    addNewProduct,
    editProduct,
    removeProduct
};