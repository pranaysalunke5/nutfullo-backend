import mongoose from 'mongoose';

const onboardSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: ['Gym Partner', 'Wholesale Partner', 'Retailer', 'Trainer'], // Adjust based on your actual roles
        },
        ownerName: {
            type: String,
            required: [true, 'Owner name is required'],
            trim: true,
        },
        ownerMobile: {
            type: String,
            required: [true, 'Owner mobile is required'],
            match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
        },
        trainerName: {
            type: String,
            trim: true,
        },
        trainerMobile: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
        },
        gymName: {
            type: String,
            required: [true, 'Business/Gym name is required'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
        },
        docType: {
            type: String,
            default: 'NA',
        },
        docNumber: {
            type: String,
            trim: true,
        },
        onboardedBy: {
            type: String,
            required: [true, 'Sales person mobile is required'],
            match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
        },
        // We keep this as a string for a URL later, but it's optional for now
        documentUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

const Onboard = mongoose.model('onboard', onboardSchema);

export default Onboard;