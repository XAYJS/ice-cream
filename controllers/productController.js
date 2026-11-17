const productService = require('../services/productService');

// GET /api/v1/products
const getProducts = async (req, res) => {
    try {
        const products = await productService.fetchAllProducts();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/v1/products
const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.addNewProduct(req.body);
        res.status(201).json({
            message: 'เพิ่มสินค้าหรือวัตถุดิบสำเร็จ',
            product: newProduct
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /api/v1/products/:id
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.editProduct(id, req.body);
        res.status(200).json({
            message: 'แก้ไขข้อมูลสินค้าสำเร็จ',
            product: updatedProduct
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/v1/products/:id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productService.removeProduct(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};