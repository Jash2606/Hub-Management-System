const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// User Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = generateToken(user.id, user.role);
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
