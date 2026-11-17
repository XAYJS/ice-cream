const mysql = require('mysql2/promise'); // 👈 ປ່ຽນມາໃຊ້ /promise
require('dotenv').config();

// ໃຊ້ createPool แทน createConnection เพื่อความเสถียรและการรองรับ Promise
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ทดสอบการเชื่อมต่อตอนรันเซิร์ฟเวอร์
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ เชื่อมต่อ MySQL สำเร็จ!');
        connection.release(); // คืน Connection กลับสู่ Pool
    } catch (err) {
        console.error('❌ เชื่อมຕໍ່ MySQL ไม่สำเร็จ:', err.message);
    }
})();

module.exports = db;