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

import User from '../models/User.js'; // Adjust path based on your structure
import sendEmail from '../utils/sendEmail.js'; 
import crypto from 'crypto';

export const sendOtp = async (req, res) => {
    try {
        const { input } = req.body; // 'input' comes from your frontend state

        if (!input) {
            return res.status(400).json({ success: false, message: "Please provide email or mobile number" });
        }

        // 1. Determine if input is email or mobile and find user
        const isEmail = input.includes('@');
        const query = isEmail ? { email: input } : { mobile: input };

        const user = await User.findOne(query);

        // 2. If user doesn't exist, send the 404 for your "User not available" toast
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not available. Please contact administrator." 
            });
        }

        // 3. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // 4. Save hashed OTP to user (valid for 5 mins)
        user.otp = hashedOtp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;
        await user.save();

        // 5. Send OTP to the user's REGISTERED email (even if they entered mobile)
        await sendEmail({
            email: user.email,
            subject: "Your Nutfullo Verification Code",
            message: `Your OTP is ${otp}. It expires in 5 minutes.`,
        });

        // 6. Return success with masked email for the "Check Mail" toast
        const maskedEmail = user.email.replace(/(.{2})(.*)(?=@)/, "$1***");
        
        res.status(200).json({
            success: true,
            message: `OTP sent! Please check your mail: ${maskedEmail}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
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