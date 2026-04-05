import sendEmail from '../utils/sendEmail.js';

export const sendOtp = async (req, res) => {
    try {
        const { input } = req.body;
        if (!input) return res.status(400).json({ success: false, message: "Input required" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Send OTP only if input is an email
        if (input.includes('@')) {
            await sendEmail({
                email: input,
                subject: "Your Nutfullo OTP",
                otp,
            });
        }

        // TODO: Save OTP in DB with expiry for verification if needed

        res.status(200).json({ success: true, message: "OTP sent", otp });
    } catch (error) {
        console.error("❌ SEND OTP ERROR:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};