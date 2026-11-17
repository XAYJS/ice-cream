require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// 1. เปิดใช้งาน Middlewares พื้นฐานไว้บนสุด (สำคัญมาก!)
app.use(cors());
app.use(express.json());

// 2. นำเข้า Routes ต่างๆ
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

// 3. กำหนด Endpoint เส้นทาง API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
// Test Endpoint
app.get('/', (req, res) => {
    res.send('API Server is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});