const db = require('../config/db');

// ค้นหาผู้ใช้จาก Username (ใช้ตอน Login)
const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // ส่งข้อมูลผู้ใช้คนแรกที่เจอ
        });
    });
};

// เพิ่มผู้ใช้ใหม่ลงฐานข้อมูล (ใช้ตอน Register)
const createUser = (username, hashedPassword, role) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.query(sql, [username, hashedPassword, role || 'cashier'], (err, results) => {
            if (err) return reject(err);
            resolve({ id: results.insertId, username, role: role || 'cashier' });
        });
    });
};

module.exports = { findUserByUsername, createUser };