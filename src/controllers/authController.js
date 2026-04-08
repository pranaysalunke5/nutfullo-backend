import crypto from 'crypto';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

// 🔹 SEND OTP
export const sendOtp = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input) {
            return res.status(400).json({ success: false, message: "Email or mobile required" });
        }

        // Detect email or mobile
        const isEmail = input.includes('@');

        let user = await User.findOne(
            isEmail ? { email: input } : { mobile: input }
        ).select('+otp +otpExpire');

        if (!user) {
            user = await User.create(
                isEmail ? { email: input } : { mobile: input }
            );
        }

        // 🚨 Rate limit (1 min)
        if (user.otpExpire && user.otpExpire > Date.now() - 60 * 1000) {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another OTP",
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        user.otp = hashedOtp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;

        await user.save();

        // Send Email
        if (isEmail) {
            await sendEmail({
                email: input,
                subject: "Your Nutfullo OTP",
                otp,
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error("SEND OTP ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 🔹 VERIFY OTP
export const verifyOtp = async (req, res) => {
    try {
        const { input, otp } = req.body;

        if (!input || !otp) {
            return res.status(400).json({ success: false, message: "Input and OTP required" });
        }

        const isEmail = input.includes('@');

        const user = await User.findOne(
            isEmail ? { email: input } : { mobile: input }
        ).select('+otp +otpExpire');

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Hash incoming OTP
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (
            user.otp !== hashedOtp ||
            user.otpExpire < Date.now()
        ) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpire = undefined;
        user.isVerified = true;

        await user.save();

        // Generate JWT
        const token = user.getSignedJwtToken();

        // 🍪 Set Cookie (IMPORTANT)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
                mobile: user.mobile,
            },
        });

    } catch (error) {
        console.error("VERIFY OTP ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
};