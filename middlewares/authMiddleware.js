const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. ดึงค่า Authorization จาก Header ของ Request
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // รูปแบบคือ "Bearer <token>"

    // 2. ถ้าไม่มี Token ส่งมา
    if (!token) {
        return res.status(401).json({ error: 'การเข้าถึงถูกปฏิเสธ: ไม่พบ Token ยืนยันตัวตน' });
    }

    try {
        // 3. ตรวจสอบความถูกต้องของ Token ด้วย JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET || ' fallback_secret');
        
        // 4. เก็บข้อมูลผู้ใช้ที่ถอดรหัสได้ (เช่น id, username, role) ไว้ใน req.user เพื่อเอาไปใช้ต่อใน Controller
        req.user = decoded;
        
        // 5. ผ่านไปทำงานในขั้นตอนถัดไป ( Controller )
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
};

module.exports = verifyToken;