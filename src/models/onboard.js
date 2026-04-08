import mongoose from "mongoose";

const onboardSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            enum: [
                "Gym Partner",
                "Retail Partner",
                "Wholesaler",
                "Distributor",
            ],
        },
        ownerName: {
            type: String,
            required: true,
        },
        ownerEmail: {
            type: String,
            validate: {
                validator: function (v) {
                    // Only validate if email exists
                    return !v || /^\S+@\S+\.\S+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
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
        },
    },
    { timestamps: true },
);

export default mongoose.model("onboard", onboardSchema);
