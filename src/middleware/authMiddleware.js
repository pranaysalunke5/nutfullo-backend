import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Cookie
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // 2. Bearer (fallback)
        if (!token && req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};