// import crypto from 'crypto';
// import User from '../models/userModel.js';
// import sendEmail from '../utils/sendEmail.js';

// // 🔹 SEND OTP
// export const sendOtp = async (req, res) => {
//     try {
//         const { input } = req.body;

//         if (!input) {
//             return res.status(400).json({ success: false, message: "Email or mobile required" });
//         }

//         // Detect email or mobile
//         const isEmail = input.includes('@');

//         let user = await User.findOne(
//             isEmail ? { email: input } : { mobile: input }
//         ).select('+otp +otpExpire');

//         if (!user) {
//             user = await User.create(
//                 isEmail ? { email: input } : { mobile: input }
//             );
//         }

//         // 🚨 Rate limit (1 min)
//         if (user.otpExpire && user.otpExpire > Date.now() - 60 * 1000) {
//             return res.status(429).json({
//                 success: false,
//                 message: "Please wait before requesting another OTP",
//             });
//         }

//         // Generate OTP
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         // Hash OTP
//         const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

//         user.otp = hashedOtp;
//         user.otpExpire = Date.now() + 5 * 60 * 1000;

//         await user.save();

//         // Send Email
//         if (isEmail) {
//             await sendEmail({
//                 email: input,
//                 subject: "Your Nutfullo OTP",
//                 otp,
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//         });

//     } catch (error) {
//         console.error("SEND OTP ERROR:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// // 🔹 VERIFY OTP
// export const verifyOtp = async (req, res) => {
//     try {
//         const { input, otp } = req.body;

//         if (!input || !otp) {
//             return res.status(400).json({ success: false, message: "Input and OTP required" });
//         }

//         const isEmail = input.includes('@');

//         const user = await User.findOne(
//             isEmail ? { email: input } : { mobile: input }
//         ).select('+otp +otpExpire');

//         if (!user) {
//             return res.status(400).json({ success: false, message: "User not found" });
//         }

//         // Hash incoming OTP
//         const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

//         if (
//             user.otp !== hashedOtp ||
//             user.otpExpire < Date.now()
//         ) {
//             return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//         }

//         // Clear OTP
//         user.otp = undefined;
//         user.otpExpire = undefined;
//         user.isVerified = true;

//         await user.save();

//         // Generate JWT
//         const token = user.getSignedJwtToken();

//         // 🍪 Set Cookie (IMPORTANT)
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//         });

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             user: {
//                 id: user._id,
//                 role: user.role,
//                 email: user.email,
//                 mobile: user.mobile,
//             },
//         });

//     } catch (error) {
//         console.error("VERIFY OTP ERROR:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// export const getMe = async (req, res) => {
//     res.json({
//         success: true,
//         user: req.user,
//     });
// };

import sendEmail from '../utils/sendEmail.js'; 
import User from '../models/userModel.js';
import crypto from 'crypto';

// Inside your sendOtp controller
export const sendOtp = async (req, res) => {
    try {
        const { input } = req.body;
        
        // Find user by email or mobile
        const user = await User.findOne({
            $or: [{ email: input }, { mobile: input }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // CRITICAL CHECK: Does the user found in DB actually have an email?
        if (!user.email) {
            return res.status(400).json({ 
                success: false, 
                message: "User found, but no email is registered for this account." 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = crypto.createHash('sha256').update(otp).digest('hex');
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Pass 'otp' and 'email' correctly
        await sendEmail({
            email: user.email, 
            subject: "Nutfullo Login OTP",
            otp: otp // Match the key in sendEmail.js
        });

        res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        console.error("Internal Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { input, otp } = req.body;
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Find user by either field and check OTP
        const isEmail = input.includes('@');
        const user = await User.findOne({
            ...(isEmail ? { email: input } : { mobile: input }),
            otp: hashedOtp,
            otpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP fields after successful verification
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        // Send back user data including the role for your sidebar logic
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role, // This matches your Sidebar roles
                profileImage: user.profileImage
            },
            token: "your_generated_jwt_token_here" 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
};