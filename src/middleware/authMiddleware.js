import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ensure you have a User model
import colors from 'colors';

// 1. Protect Routes: Verifies the JWT token in the header
export const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(colors.red(`[Auth Error]: ${error.message}`));
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// 2. Authorize Roles: Checks if the user's role is allowed
// Usage: authorize('admin', 'staff')
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

