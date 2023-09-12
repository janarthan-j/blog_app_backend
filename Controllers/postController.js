// controllers/postController.js
const db = require('../Database/database'); // Adjust the path as needed

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id; // Assuming user authentication middleware sets req.user

        db.query(
            'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
            [title, content, userId],
            (error, results) => {
                if (error) {
                    console.error('Error during post creation:', error);
                    res.status(500).json({ message: 'Post creation failed' });
                } else {
                    res.status(201).json({ message: 'Post created successfully' });
                }
            }
        );
    } catch (error) {
        console.error('Error during post creation:', error);
        res.status(500).json({ message: 'Post creation failed' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        db.query('SELECT * FROM posts', (error, results) => {
            if (error) {
                console.error('Error fetching posts:', error);
                res.status(500).json({ message: 'Failed to fetch posts' });
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        db.query('SELECT * FROM posts WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error('Error fetching post:', error);
                res.status(500).json({ message: 'Failed to fetch post' });
            } else if (results.length === 0) {
                res.status(404).json({ message: 'Post not found' });
            } else {
                res.status(200).json(results[0]);
            }
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Failed to fetch post' });
    }
};

exports.editPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        db.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [title, content, id],
            (error, results) => {
                if (error) {
                    console.error('Error during post edit:', error);
                    res.status(500).json({ message: 'Post edit failed' });
                } else if (results.affectedRows === 0) {
                    res.status(404).json({ message: 'Post not found' });
                } else {
                    res.status(200).json({ message: 'Post edited successfully' });
                }
            }
        );
    } catch (error) {
        console.error('Error during post edit:', error);
        res.status(500).json({ message: 'Post edit failed' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        db.query('DELETE FROM posts WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error('Error during post deletion:', error);
                res.status(500).json({ message: 'Post deletion failed' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Post not found' });
            } else {
                res.status(200).json({ message: 'Post deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error during post deletion:', error);
        res.status(500).json({ message: 'Post deletion failed' });
    }
};
