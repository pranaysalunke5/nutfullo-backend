// import Onboard from "../models/onboard.js";

// export const onboardGym = async (req, res) => {
//     try {
//         // Basic check for identification
//         if (!req.body.ownerEmail && !req.body.ownerMobile) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Owner Email or Mobile is required."
//             });
//         }

//         const newEntry = await Onboard.create({
//             ...req.body,
//             // Mapping the file upload from Multer (or similar middleware)
//             document: {
//                 url: req.file?.path || null,
//                 public_id: req.file?.filename || null,
//             },
//         });

//         res.status(201).json({
//             success: true,
//             message: "Onboarding successful!",
//             data: newEntry,
//         });

//     } catch (error) {
//         console.error("❌ ONBOARDING DATABASE ERROR:", error);

//         if (error.name === 'ValidationError') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation Failed",
//                 errors: Object.values(error.errors).map(err => err.message)
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };

import Onboard from "../models/onboard.js";
import User from '../models/userModel.js';


export const onboardGym = async (req, res) => {
    try {
        // 1. Verify Salesperson exists
        const salesRep = await User.findOne({ mobile: req.body.onboardedBy });

        if (!salesRep) {
            return res.status(404).json({
                success: false,
                message: "Sales representative not found. Please contact support.",
            });
        }

        // 2. Proceed with Onboarding
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