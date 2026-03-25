// src/controllers/onboardController.js

import Onboard from "../models/onboard.js";
import colors from 'colors';

export const onboardGym = async (req, res) => {
    console.log("Hiii")
    try {
        const { onboardedBy } = req.body;

        // Backend validation for the specific sales number
        const validSalesNumbers = ["9049546490", "8767334312", "9049546490"];

        if (!validSalesNumbers.includes(onboardedBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sales Number. Access Denied."
            });
        }

        // Save to MongoDB
        const newGym = await Onboard.create(req.body);

        console.log(colors.green.bold(`✅ New Onboarding: ${req.body.gymName} by ${onboardedBy}`));

        res.status(201).json({
            success: true,
            message: "Gym data saved to database!",
            data: newGym
        });
    } catch (error) {
        console.error(colors.red(`❌ Database Error: ${error.message}`));
        res.status(500).json({ 
            success: false, 
            message: "Database save failed: " + error.message 
        });
    }
};