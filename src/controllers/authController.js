import sendEmail from '../utils/sendEmail.js';

// In-memory store for OTPs (for demo; use DB for production)
const otpStore = {};

export const sendOtp = async (req, res) => {
    try {
        const { input } = req.body;
        if (!input) return res.status(400).json({ success: false, message: "Input required" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store OTP with expiry (5 min)
        otpStore[input] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        // Send OTP only if input is an email
        if (input.includes('@')) {
            await sendEmail({
                email: input,
                subject: "Your Nutfullo OTP",
                otp,
            });
        }

        res.status(200).json({ success: true, message: "OTP sent" });
    } catch (error) {
        console.error("❌ SEND OTP ERROR:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { input, otp } = req.body;
        if (!input || !otp) return res.status(400).json({ success: false, message: "Input and OTP required" });

        const record = otpStore[input];
        if (!record) return res.status(400).json({ success: false, message: "OTP not sent" });

        if (Date.now() > record.expires) {
            delete otpStore[input];
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        if (Number(otp) !== record.otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // OTP verified → delete it
        delete otpStore[input];

        // TODO: create or fetch user in DB, return user info + token
        const fakeUser = { email: input, token: "FAKE-JWT-TOKEN" };

        res.status(200).json({ success: true, message: "OTP verified", user: fakeUser });
    } catch (error) {
        console.error("❌ VERIFY OTP ERROR:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};