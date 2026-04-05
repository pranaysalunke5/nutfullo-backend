import mongoose from 'mongoose';

const onboardSchema = new mongoose.Schema(
{
    role: {
        type: String,
        required: true,
        enum: [
            'Gym Partner',
            'Retail Partner',
            'Wholesaler',   // ✅ FIXED
            'Distributor'
        ],
    },
    ownerName: {
        type: String,
        required: true,
    },
    ownerMobile: {
        type: String,
        required: true,
    },
    trainerName: String,
    trainerMobile: String,
    gymName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    docType: {
        type: String,
        default: "NA",
    },
    docNumber: String,
    onboardedBy: {
        type: String,
        required: true,
    },

    document: {
        url: { type: String, default: null },
        public_id: { type: String, default: null },
    }

}, { timestamps: true });

export default mongoose.model("onboard", onboardSchema);