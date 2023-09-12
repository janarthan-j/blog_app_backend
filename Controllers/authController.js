// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config'); // Adjust the path as needed
const db = require('../Database/database'); // Adjust the path as needed

exports.signup = async (req, res) => {
    console.log(req.body)
    try {
        const { username, password, isAdmin } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)';
        const values = [username, hashedPassword, isAdmin || false];

        db.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error during registration:', error);
                res.status(500).json({ message: 'Registration failed' });
            } else {
                res.status(201).json({ message: 'Registration successful' });
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error('Error during login:', error);
                res.status(500).json({ message: 'Login failed' });
            } else if (results.length === 0) {
                res.status(401).json({ message: 'Invalid username or password' });
            } else {
                const user = results[0];
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (isPasswordValid) {
                    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, config.jwtSecret);
                    res.status(200).json({ token, user_id: user.id, username: user.username, isAdmin: user.isAdmin });
                } else {
                    res.status(401).json({ message: 'Invalid username or password' });
                }
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        db.query(
            'SELECT * FROM users WHERE username = ? AND isAdmin = 1',
            [username],
            async (error, results) => {
                if (error) {
                    console.error('Error during admin login:', error);
                    res.status(500).json({ message: 'Admin login failed' });
                } else if (results.length === 0) {
                    res.status(401).json({ message: 'Invalid admin credentials' });
                } else {
                    const admin = results[0];
                    const isPasswordValid = await bcrypt.compare(password, admin.password);

                    if (isPasswordValid) {
                        const token = jwt.sign(
                            { id: admin.id, username: admin.username, isAdmin: admin.isAdmin },
                            config.jwtSecret
                        );
                        res.status(200).json({ token, admin });
                    } else {
                        res.status(401).json({ message: 'Invalid admin credentials' });
                    }
                }
            }
        );
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Admin login failed' });
    }
};

