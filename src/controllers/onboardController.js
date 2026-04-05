import Onboard from "../models/onboard.js";

export const onboardGym = async (req, res) => {
    try {

        const newGym = await Onboard.create({
            ...req.body,
            document: {
                url: req.file?.path || null,
                public_id: req.file?.filename || null,
            },
        });

        res.status(201).json({
            success: true,
            message: "Onboarding successful!",
            data: newGym,
        });

    } catch (error) {
        console.error("❌ ONBOARDING DATABASE ERROR:", error);

        // Check if it's a Mongoose validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};