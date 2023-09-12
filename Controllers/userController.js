// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Database/database'); // Adjust the path as needed
const config = require('../config'); // Adjust the path as needed

exports.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, password, isAdmin } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const { authorization } = req.headers;

        jwt.verify(authorization, config.jwtSecret, (err, decoded) => {
            if (err || (decoded.id !== userId && !decoded.isAdmin)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            db.query(
                'UPDATE users SET username = ?, password = ?, isAdmin = ? WHERE id = ?',
                [username, hashedPassword, isAdmin, userId],
                (error, results) => {
                    if (error) {
                        console.error('Error during user update:', error);
                        res.status(500).json({ message: 'User update failed' });
                    } else if (results.affectedRows === 0) {
                        res.status(404).json({ message: 'User not found' });
                    } else {
                        res.status(200).json({ message: 'User updated successfully' });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error during user update:', error);
        res.status(500).json({ message: 'User update failed' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorization } = req.headers;
        console.log(authorization)

        // Verify the admin token
        jwt.verify(authorization, config.jwtSecret, (err, decoded) => {
            if (err || !decoded.isAdmin) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            // Only admin can delete users
            db.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
                if (error) {
                    console.error('Error during user deletion:', error);
                    res.status(500).json({ message: 'User deletion failed' });
                } else if (results.affectedRows === 0) {
                    res.status(404).json({ message: 'User not found' });
                } else {
                    res.status(200).json({ message: 'User deleted successfully' });
                }
            });
        });
    } catch (error) {
        console.error('Error during user deletion:', error);
        res.status(500).json({ message: 'User deletion failed' });
    }
};
