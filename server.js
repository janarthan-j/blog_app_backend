// server.js
const express = require('express');
const database = require('./Database/database');
const authRouter = require('./Router/authRouter'); // Adjust the path as needed

const userRouter = require('./Router/userRouter'); // Adjust the path as needed
const postRouter = require('./Router/postRouter'); // Adjust the path as needed

const app = express();
app.use(express.json());

// Use the router for all API endpoints
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
