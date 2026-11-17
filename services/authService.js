const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// ฟังก์ชันสร้าง Access Token (อายุสั้น: 15 นาที)
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '15m' } // 15 นาที
    );
};

// ฟังก์ชันสร้าง Refresh Token (อายุยาว: 7 วัน)
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
        { expiresIn: '7d' } // 7 วัน
    );
};

// 1. ตรรกะการสมัครสมาชิก
const register = async (username, password, role) => {
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
        throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว');
    }

    if (!password || password.length < 8) {
        throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรขึ้นไป');
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        throw new Error('รหัสผ่านต้องประกอบด้วย ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข อย่างน้อยอย่างละ 1 ตัว');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.createUser(username, hashedPassword, role);
    return newUser;
};

// 2. ตรรกะการเข้าสู่ระบบ (ออก 2 Token)
const login = async (username, password) => {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
        throw new Error('ไม่พบชื่อผู้ใช้นี้ในระบบ');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('รหัสผ่านไม่ถูกต้อง');
    }

    // สร้าง Token ทั้ง 2 แบบ
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // (แนะนำ) บันทึก refreshToken ลงฐานข้อมูลไว้ตรวจสอบความถูกต้องทีหลังได้ (Optional)
    // await userModel.saveRefreshToken(user.id, refreshToken);

    return { 
        message: 'เข้าสู่ระบบสำเร็จ', 
        accessToken, 
        refreshToken, 
        user: { id: user.id, username: user.username, role: user.role } 
    };
};

module.exports = { 
    register, 
    login, 
    generateAccessToken,
    generateRefreshToken
};