import User from '../models/userModel.js';

export const createUser = async (req, res) => {
    try {
        const { name, email, mobile, role } = req.body;

        // basic validation
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // create user
        const user = await User.create({
            name,
            email,
            mobile,
            role,
        });

        res.status(201).json({
            success: true,
            data: user,
            token: user.getSignedJwtToken(),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};