const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { generateAccessToken, generateRefreshToken } = require('../services/authService');

// 1. ฟังก์ชันสมัครสมาชิก
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'กรุณากรอก Username และ Password ให้ครบถ้วน' });
        }

        // ตรวจสอบว่ามี username นี้ในระบบแล้วหรือยัง
        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username นี้ถูกใช้งาน, กรุณาใช้ชื่ออื่น' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'staff';

        // บันทึกลงฐานข้อมูล
        await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, userRole]
        );

        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จเรียบร้อย' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. ฟังก์ชันเข้าสู่ระบบ
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
        }

        // ค้นหาผู้ใช้งานจาก Database
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
        }

        const user = users[0];

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
        }

        // สร้าง Payload สำหรับ Token
        const payload = { id: user.id, username: user.username, role: user.role };
        
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ',
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. ฟังก์ชันต่ออายุ Access Token ด้วย Refresh Token
const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'ไม่พบ Refresh Token' });
    }

    try {
        // ตรวจสอบความถูกต้องของ Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret');
        
        // สร้าง Access Token ใหม่ให้
        const user = { id: decoded.id, username: decoded.username, role: decoded.role };
        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (err) {
        return res.status(403).json({ error: 'Refresh Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
    }
};

// ส่งออกฟังก์ชันทั้งหมดให้ครบถ้วนเพื่อไม่ให้เกิด Error handler เป็น undefined
module.exports = {
    register,
    login,
    refreshTokenHandler
};